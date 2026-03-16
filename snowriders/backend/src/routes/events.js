const express = require('express');
const { protect } = require('../middleware/auth');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const router = express.Router();

// GET /api/events — tüm etkinlikleri getir
router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    
    // Her etkinlik için kullanıcının kayıtlı olup olmadığını işaretle
    const eventsWithStatus = events.map(event => {
      const eventObj = event.toJSON();
      eventObj.isRegistered = event.registeredUsers.some(
        userId => userId.toString() === req.user._id.toString()
      );
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
    eventObj.isRegistered = event.registeredUsers.some(
      userId => userId.toString() === req.user._id.toString()
    );

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

module.exports = router;
