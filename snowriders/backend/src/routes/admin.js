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
  body('capacity').isInt({ min: 1, max: 500 }).withMessage('Kontenjan 1 ile 500 arasında olmalıdır'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // Geçmiş tarih kontrolü
  if (new Date(req.body.date) < new Date()) {
    return res.status(400).json({ success: false, message: 'Geçmiş tarihli etkinlik oluşturamazsınız.' });
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
  body('capacity').optional().isInt({ min: 1, max: 500 }).withMessage('Kontenjan 1 ile 500 arasında olmalıdır'),
], async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });
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

// GET /api/admin/events/:id/registrations — kayıt olan kişiler
router.get('/events/:id/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.id })
      .populate('userId', 'name surname studentNumber email department phone')
      .sort({ createdAt: -1 });

    const users = registrations.map(r => ({
      ...r.userId.toObject(),
      registeredAt: r.createdAt
    }));

    res.json({ success: true, users, total: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// GET /api/admin/events/:id/registrations/csv — katılımcıları CSV olarak indir
router.get('/events/:id/registrations/csv', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });

    const registrations = await Registration.find({ eventId: req.params.id })
      .populate('userId', 'name surname studentNumber email department phone')
      .sort({ createdAt: 1 });

    const header = 'Ad,Soyad,Öğrenci No,Bölüm,Telefon,Email';
    const rows = registrations.map(r => {
      const u = r.userId;
      return `"${u.name}","${u.surname}","${u.studentNumber}","${u.department}","${u.phone || ''}","${u.email}"`;
    });
    const csv = [header, ...rows].join('\n');

    const filename = encodeURIComponent(`${event.title}_katilimcilar.csv`);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    res.send(Buffer.from('\uFEFF' + csv, 'utf8')); // BOM for Excel
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
