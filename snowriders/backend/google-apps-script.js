/**
 * -------------------------------------------------------------
 * ERÜ SNOWRIDERS - GOOGLE APPS SCRIPT (GAS) WEBHOOK
 * -------------------------------------------------------------
 * Bu script, Render.com'un ücretsiz paketlerdeki SMTP engelini (Port 587/465) 
 * aşmak için oluşturulmuştur. Node.js backend'imiz SMTP ile uğraşmak yerine 
 * HTTPS (POST) isteği ile bu adresi tetikler, bu adres de Google'ın kendi 
 * sunucularından sizin Gmail'iniz ile e-postayı yollar.
 * 
 * KURULUM ADIMLARI:
 * 1. script.google.com adresine Gmail'iniz (erusnowriders@gmail.com) ile giriş yapın.
 * 2. "Yeni Proje" (New Project) oluşturun.
 * 3. İçindeki tüm var olan kodları silip bu sayfadaki kodları yapıştırın.
 * 4. Sağ üstteki "Dağıt" (Deploy) > "Yeni Dağıtım" (New Deployment) seçeneğine tıklayın.
 * 5. Çıkan ekranda "Tür seçin" kısmından çark ikonuna tıklayıp "Web Uygulaması" (Web App) seçin.
 * 6. "Açıklama" kısmına "Eru-Snowriders-Mail-API" yazın.
 * 7. "Erişim kimin" (Who has access) kısmını KESİNLİKLE "Herkes" (Anyone) yapın!
 * 8. "Dağıt" butonuna basın, Google sizden Yetkilendirme (Authorize) isteyecek, onay verin.
 * 9. Karşınıza çıkan "Web uygulaması URL'si"ni (https://script.google.com/macros/s/...) KOPYALAYIN.
 * 10. Projenizdeki backend/.env dosyanıza şu şelilde ekleyin:
 *     GOOGLE_SCRIPT_URL=kopyaladıgınız_link
 */

function doPost(e) {
  try {
    // Gelen POST isteğini parse et
    var payload = JSON.parse(e.postData.contents);
    
    var recipient = payload.recipient;
    var subject = payload.subject;
    var body = payload.body;

    if (!recipient || !subject || !body) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "Eksik parametreler" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Google altyapısı üzerinden e-postayı gönder
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: body,
      name: "ERÜ Snowriders"
    });

    // Node.js backend'ine başarılı yanıtı dön
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "E-mail basariyla gonderildi." 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
