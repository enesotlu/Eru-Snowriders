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


export default function RegisterPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: '', surname: '', studentNumber: '', department: '', phone: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t('register.errors.name');
    if (!form.surname.trim()) e.surname = t('register.errors.surname');
    if (!form.studentNumber.trim()) e.studentNumber = t('register.errors.studentNumber');
    if (!form.department) e.department = t('register.errors.department');
    if (!form.phone.trim()) e.phone = t('register.errors.phone');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = t('register.errors.emailInvalid');
    } else if (!isEmailDomainValid(form.email)) {
      e.email = t('register.errors.emailDomain');
    }
    if (form.password.length < 6) e.password = t('register.errors.passwordLength');
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { 
      setErrors(errs); 
      return; 
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      navigate('/verify', { state: { email: res.data.email || form.email } });
    } catch (err) {
      if (err.response?.data?.errors?.length > 0) {
        setServerError(err.response.data.errors[0].msg);
      } else {
        setServerError(err.response?.data?.message || t('register.errors.failed'));
      }
    } finally { setLoading(false); }
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => { 
      setForm({ ...form, [field]: e.target.value }); 
    }
  });

  const inputClass = (field) =>
    `w-full px-5 py-4 rounded-xl bg-slate-50 border ${errors[field] ? 'border-red-200 bg-red-50/30' : 'border-slate-100'} text-slate-800 placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-blue-200 transition-all shadow-sm`;

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-slate-900 font-inter">
      {/* Background Image */}
      <img src="/erciyes-bg.png" className="fixed inset-0 w-full h-full object-cover z-0 opacity-90" alt="" />
      

      <div className="flex-grow w-full flex items-center justify-center relative z-10 py-24 px-4 overflow-y-auto">
        <div className="w-full max-w-2xl my-auto">
          
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_40px_120px_rgba(0,0,0,0.4)] relative border border-white/20">
            {/* Logo Section */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl p-2.5 shadow-sm border border-slate-50 flex items-center justify-center">
                  <img src="/golden_logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase mb-2">
                {t('register.title')}
              </h1>
              <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em]">
                {t('register.subtitle')}
              </p>
            </div>

            {serverError && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl text-[10px] font-bold text-center uppercase tracking-widest animate-in fade-in zoom-in">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('register.name')}</label>
                  <input type="text" placeholder={t('register.entry')} className={inputClass('name')} {...f('name')} />
                  {errors.name && <p className="text-red-500 text-[9px] font-bold italic mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('register.surname')}</label>
                  <input type="text" placeholder={t('register.entry')} className={inputClass('surname')} {...f('surname')} />
                  {errors.surname && <p className="text-red-500 text-[9px] font-bold italic mt-1">{errors.surname}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('register.studentNumber')}</label>
                  <input type="text" placeholder={t('register.studentNumber')} className={inputClass('studentNumber')} {...f('studentNumber')} />
                  {errors.studentNumber && <p className="text-red-500 text-[9px] font-bold italic mt-1">{errors.studentNumber}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('register.department')}</label>
                  <input type="text" placeholder={t('register.deptSelect')} className={inputClass('department')} {...f('department')} />
                  {errors.department && <p className="text-red-500 text-[9px] font-bold italic mt-1">{errors.department}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('register.phone')}</label>
                   <input type="tel" maxLength={11} placeholder={t('register.phonePlaceholder')} className={inputClass('phone')} {...f('phone')} />
                   {errors.phone && <p className="text-red-500 text-[9px] font-bold italic mt-1">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('register.email')}</label>
                   <input type="email" placeholder={t('register.emailPlaceholder')} className={inputClass('email')} {...f('email')} />
                   {errors.email && <p className="text-red-500 text-[9px] font-bold italic mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('register.password')}</label>
                 <input type="password" placeholder={t('register.passwordPlaceholder')} className={inputClass('password')} {...f('password')} />
                 {errors.password && <p className="text-red-500 text-[9px] font-bold italic mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-5 bg-[#212349] text-white text-[15px] font-black uppercase tracking-[0.25em] rounded-xl shadow-[0_10px_30px_rgba(33,35,73,0.3)] hover:bg-[#2c2f61] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-6 group flex items-center justify-center gap-3"
              >
                {loading ? t('register.loading') : (
                  <>
                    {t('register.button')}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center text-[10px] font-black uppercase tracking-widest">
               <span className="text-slate-400 uppercase">{t('register.hasAccount')}</span>{' '}
               <Link to="/login" className="text-blue-500 hover:text-blue-600 transition-all font-black ml-1">
                 {t('register.login')}
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements (Language Corner) */}
      <div className="fixed bottom-6 right-6 z-20 flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 shadow-2xl gap-3">
        <div className="flex items-center gap-2 px-2 text-white/40 text-[10px] font-black">
          <button onClick={() => i18n.changeLanguage('tr')} className={i18n.language.startsWith('tr') ? 'text-white' : ''}>TR</button>
          <span>|</span>
          <button onClick={() => i18n.changeLanguage('en')} className={!i18n.language.startsWith('tr') ? 'text-white' : ''}>GB</button>
        </div>
        <div className="w-px h-4 bg-white/10"></div>
        <a href="https://www.instagram.com/erusnowriders/" target="_blank" rel="noopener noreferrer" className="p-1 text-white/60 hover:text-white transition-all">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.358 1.078 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384s1.078-1.358 1.384-2.126c.296-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.306-.789-.718-1.459-1.384-2.126s-1.358-1.078-2.126-1.384c-.765-.296-1.636-.499-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16.4a4.4 4.4 0 110-8.8 4.4 4.4 0 010 8.8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
        </a>
      </div>

      {/* Footer Design Credits */}
      <footer className="fixed bottom-6 left-6 z-20 pointer-events-auto">
         <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] drop-shadow-sm">
           {t('login.footer')} <span className="text-white font-black">ABDULLAH ENES OTLU</span>
         </span>
      </footer>
    </div>
  );
}
