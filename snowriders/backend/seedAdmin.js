require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = 'admin@snowriders.com';
const ADMIN_PASSWORD = 'admin123';

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı');

    // Model'i doğrudan tanımla (User modeline ait bağımlılıkları çekmemek için)
    const User = require('./src/models/User');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('⚠️  Admin zaten mevcut:', ADMIN_EMAIL);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Sistem',
      surname: 'Admin',
      studentNumber: 'ADMIN0001',
      department: 'Yönetim',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // pre-save hook ile hashlenecek
      role: 'admin',
      isVerified: true
    });

    console.log('✅ Admin kullanıcı oluşturuldu:');
    console.log('   Email   :', admin.email);
    console.log('   Password: admin123');
    console.log('   Role    :', admin.role);
    process.exit(0);
  } catch (err) {
    console.error('❌ Hata:', err.message);
    process.exit(1);
  }
}

seedAdmin();
