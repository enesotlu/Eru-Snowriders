require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('--- SMTP TEST BAŞLIYOR ---');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  
  // Şifrenin gizli halini loglayalım (sadece uzunluğunu ve boşluksuz mu diye)
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '');
  console.log('EMAIL_PASS (Length):', pass ? pass.length : 'MISSING');
  console.log('EMAIL_PASS (Format Test):', process.env.EMAIL_PASS === pass ? 'No spaces' : 'Has spaces');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    requireTLS: true,
    family: 4, 
    auth: {
      user: process.env.EMAIL_USER?.trim(),
      pass: pass
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 15000, 
    greetingTimeout: 15000,
    socketTimeout: 15000
  });

  try {
    const info = await transporter.sendMail({
      from: `"Test Programı" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Kendine gönder
      subject: 'SMTP Bağlantı Testi',
      text: 'Eğer bu maili görüyorsan, SMTP ve App Password doğru çalışıyor demektir!'
    });
    console.log('✅ TEST BAŞARILI! Mail ID:', info.messageId);
  } catch (err) {
    console.error('❌ TEST BAŞARISIZ! Detaylı Hata:', err);
  }
}

testEmail();
