const express = require('express');
const { protect } = require('../middleware/auth');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const router = express.Router();

// GET /api/events — tüm etkinlikleri getir
router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    
    // Kullanıcının kayıtlarını tek seferde al
    const userRegistrations = await Registration.find({ userId: req.user._id });
    const regMap = {};
    userRegistrations.forEach(reg => {
      regMap[reg.eventId.toString()] = reg;
    });
    
    // Her etkinlik için kullanıcının kayıtlı olup olmadığını ve değerlendirmesini işaretle
    const eventsWithStatus = events.map(event => {
      const eventObj = event.toJSON();
      const regObj = regMap[event._id.toString()];
      
      eventObj.isRegistered = !!regObj;
      if (regObj) {
        eventObj.userRating = regObj.rating;
        eventObj.userComment = regObj.comment;
      }
      return eventObj;
    });

    res.json({ success: true, events: eventsWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// GET /api/events/:id — etkinlik detayı
router.get('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });
    
    const eventObj = event.toJSON();
    
    const registration = await Registration.findOne({ userId: req.user._id, eventId: event._id });
    eventObj.isRegistered = !!registration;
    if (registration) {
      eventObj.userRating = registration.rating;
      eventObj.userComment = registration.comment;
    }

    res.json({ success: true, event: eventObj });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// POST /api/events/:id/register — etkinliğe kayıt
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });

    // Tarih geçmiş mi?
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ success: false, message: 'Bu etkinliğin tarihi geçmiş, kayıt yapılamaz' });
    }

    // Son kayıt tarihi geçmiş mi?
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return res.status(400).json({ success: false, message: 'Son kayıt tarihi geçmiştir. Kayıt kilitlendi.' });
    }

    // Kontenjan dolu mu?
    if (event.registeredUsers.length >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Kontenjan doldu' });
    }

    // Zaten kayıtlı mı? (güçlendirilmiş kontrol)
    const alreadyRegistered = event.registeredUsers.some(
      uid => uid.toString() === req.user._id.toString()
    );
    if (alreadyRegistered) {
      return res.status(400).json({ success: false, message: 'Bu etkinliğe zaten kayıt oldunuz.' });
    }

    // Kayıt oluştur (Transaction olmadığı için sıralama önemli)
    await Registration.create({ userId: req.user._id, eventId: event._id });
    
    // Event'e kullanıcıyı ekle (Array sync)
    event.registeredUsers.push(req.user._id);
    await event.save();

    res.json({ success: true, message: 'Etkinliğe başarıyla kayıt oldunuz' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Bu etkinliğe zaten kayıt oldunuz' });
    }
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// DELETE /api/events/:id/register — etkinlikten çık
router.delete('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });

    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ success: false, message: 'Tarihi geçmiş etkinlikten çıkılamaz' });
    }

    await Registration.findOneAndDelete({ userId: req.user._id, eventId: event._id });
    event.registeredUsers = event.registeredUsers.filter(
      uid => uid.toString() !== req.user._id.toString()
    );
    await event.save();

    res.json({ success: true, message: 'Etkinlik kaydınız iptal edildi' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// POST /api/events/:id/evaluate — etkinliği değerlendir
router.post('/:id/evaluate', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Geçerli bir puan verilmiş mi?
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Geçersiz puan. 1 ile 5 arasında olmalıdır.' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });

    // Etkinlik tarihi geçmiş mi? Sadece geçmiş etkinlikler değerlendirilebilir (isteğe bağlı ama mantıklı olan bu)
    if (new Date(event.date) >= new Date()) {
      return res.status(400).json({ success: false, message: 'Henüz gerçekleşmemiş bir etkinliği değerlendiremezsiniz.' });
    }

    // Kullanıcı kayıtlı mı kontrol et
    const registration = await Registration.findOne({ userId: req.user._id, eventId: event._id });
    if (!registration) {
      return res.status(403).json({ success: false, message: 'Bu etkinliğe katılmadığınız için değerlendiremezsiniz.' });
    }

    // Daha önce değerlendirme yapmış mı?
    if (registration.rating) {
      return res.status(400).json({ success: false, message: 'Bu etkinliği zaten değerlendirdiniz.' });
    }

    // Değerlendirmeyi kaydet
    registration.rating = rating;
    if (comment) registration.comment = comment.trim();
    registration.evaluatedAt = new Date();
    await registration.save();

    res.json({ success: true, message: 'Yanıtınız için teşekkürler.' });
  } catch (error) {
    console.error('Evaluate error:', error);
    res.status(500).json({ success: false, message: error.message || 'Sunucu hatası' });
  }
});

module.exports = router;
