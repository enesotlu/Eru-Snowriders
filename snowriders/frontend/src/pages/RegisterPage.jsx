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
  const [showPassword, setShowPassword] = useState(false);
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
            {/* Language Selector in Card */}
            <div className="absolute top-6 right-6 z-20 flex items-center bg-slate-50 rounded-xl p-1.5 border border-slate-100 shadow-sm">
              <button 
                onClick={() => i18n.changeLanguage('tr')}
                className={`px-2 py-1 text-[9px] font-black transition-all rounded-lg ${i18n.language.startsWith('tr') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >TR</button>
              <button 
                onClick={() => i18n.changeLanguage('en')}
                className={`px-2 py-1 text-[9px] font-black transition-all rounded-lg ${!i18n.language.startsWith('tr') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >EN</button>
            </div>

            {/* Logo Section */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg border-2 border-[#D4AF37]/20 flex items-center justify-center overflow-hidden">
                <img src="/club-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
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
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder={t('register.passwordPlaceholder')} className={inputClass('password') + " pr-12"} {...f('password')} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
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

      {/* Footer Branding & Contact (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-20 flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 text-white drop-shadow-md">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">THIS PLATFORM IS MADE BY</span>
          <span className="text-[11px] font-black uppercase tracking-widest">ABDULLAH ENES OTLU</span>
        </div>
        <div className="w-[1px] h-4 bg-white/20"></div>
        <a href="https://www.linkedin.com/in/abdullah-enes-otlu-075305299" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 hover:scale-110 transition-all transition-transform">
          <svg className="w-5 h-5 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </a>
      </div>

      {/* Follow Us Section (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-20 flex flex-col items-end pointer-events-auto">
        <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-2 drop-shadow-md">FOLLOW US</p>
        <a href="https://www.instagram.com/erusnowriders/" target="_blank" rel="noopener noreferrer" className="inline-flex p-3 bg-gradient-to-tr from-orange-500 to-pink-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.358 1.078 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384s1.078-1.358 1.384-2.126c.296-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.306-.789-.718-1.459-1.384-2.126s-1.358-1.078-2.126-1.384c-.765-.296-1.636-.499-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16.4a4.4 4.4 0 110-8.8 4.4 4.4 0 010 8.8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
        </a>
      </div>
    </div>
  );
}
