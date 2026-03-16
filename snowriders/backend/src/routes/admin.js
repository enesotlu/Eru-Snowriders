const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

const router = express.Router();
router.use(protect, adminOnly); // Tüm admin route'ları için koruma

// POST /api/admin/events — yeni etkinlik oluştur
router.post('/events', [
  body('title').trim().notEmpty().withMessage('Etkinlik adı zorunludur'),
  body('description').trim().notEmpty().withMessage('Açıklama zorunludur'),
  body('date').isISO8601().withMessage('Geçerli bir tarih girin'),
  body('registrationDeadline').isISO8601().withMessage('Geçerli bir son kayıt tarihi girin'),
  body('capacity').isInt({ min: 1, max: 500 }).withMessage('Kontenjan 1 ile 500 arasında olmalıdır'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // Geçmiş tarih kontrolü
  const eventDate = new Date(req.body.date);
  const deadlineDate = new Date(req.body.registrationDeadline);
  const now = new Date();

  // Reset time for "past date" checks
  now.setHours(0, 0, 0, 0);

  if (eventDate < now) {
    return res.status(400).json({ success: false, message: 'Geçmiş tarihli etkinlik oluşturamazsınız.' });
  }

  if (deadlineDate > eventDate) {
    return res.status(400).json({ success: false, message: 'Son kayıt tarihi etkinlik tarihinden sonra olamaz.' });
  }

  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// PUT /api/admin/events/:id — etkinlik düzenle
router.put('/events/:id', [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('date').optional().isISO8601(),
  body('registrationDeadline').optional().isISO8601(),
  body('capacity').optional().isInt({ min: 1, max: 500 }).withMessage('Kontenjan 1 ile 500 arasında olmalıdır'),
  body('startTime').optional().trim(),
  body('endTime').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });

    const eventDate = req.body.date ? new Date(req.body.date) : new Date(existingEvent.date);
    const deadlineDate = req.body.registrationDeadline ? new Date(req.body.registrationDeadline) : new Date(existingEvent.registrationDeadline);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Sadece yeni bir tarih giriliyorsa "geçmiş tarih" kontrolü yap
    if (req.body.date && eventDate < now) {
      return res.status(400).json({ success: false, message: 'Geçmiş tarihli etkinlik oluşturamazsınız.' });
    }

    if (deadlineDate > eventDate) {
      return res.status(400).json({ success: false, message: 'Son kayıt tarihi etkinlik tarihinden sonra olamaz.' });
    }

    const allowedFields = ['title', 'description', 'date', 'registrationDeadline', 'startTime', 'endTime', 'location', 'capacity'];
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// DELETE /api/admin/events/:id — etkinlik sil
router.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });
    
    // İlgili kayıtları da sil
    await Registration.deleteMany({ eventId: req.params.id });
    
    res.json({ success: true, message: 'Etkinlik başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// GET /api/admin/events — tüm etkinlikleri getir (admin)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// GET /api/admin/events/:id/registrations — kayıt olan kişiler (Event.registeredUsers üzerinden)
router.get('/events/:id/registrations', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registeredUsers', 'name surname studentNumber email department phone');
    
    if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });

    // Populate sonucu bazen null dönebilir (kullanıcı silinmişse)
    const users = event.registeredUsers
      .filter(user => user !== null) // Silinmiş kullanıcıları temizle
      .map(u => ({
        ...u.toObject(),
        registeredAt: u.createdAt // User modelindeki createdAt (asıl kayıt tarihi Registration'dadır ama bu da yakındır)
      }));

    res.json({ success: true, users, total: users.length });
  } catch (error) {
    console.error('Registration fetch error:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// GET /api/admin/events/:id/registrations/csv — katılımcıları CSV olarak indir
router.get('/events/:id/registrations/csv', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registeredUsers', 'name surname studentNumber email department phone');
      
    if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });

    const header = 'Ad,Soyad,Öğrenci No,Bölüm,Telefon,Email';
    const rows = event.registeredUsers
      .filter(u => u !== null)
      .map(u => {
        return `"${u.name || ''}","${u.surname || ''}","${u.studentNumber || ''}","${u.department || ''}","${u.phone || ''}","${u.email || ''}"`;
      });
      
    const csv = [header, ...rows].join('\n');

    const filename = encodeURIComponent(`${event.title}_katilimcilar.csv`);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    
    // BOM for Excel (Turkish characters support)
    res.send(Buffer.from('\uFEFF' + csv, 'utf8'));
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// GET /api/admin/users — tüm üyeleri getir
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users, total: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

module.exports = router;
