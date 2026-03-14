const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// GET /api/users/me — kendi profilini getir
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// PUT /api/users/me — profil güncelle
router.put('/me', protect, [
  body('name').optional().trim().notEmpty().withMessage('İsim boş olamaz'),
  body('surname').optional().trim().notEmpty().withMessage('Soyisim boş olamaz'),
  body('department').optional().trim().notEmpty().withMessage('Bölüm boş olamaz'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const allowedFields = ['name', 'surname', 'department'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

module.exports = router;
