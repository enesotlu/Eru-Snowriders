import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Çeviri nesneleri (basit olması adına burada tanımlanmıştır, daha büyük projelerde locales/ klasörüne ayrılabilir)
const resources = {
  tr: {
    translation: {
      "nav": {
        "home": "Ana Sayfa",
        "events": "Etkinlikler",
        "admin": "Yönetim Paneli",
        "profile": "Profilim",
        "logout": "Çıkış Yap"
      },
      "login": {
        "userTab": "Kullanıcı Girişi",
        "adminTab": "Admin Girişi",
        "email": "Email",
        "password": "Şifre",
        "remember": "Beni Hatırla",
        "forgot": "Şifremi Unuttum",
        "button": "Giriş Yap",
        "adminButton": "⚙️ Admin Girişi Yap",
        "loading": "Giriş yapılıyor...",
        "noAccount": "Hesabın yok mu?",
        "register": "Üye Ol"
      },
      "register": {
        "title": "Üye Ol",
        "subtitle": "ERÜ Snowriders ailesine katılın",
        "name": "İsim",
        "surname": "Soyisim",
        "studentNumber": "Öğrenci Numarası",
        "department": "Bölüm",
        "deptSelect": "Bölüm Seçin",
        "phone": "Telefon",
        "email": "Email",
        "password": "Şifre",
        "button": "Üye Ol",
        "loading": "Kaydediliyor...",
        "hasAccount": "Zaten üye misin?",
        "login": "Giriş Yap"
      },
      "dashboard": {
        "welcome": "Hoş Geldin, %{name} ❄️",
        "subtitle": "Kar ve adrenalin dolu bir sezona hazır mısın?",
        "events": "Yaklaşan Etkinlikler",
        "all": "Tümünü Gör",
        "noEvent": "Henüz yaklaşan bir etkinlik bulunmuyor.",
        "join": "Kayıt Ol",
        "joined": "Kayıtlısın!"
      }
    }
  },
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "events": "Events",
        "admin": "Admin Panel",
        "profile": "My Profile",
        "logout": "Log Out"
      },
      "login": {
        "userTab": "User Login",
        "adminTab": "Admin Login",
        "email": "Email",
        "password": "Password",
        "remember": "Remember Me",
        "forgot": "Forgot Password",
        "button": "Log In",
        "adminButton": "⚙️ Admin Log In",
        "loading": "Logging in...",
        "noAccount": "Don't have an account?",
        "register": "Sign Up"
      },
      "register": {
        "title": "Sign Up",
        "subtitle": "Join the ERU Snowriders family",
        "name": "First Name",
        "surname": "Last Name",
        "studentNumber": "Student ID",
        "department": "Department",
        "deptSelect": "Select Department",
        "phone": "Phone",
        "email": "Email",
        "password": "Password",
        "button": "Sign Up",
        "loading": "Registering...",
        "hasAccount": "Already have an account?",
        "login": "Log In"
      },
      "dashboard": {
        "welcome": "Welcome, %{name} ❄️",
        "subtitle": "Ready for a season full of snow and adrenaline?",
        "events": "Upcoming Events",
        "all": "View All",
        "noEvent": "No upcoming events yet.",
        "join": "Join",
        "joined": "Joined!"
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
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
