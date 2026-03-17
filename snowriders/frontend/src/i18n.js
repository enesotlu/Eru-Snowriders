import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  tr: {
    translation: {
      "nav": {
        "home": "Genel Bakış",
        "events": "Etkinlik Takvimi",
        "admin": "Yönetim Paneli",
        "profile": "Profil Ayarları",
        "logout": "Güvenli Çıkış",
        "navigation": "Navigasyon",
        "management": "Yönetim"
      },
      "login": {
        "userTab": "Üye Girişi",
        "adminTab": "Yönetici Girişi",
        "email": "E-posta Adresi",
        "password": "Şifre",
        "emailPlaceholder": "E-posta adresinizi girin",
        "passwordPlaceholder": "Şifrenizi girin",
        "remember": "Beni hatırla",
        "forgot": "Şifremi unuttum",
        "button": "Giriş Yap",
        "adminButton": "Yönetici Girişi",
        "loading": "İşleniyor...",
        "noAccount": "Henüz üye değil misiniz?",
        "register": "Kayıt Olun",
        "title": "ERU KAYAK & SNOWBOARD KULÜBÜ",
        "subtitle": "ÜYELİK SİSTEMİ",
        "hint": "Hesabınıza giriş yapın.",
        "footer": "This platform is made by",
        "entry": "Giriş",
        "errors": {
          "failed": "Hatalı giriş. Lütfen bilgilerinizi kontrol edin.",
          "required": "Bu alan zorunludur."
        }
      },
      "register": {
        "title": "Aramıza Katılın",
        "subtitle": "Kulüp üyeliği için formu doldurun",
        "name": "İsim",
        "surname": "Soyisim",
        "studentNumber": "Öğrenci No",
        "department": "Bölüm / Fakülte",
        "deptSelect": "Bölümünüzü girin",
        "phone": "Telefon",
        "phonePlaceholder": "05XX XXX XXXX",
        "email": "Kurumsal veya Şahsi E-posta",
        "emailPlaceholder": "örnek@adres.com",
        "password": "Şifre",
        "passwordPlaceholder": "••••••••",
        "button": "Kayıt İşlemini Tamamla",
        "loading": "Kaydediliyor...",
        "hasAccount": "Zaten üye misiniz?",
        "login": "Giriş Yap",
        "entry": "Giriş",
        "errors": {
          "name": "İsim gereklidir",
          "surname": "Soyisim gereklidir",
          "studentNumber": "Öğrenci numarası gereklidir",
          "department": "Lütfen bölüm seçin",
          "phone": "Telefon numarası gereklidir",
          "emailInvalid": "Geçerli bir e-posta girin",
          "emailDomain": "Lütfen kurumsal veya yaygın bir e-posta (Gmail, Outlook vb.) kullanın.",
          "passwordLength": "Şifre en az 6 karakter olmalıdır",
          "passwordMatch": "Şifreler uyuşmuyor",
          "failed": "Kayıt sırasında bir hata oluştu"
        }
      },
      "dashboard": {
        "loading": "Veriler yükleniyor...",
        "welcome": "Merhaba, {{name}}",
        "subtitle": "Etkinlikleri takip et ve kulüp aktivitelerine katıl.",
        "tabs": {
          "all": "Tümü",
          "upcoming": "Yaklaşan",
          "registered": "Kayıtlı",
          "past": "Geçmiş"
        },
        "empty": {
          "upcoming": "Bu hafta için planlanan etkinlik bulunmuyor.",
          "registered": "Henüz bir etkinliğe kayıt yaptırmadınız.",
          "registeredLink": "Etkinlikleri inceleyin",
          "available": "Şu an aktif bir kayıt bulunmuyor."
        },
        "explore": "Etkinlik Keşfet",
        "upcomingTitle": "Yaklaşan Etkinlikler",
        "registeredTitle": "Katıldığım Etkinlikler",
        "viewAll": "Tümünü Gör",
        "all": "Tüm Etkinlikleri Gör",
        "stats": {
          "upcoming": "Yaklaşan Etkinlik",
          "upcomingHint": "Önümüzdeki 5 gün içinde",
          "registered": "Katıldığım",
          "registeredHint": "Kayıtlı olduğunuz etkinlikler",
          "total": "Toplam Etkinlik",
          "totalHint": "Toplam aktif etkinlik",
          "deadline": "Son Başvuru"
        },
        "registered": {
          "viewAll": "Hepsini Gör →"
        },
        "available": {
          "viewAll": "Tüm ({{count}}) Etkinlik"
        },
        "status": {
          "ended": "Tamamlandı",
          "full": "Kontenjan Dolu",
          "registered": "Kayıtlı",
          "open": "Kayıt Açık"
        }
      },
      "profile": {
        "title": "Profil Bilgileri",
        "personalInfo": "Kişisel Bilgiler",
        "updateTitle": "Profil Bilgilerini Güncelle",
        "editButton": "Profili Düzenle",
        "saveButton": "Değişiklikleri Kaydet",
        "cancelButton": "Vazgeç",
        "updating": "Güncelleniyor...",
        "membershipInfo": "Üyelik Bilgileri",
        "joinDate": "Kayıt Tarihi",
        "membershipType": "Üyelik Türü",
        "activeMember": "Aktif Üye",
        "email": "E-posta Adresi",
        "phone": "Telefon Numarası",
        "notSet": "Girilmedi",
        "errors": {
          "empty": "İsim ve soyisim boş bırakılamaz",
          "failed": "Güncelleme başarısız"
        },
        "success": "Profil başarıyla güncellendi!"
      },
      "recovery": {
        "forgotTitle": "Şifremi Unuttum",
        "forgotSubtitle": "Şifre sıfırlama bağlantısı için e-posta adresinizi girin.",
        "emailLabel": "E-posta Adresi",
        "emailPlaceholder": "e-posta@adresiniz.com",
        "sendButton": "Sıfırlama Bağlantısı Gönder",
        "checkEmail": "E-posta adresinizi kontrol edin. Sıfırlama bağlantısı gönderildi.",
        "loading": "İşleniyor...",
        "back": "Girişe Dön",
        "error": "İşlem sırasında bir hata oluştu.",
        "resetTitle": "Şifre Güncelleme",
        "resetSubtitle": "Lütfen yeni şifrenizi belirleyin.",
        "resetSuccess": "Şifreniz başarıyla güncellendi.",
        "loginRedirect": "Yeni şifrenizle giriş yapabilirsiniz.",
        "newPasswordLabel": "Yeni Şifre",
        "confirmPasswordLabel": "Yeni Şifre (Tekrar)",
        "passwordMismatch": "Şifreler uyuşmuyor"
      },
      "verify": {
        "title": "Hesap Doğrulama",
        "sentTo": "Gönderilen Adres:",
        "awaiting": "Doğrulama kodu bekleniyor",
        "noEmail": "E-posta bilgisi eksik.",
        "invalidCode": "Kod 6 haneli olmalıdır",
        "success": "Hesabınız başarıyla doğrulandı!",
        "error": "Hatalı veya süresi geçmiş kod",
        "resend": "Yeniden Gönder",
        "resendSuccess": "Yeni kod e-postanıza gönderildi.",
        "resendError": "Kod gönderilemedi",
        "loading": "Kontrol ediliyor...",
        "button": "Doğrula",
        "back": "Girişe Dön",
        "noCode": "Kod ulaşmadı mı?",
        "loginRedirect": "Hesabınız aktifleşti. Giriş yapabilirsiniz."
      },
      "admin": {
        "title": "Yönetim Paneli",
        "subtitle": "Etkinlikleri yönetin, katılımcı listelerini inceleyin ve üye verilerini kontrol edin.",
        "tabs": {
          "events": "Etkinlik Yönetimi",
          "members": "Üye Listesi"
        },
        "form": {
          "create": "Yeni Etkinlik Oluştur",
          "update": "Etkinliği Güncelle",
          "title": "Etkinlik Başlığı",
          "location": "Konum",
          "description": "Etkinlik Açıklaması",
          "date": "Tarih",
          "deadline": "Son Kayıt Tarihi",
          "start": "Başlangıç Saati",
          "end": "Bitiş Saati",
          "capacity": "Kontenjan",
          "submitCreate": "Etkinliği Yayınla",
          "submitUpdate": "Değişiklikleri Onayla",
          "cancel": "İptal",
          "processing": "İşleniyor...",
          "placeholders": {
            "title": "Örn: Erciyes Hafta Sonu Turu",
            "location": "Örn: Erciyes Dağı, Kayseri",
            "desc": "Etkinlik hakkında detaylı bilgi verin..."
          }
        },
        "list": {
          "active": "Yayındaki Etkinlikler",
          "loading": "Etkinlikler yükleniyor...",
          "empty": "Kayıtlı etkinlik bulunamadı.",
          "participants": "KATILIMCI LİSTESİ",
          "csv": "CSV İNDİR",
          "edit": "DÜZENLE",
          "delete": "SİL",
          "confirm": "EMİN MİSİN?",
          "yes": "EVET",
          "no": "HAYIR"
        },
        "participants": {
          "title": "KATILIMCI LİSTESİ",
          "close": "KAPAT",
          "loading": "Veriler çekiliyor...",
          "empty": "Henüz katılım yok.",
          "table": {
             "name": "AD SOYAD",
             "id": "ÖĞRENCİ NO",
             "phone": "TELEFON",
             "dept": "BÖLÜM"
          }
        },
        "members": {
          "title": "Üye Arşivi",
          "refresh": "VERİLERİ YENİLE",
          "loading": "Üyeler yükleniyor...",
          "empty": "Sistemde üye kaydı bulunamadı.",
          "table": {
            "name": "Ad Soyad",
            "id": "Öğrenci No",
            "email": "E-posta",
            "dept": "Bölüm",
            "phone": "Telefon No",
            "date": "Kayıt Tarihi"
          }
        }
      },
      "event_detail": {
        "location": "Konum",
        "capacity": "Kontenjan",
        "deadline": "Son Kayıt",
        "open_map": "Haritayı Aç",
        "participants": "Katılımcı",
        "back": "Listeye Dön",
        "description": "ETKİNLİK AÇIKLAMASI",
        "last_chance": "Kayıt İçin Son Fırsat",
        "cancel_confirm": "Kayıt iptal edilsin mi?",
        "cancel_yes": "Evet, İptal Et",
        "cancel_no": "Vazgeç",
        "cancel_action": "Etkinlikten Kaydımı Sil",
        "register_now": "Hemen Kayıt Ol",
        "registration_closed": "Kayıt Dönemi Kapandı",
        "full": "Kontenjan Dolu",
        "processing": "İşleniyor...",
        "success_registered": "Etkinliğe başarıyla kayıt oldunuz! 🎉",
        "success_cancelled": "Etkinlik kaydınız iptal edildi.",
        "not_specified": "Belirtilmedi",
        "errors": {
          "failed_register": "Kayıt işlemi başarısız oldu.",
          "failed_cancel": "İptal işlemi başarısız oldu."
        }
      },
      "events": {
        "title": "Mevcut Etkinlikler",
        "search": "Etkinlik ara...",
        "all": "Tümü",
        "not_found": "Etkinlik Bulunamadı",
        "full": "Dolu",
        "completed": "Tamamlandı"
      }
    }
  },
  en: {
    translation: {
      "nav": {
        "home": "Overview",
        "events": "Event Calendar",
        "admin": "Management",
        "profile": "Settings",
        "logout": "Sign Out",
        "navigation": "Navigation",
        "management": "Management"
      },
      "login": {
        "userTab": "Member Login",
        "adminTab": "Admin Access",
        "email": "Email Address",
        "password": "Password",
        "emailPlaceholder": "Enter your email",
        "passwordPlaceholder": "Enter your password",
        "remember": "Remember me",
        "forgot": "Forgot password",
        "button": "Sign In",
        "adminButton": "Admin Dashboard",
        "loading": "Processing...",
        "noAccount": "Not a member yet?",
        "register": "Join now",
        "title": "ERU SKI & SNOWBOARD CLUB",
        "subtitle": "MEMBERSHIP SYSTEM",
        "hint": "Log in to your account.",
        "footer": "This platform is made by",
        "entry": "Enter",
        "errors": {
          "failed": "Invalid credentials. Please try again.",
          "required": "This field is required."
        }
      },
      "register": {
        "title": "Create Account",
        "subtitle": "Join the ERU Ski & Snowboard community",
        "name": "First Name",
        "surname": "Last Name",
        "studentNumber": "Student ID",
        "department": "Faculty / Department",
        "deptSelect": "Enter your department",
        "phone": "Phone",
        "phonePlaceholder": "05XX XXX XXXX",
        "email": "Email Address",
        "password": "Password",
        "passwordPlaceholder": "••••••••",
        "button": "Complete Registration",
        "loading": "Saving...",
        "hasAccount": "Already a member?",
        "login": "Sign In",
        "entry": "Enter",
        "errors": {
          "name": "First name is required",
          "surname": "Last name is required",
          "studentNumber": "Student ID is required",
          "department": "Please select a department",
          "phone": "Phone number is required",
          "emailInvalid": "Enter a valid email",
          "emailDomain": "Please use a valid institution or personal email.",
          "passwordLength": "Minimum 6 characters required",
          "passwordMatch": "Passwords do not match",
          "failed": "Registration failed"
        }
      },
      "dashboard": {
        "loading": "Updating dashboard...",
        "welcome": "Welcome back, {{name}}",
        "subtitle": "Track upcoming events and manage your activities.",
        "tabs": {
          "all": "All",
          "upcoming": "Upcoming",
          "registered": "Registered",
          "past": "Past"
        },
        "empty": {
          "upcoming": "No events scheduled for the current period.",
          "registered": "You haven't registered for any events yet.",
          "registeredLink": "Explore schedule",
          "available": "No active events found."
        },
        "explore": "Explore Events",
        "upcomingTitle": "Upcoming Events",
        "registeredTitle": "My Participations",
        "viewAll": "View All",
        "all": "View All Events",
        "stats": {
          "upcoming": "Upcoming Event",
          "upcomingHint": "Within next 5 days",
          "registered": "My Events",
          "registeredHint": "Events you are joined",
          "total": "Total Schedule",
          "totalHint": "Total active events",
          "deadline": "Registration Deadline"
        },
        "registered": {
          "viewAll": "View All →"
        },
        "available": {
          "viewAll": "All ({{count}}) Events"
        },
        "status": {
          "ended": "Completed",
          "full": "No Space Available",
          "registered": "Member Joined",
          "open": "Registration Open"
        }
      },
      "profile": {
        "title": "Profile Details",
        "personalInfo": "Personal Information",
        "updateTitle": "Update Profile Details",
        "editButton": "Edit Profile",
        "saveButton": "Save Changes",
        "cancelButton": "Cancel",
        "updating": "Updating...",
        "membershipInfo": "Membership Details",
        "joinDate": "Join Date",
        "membershipType": "Member Type",
        "activeMember": "Active Member",
        "email": "Email Address",
        "phone": "Phone Number",
        "notSet": "Not provided",
        "errors": {
          "empty": "Name and surname cannot be empty",
          "failed": "Update failed"
        },
        "success": "Profile updated successfully!"
      },
      "recovery": {
        "forgotTitle": "Forgot Password?",
        "forgotSubtitle": "Enter your email address to receive a secure password reset link.",
        "emailLabel": "Email Address",
        "emailPlaceholder": "name@example.com",
        "sendButton": "Send Reset Link",
        "checkEmail": "Check your email. We've sent a password reset link.",
        "loading": "Processing...",
        "back": "Return to Sign In",
        "error": "An error occurred. Please try again later.",
        "resetTitle": "Reset Your Password",
        "resetSubtitle": "Please enter your new password below.",
        "resetSuccess": "Password updated successfully.",
        "loginRedirect": "You can now sign in with your new password.",
        "newPasswordLabel": "New Password",
        "confirmPasswordLabel": "Confirm New Password",
        "passwordMismatch": "Passwords do not match"
      },
      "verify": {
        "title": "Verify Account",
        "sentTo": "Sent to:",
        "awaiting": "Verification pending",
        "noEmail": "Email metadata missing.",
        "invalidCode": "Code must be 6 digits",
        "success": "Email verified successfully!",
        "error": "Invalid or expired code",
        "resend": "Resend Code",
        "resendSuccess": "New code dispatched.",
        "resendError": "Transmission failed",
        "loading": "Checking...",
        "button": "Verify",
        "back": "Back to Login",
        "noCode": "No code received?",
        "loginRedirect": "Account verified. You may sign in."
      },
      "admin": {
        "title": "Admin Dashboard",
        "subtitle": "Manage events, review participant lists, and control member data.",
        "tabs": {
          "events": "Event Management",
          "members": "Member List"
        },
        "form": {
          "create": "Create New Event",
          "update": "Update Event",
          "title": "Event Title",
          "location": "Location",
          "description": "Event Description",
          "date": "Date",
          "deadline": "Registration Deadline",
          "start": "Start Time",
          "end": "End Time",
          "capacity": "Capacity",
          "submitCreate": "Publish Event",
          "submitUpdate": "Confirm Changes",
          "cancel": "Cancel",
          "processing": "Processing...",
          "placeholders": {
            "title": "Ex: Erciyes Weekend Trip",
            "location": "Ex: Erciyes Mountain, Kayseri",
            "desc": "Provide detailed info about the event..."
          }
        },
        "list": {
          "active": "Active Events",
          "loading": "Loading events...",
          "empty": "No events found.",
          "participants": "PARTICIPANTS",
          "csv": "DOWNLOAD CSV",
          "edit": "EDIT",
          "delete": "DELETE",
          "confirm": "ARE YOU SURE?",
          "yes": "YES",
          "no": "NO"
        },
        "participants": {
          "title": "PARTICIPANT LIST",
          "close": "CLOSE",
          "loading": "Fetching data...",
          "empty": "No participants yet.",
          "table": {
             "name": "FULL NAME",
             "id": "STUDENT ID",
             "phone": "PHONE",
             "dept": "DEPARTMENT"
          }
        },
        "members": {
          "title": "Member Archive",
          "refresh": "REFRESH DATA",
          "loading": "Loading members...",
          "empty": "No members found in the system.",
          "table": {
            "name": "Full Name",
            "id": "Student ID",
            "email": "Email",
            "dept": "Department",
            "phone": "Phone No",
            "date": "Join Date"
          }
        }
      },
      "event_detail": {
        "location": "Location",
        "capacity": "Capacity",
        "deadline": "Deadline",
        "open_map": "Open Map",
        "participants": "Participant",
        "back": "Back to List",
        "description": "EVENT DESCRIPTION",
        "last_chance": "Last Chance to Register",
        "cancel_confirm": "Cancel registration?",
        "cancel_yes": "Yes, Cancel",
        "cancel_no": "Nevermind",
        "cancel_action": "Cancel My Registration",
        "register_now": "Register Now",
        "registration_closed": "Registration Closed",
        "full": "Capacity Full",
        "processing": "Processing...",
        "success_registered": "Successfully registered for the event! 🎉",
        "success_cancelled": "Event registration cancelled.",
        "not_specified": "Not specified",
        "errors": {
          "failed_register": "Registration failed.",
          "failed_cancel": "Cancellation failed."
        }
      },
      "events": {
        "title": "Available Events",
        "search": "Search events...",
        "all": "All",
        "not_found": "No Events Found",
        "full": "Full",
        "completed": "Completed"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
