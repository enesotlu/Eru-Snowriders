// SMTP portlarına Render gibi PaaS ortamlarında takılmamak için 
// Google Apps Script (Web App) HTTP Webhook'u ile mailler asenkron gönderilir.

const sendVerificationEmail = async (to, code) => {
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    
    if (!scriptUrl) {
       console.log('----------------------------------------------------');
       console.log(`[DEV MODE] GOOGLE_SCRIPT_URL eksik! E-posta konsola basıldı.`);
       console.log(`Kime: ${to}`);
       console.log(`Doğrulama Kodu: ${code}`);
       console.log('----------------------------------------------------');
       return true;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #1e293b; text-align: center;">Hoş Geldiniz! ❄️</h2>
        <p style="color: #475569; font-size: 16px;">ERÜ Snowriders platformuna kayıt olduğunuz için teşekkürler. Hesabınızı aktifleştirmek için aşağıdaki doğrulama kodunu kullanın:</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #2563eb; margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h1>
        </div>
        <p style="color: #64748b; font-size: 14px; text-align: center;">Bu kod 10 dakika boyunca geçerlidir.</p>
      </div>
    `;

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        recipient: to,
        subject: 'Erü Snowriders - Email Doğrulama Kodunuz',
        body: htmlContent
      })
    });

    // CORS ve Redirect durumunda Google her zaman bir HTML sayfası veya text döndürür
    const textResult = await response.text();
    
    if (response.ok || response.type === 'opaque') {
      return true;
    } else {
      console.error('GAS Webhook Hatası: İstek başarısız oldu (Status:', response.status, 'Body:', textResult.substring(0, 100), ')');
      return false;
    }
  } catch (error) {
    console.error('HTTPS Email (Verification) gönderme hatası:', error.message);
    return false;
  }
};

const sendPasswordResetEmail = async (to, resetUrl) => {
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    
    if (!scriptUrl) {
       console.log('----------------------------------------------------');
       console.log(`[DEV MODE] GOOGLE_SCRIPT_URL eksik! E-posta konsola basıldı.`);
       console.log(`Kime: ${to}`);
       console.log(`Şifre Sıfırlama Linki: ${resetUrl}`);
       console.log('----------------------------------------------------');
       return true;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #1e293b; text-align: center;">Şifre Sıfırlama 🔐</h2>
        <p style="color: #475569; font-size: 16px;">Şifrenizi sıfırlamak için bir talepte bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Şifremi Sıfırla</a>
        </div>
        <p style="color: #64748b; font-size: 14px; text-align: center;">Bu bağlantı 15 dakika süresince geçerlidir.</p>
      </div>
    `;

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        recipient: to,
        subject: 'Erü Snowriders - Şifre Sıfırlama İstemi',
        body: htmlContent
      })
    });

    const textResult = await response.text();

    if (response.ok || response.type === 'opaque') {
      return true;
    } else {
      console.error('GAS Webhook Hatası (Reset Password): İstek başarısız (Status:', response.status, 'Body:', textResult.substring(0, 100), ')');
      return false;
    }
  } catch (error) {
    console.error('HTTPS Email (Password Reset) gönderme hatası:', error.message);
    return false;
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
