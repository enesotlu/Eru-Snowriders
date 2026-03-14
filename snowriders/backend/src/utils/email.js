const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Use Gmail or any standard SMTP service for production
  // For development you can use your own Gmail with App Passwords
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Render'ın 587 bariyerini geçmek için direkt SSL
    requireTLS: true,
    family: 4, 
    auth: {
      user: process.env.EMAIL_USER?.trim(),
      pass: process.env.EMAIL_PASS?.replace(/\s+/g, '') // Google App Password boşluklarını temizler
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 15000, // 15 seconds
    greetingTimeout: 15000,
    socketTimeout: 15000
  });
};

const sendVerificationEmail = async (to, code) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('----------------------------------------------------');
      console.log(`[DEV MODE] Email send skipped (credentials missing)`);
      console.log(`To: ${to}`);
      console.log(`Verification Code: ${code}`);
      console.log('----------------------------------------------------');
      return true;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"ERÜ Snowriders" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Erü Snowriders - Email Doğrulama Kodunuz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #1e293b; text-align: center;">Hoş Geldiniz! ❄️</h2>
          <p style="color: #475569; font-size: 16px;">ERÜ Snowriders platformuna kayıt olduğunuz için teşekkürler. Hesabınızı aktifleştirmek için aşağıdaki doğrulama kodunu kullanın:</p>
          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          </div>
          <p style="color: #64748b; font-size: 14px; text-align: center;">Bu kod 10 dakika boyunca geçerlidir.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error (Verification):', error.message);
    console.error('SMTP Config Used:', {
      host: 'smtp.gmail.com',
      port: 465,
      secure: false,
      tls: { rejectUnauthorized: false },
      userProvided: !!process.env.EMAIL_USER?.trim(),
      passProvided: !!process.env.EMAIL_PASS?.trim()
    });
    return false;
  }
};

const sendPasswordResetEmail = async (to, resetUrl) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('----------------------------------------------------');
      console.log(`[DEV MODE] Password reset email skipped`);
      console.log(`To: ${to}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('----------------------------------------------------');
      return true;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"ERÜ Snowriders" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Erü Snowriders - Şifre Sıfırlama İstemi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #1e293b; text-align: center;">Şifre Sıfırlama 🔐</h2>
          <p style="color: #475569; font-size: 16px;">Şifrenizi sıfırlamak için bir talepte bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Şifremi Sıfırla</a>
          </div>
          <p style="color: #64748b; font-size: 14px; text-align: center;">Bu bağlantı 15 dakika süresince geçerlidir. Eğer bu talebi siz yapmadıysanız lütfen bu e-postayı dikkate almayın.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error (Password Reset):', error.message);
    console.error('SMTP Config Used:', {
      host: 'smtp.gmail.com',
      port: 465,
      secure: false,
      tls: { rejectUnauthorized: false },
      userProvided: !!process.env.EMAIL_USER?.trim(),
      passProvided: !!process.env.EMAIL_PASS?.trim()
    });
    return false;
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
