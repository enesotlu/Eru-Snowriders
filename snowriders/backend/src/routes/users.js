const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profile-images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Sadece resim dosyaları yüklenebilir'), false);
  }
});

// POST /api/users/profile-image
router.post('/profile-image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resim yüklenemedi' });
    }

    const imagePath = `/src/uploads/profile-images/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { profileImage: imagePath }, { new: true });
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// GET /api/users/me — kendi profilini getir
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean(); // lean() ensures plain JS object with all fields including createdAt
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
