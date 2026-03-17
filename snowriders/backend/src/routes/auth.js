const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailUtils = require('../utils/email');

const router = express.Router();

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const ALLOWED_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const isEmailDomainAllowed = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return (
    ALLOWED_DOMAINS.includes(domain) ||
    domain.endsWith('.edu') ||
    domain.endsWith('.edu.tr')
  );
};

// ──────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────
router.post('/register', [
  body('name').trim().notEmpty().withMessage('İsim zorunludur'),
  body('surname').trim().notEmpty().withMessage('Soyisim zorunludur'),
  body('studentNumber').trim().notEmpty().withMessage('Öğrenci numarası zorunludur'),
  body('department').trim().notEmpty().withMessage('Bölüm zorunludur'),
  body('phone').trim().notEmpty().withMessage('Telefon numarası zorunludur'),
  // normalizeEmail options: preserve dots, just lowercase the local+domain
  body('email')
    .isEmail().withMessage('Geçerli bir email girin')
    .normalizeEmail({ gmail_remove_dots: false, all_lowercase: true }),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, surname, studentNumber, department, phone, email, password } = req.body;

    // Email domain kontrolü
    if (!isEmailDomainAllowed(email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir email adresi kullanınız. Gmail, Hotmail, Outlook veya üniversite (.edu) email adresleri kabul edilmektedir.'
      });
    }

    // Tekrar kayıt kontrolü
    const existingUser = await User.findOne({ $or: [{ email }, { studentNumber }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email
          ? 'Bu email zaten kayıtlı'
          : 'Bu öğrenci numarası zaten kayıtlı'
      });
    }

    // OTP oluştur
    const verificationCode = generateOTP();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 dk

    // Kullanıcı oluştur (isVerified: false)
    await User.create({
      name, surname, studentNumber, department, phone, email, password,
      verificationCode,
      verificationCodeExpires,
      isVerified: false
    });

    // Log out the OTP for local debugging
    console.log('\n==============================\n🔑 OTP KODU:', verificationCode, '\n==============================\n');
    
    // Doğrulama mailini arka planda asenkron gönder (kullanıcıyı bekletmemek için)
    emailUtils.sendVerificationEmail(email, verificationCode).then(success => {
      if (success) console.log(`✅ Doğrulama maili gönderildi: ${email}`);
      else console.error(`❌ Doğrulama maili GÖNDERİLEMEDİ: ${email}`);
    }).catch(err => {
      console.error('Arka planda mail gönderimi hatası:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı! Email adresinize doğrulama kodu gönderildi.',
      email // frontend /verify sayfasına iletecek
    });
  } catch (error) {
    console.error('Register error details:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası', error: error.message });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/verify
// ──────────────────────────────────────────────
router.post('/verify', [
  body('email').isEmail().withMessage('Geçerli bir email girin')
    .normalizeEmail({ gmail_remove_dots: false, all_lowercase: true }),
  body('code').trim().notEmpty().withMessage('Doğrulama kodu zorunludur')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Hesap zaten doğrulanmış. Giriş yapabilirsiniz.' });
    }
    if (user.verificationCode !== code) {
      return res.status(400).json({ success: false, message: 'Hatalı doğrulama kodu' });
    }
    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Doğrulama kodunun süresi dolmuş. Lütfen tekrar kayıt olun.' });
    }

    // Doğrula
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email başarıyla doğrulandı! Şimdi giriş yapabilirsiniz.'
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/resend-code
// ──────────────────────────────────────────────
router.post('/resend-code', [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false, all_lowercase: true })
], async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.isVerified) {
      return res.status(400).json({ success: false, message: 'Geçersiz istek' });
    }

    const verificationCode = generateOTP();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 dk
    await user.save();

    console.log('\n==============================\n🔑 YENİ OTP KODU:', verificationCode, '\n==============================\n');
    
    // Doğrulama mailini arka planda asenkron gönder
    emailUtils.sendVerificationEmail(email, verificationCode).catch(err => console.error('Resend code email error:', err));
    res.json({ success: true, message: 'Yeni doğrulama kodu gönderildi.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/login  (kullanıcılar)
// ──────────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false, all_lowercase: true }),
  body('password').notEmpty().withMessage('Şifre zorunludur'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email veya şifre hatalı' });
    }

    // Admin kullanıcılar kendi endpoint'inden girsin
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin girişi için lütfen Admin Girişi sekmesini kullanın'
      });
    }

    // Email doğrulama kontrolü
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Lütfen önce hesabınızı doğrulayın. Email adresinize gönderilen kodu girin.',
        needsVerification: true,
        email: user.email
      });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id, name: user.name, surname: user.surname,
        email: user.email, studentNumber: user.studentNumber,
        department: user.department, role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/admin-login  (sadece admin rolü)
// ──────────────────────────────────────────────
router.post('/admin-login', [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false, all_lowercase: true }),
  body('password').notEmpty().withMessage('Şifre zorunludur'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email veya şifre hatalı' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Bu hesap admin yetkisine sahip değil' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id, name: user.name, surname: user.surname,
        email: user.email, role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/forgot-password
// ──────────────────────────────────────────────
const crypto = require('crypto');
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false, all_lowercase: true })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });

    // Rastgele token oluştur
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 dk

    await user.save();

    // Frontend URL'sini dinamik oluştur, yoksa Firebase production URL'sine git
    const clientUrl = req.headers.origin || process.env.CLIENT_URL || 'https://eru-snowriders.web.app';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
    
    // Şifre sıfırlama maili gönder
    console.log(`\n==============================\n📧 RESET TOKEN: ${resetToken}\n==============================\n`);
    
    const emailSent = await emailUtils.sendPasswordResetEmail(user.email, resetUrl);
    if (!emailSent) {
      return res.status(500).json({ success: false, message: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.' });
    }

    res.json({ success: true, message: 'Şifre sıfırlama bağlantısı emailinize gönderildi.' });
  } catch (err) {
    console.error('Forgot password error details:', err.stack);
    res.status(500).json({ success: false, message: 'Sunucu hatası', error: err.message });
  }
});

// ──────────────────────────────────────────────
// POST /api/auth/reset-password/:token
// ──────────────────────────────────────────────
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Geçersiz veya süresi dolmuş kod' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Şifreniz başarıyla güncellendi' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

module.exports = router;
