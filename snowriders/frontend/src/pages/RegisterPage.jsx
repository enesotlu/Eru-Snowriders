import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const ALLOWED_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];

const isEmailDomainValid = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return ALLOWED_DOMAINS.includes(domain) || domain.endsWith('.edu') || domain.endsWith('.edu.tr');
};

const DEPARTMENTS = [
  'Bilgisayar Mühendisliği', 'Makine Mühendisliği', 'Elektrik Elektronik Mühendisliği',
  'İnşaat Mühendisliği', 'Endüstri Mühendisliği', 'Kimya Mühendisliği',
  'Tıp', 'Diş Hekimliği', 'Eczacılık', 'İktisadi ve İdari Bilimler',
  'Eğitim', 'Fen Edebiyat', 'Güzel Sanatlar', 'Diğer'
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', surname: '', studentNumber: '', department: '', phone: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getEmailDomain = (email) => email.split('@')[1]?.toLowerCase();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'İsim zorunludur';
    if (!form.surname.trim()) e.surname = 'Soyisim zorunludur';
    if (!form.studentNumber.trim()) e.studentNumber = 'Öğrenci numarası zorunludur';
    if (!form.department) e.department = 'Bölüm seçin';
    if (!form.phone.trim()) e.phone = 'Telefon numarası zorunludur';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = 'Geçerli email girin';
    } else if (!isEmailDomainValid(form.email)) {
      e.email = 'Gmail, Hotmail, Outlook veya üniversite (.edu) email adresi kullanınız';
    }
    if (form.password.length < 6) e.password = 'Şifre en az 6 karakter olmalı';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true); setServerError(''); setSuccessMsg('');
    try {
      const res = await api.post('/auth/register', form);
      navigate('/verify', { state: { email: res.data.email || form.email } });
    } catch (err) {
      if (err.response?.data?.errors?.length > 0) {
        setServerError(err.response.data.errors[0].msg);
      } else {
        setServerError(err.response?.data?.message || 'Kayıt oluşturulamadı');
      }
    } finally { setLoading(false); }
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }); }
  });

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${errors[field] ? 'border-red-400' : 'border-slate-200'}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">❄️</div>
          <h1 className="text-2xl font-bold text-slate-800">{t('register.title')}</h1>
          <p className="text-slate-500 mt-1">{t('register.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-1">{t('register.title')}</h2>
          <p className="text-xs text-slate-400 mb-5">Gmail, Hotmail, Outlook, Yahoo, iCloud veya üniversite (.edu / .edu.tr) email kullanın</p>

          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{serverError}</div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm">{successMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('register.name')}</label>
                <input type="text" placeholder="Ahmet" className={inputClass('name')} {...f('name')} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('register.surname')}</label>
                <input type="text" placeholder="Yılmaz" className={inputClass('surname')} {...f('surname')} />
                {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('register.studentNumber')}</label>
              <input type="text" placeholder="1234567890" className={inputClass('studentNumber')} {...f('studentNumber')} />
              {errors.studentNumber && <p className="text-red-500 text-xs mt-1">{errors.studentNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('register.department')}</label>
              <select className={inputClass('department')} {...f('department')}>
                <option value="">{t('register.deptSelect')}</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('register.phone')}</label>
              <input type="tel" placeholder="0555 123 4567" className={inputClass('phone')} {...f('phone')} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('register.email')}</label>
              <input type="email" placeholder="ornek@gmail.com" className={inputClass('email')} {...f('email')} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('register.password')}</label>
              <input type="password" placeholder="••••••••" className={inputClass('password')} {...f('password')} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit" disabled={loading || !!successMsg}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-60 mt-2"
            >
              {loading ? t('register.loading') : t('register.button')}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">{t('register.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
