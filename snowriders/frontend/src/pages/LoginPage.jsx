import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { loginUser, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [tab, setTab] = useState('user'); // 'user' | 'admin'
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleTabChange = (tValue) => {
    setTab(tValue);
    setError('');
    setSuccessMsg('');
    setForm({ email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = tab === 'admin' ? '/auth/admin-login' : '/auth/login';
      const { data } = await api.post(endpoint, form);
      loginUser(data.user, data.token, rememberMe);
      navigate(tab === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      if (err.response?.data?.needsVerification) {
        navigate('/verify', { state: { email: err.response.data.email || form.email, message: err.response.data.message } });
        return;
      }
      setError(err.response?.data?.message || t('login.errors.failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const tabBtn = (value, label) => (
    <button
      type="button"
      onClick={() => handleTabChange(value)}
      className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${
        tab === value
          ? 'bg-[#212349] text-white shadow-md'
          : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-slate-900 font-inter">
      {/* Background Image */}
      <img src="/erciyes-bg.png" className="fixed inset-0 w-full h-full object-cover z-0 opacity-90" alt="" />
      

      <div className="flex-grow w-full flex items-center justify-center relative z-10 py-12 px-4">
        <div className="w-full max-w-[440px]">
          
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_40px_120px_rgba(0,0,0,0.4)] relative border border-white/20">
            
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white rounded-2xl p-2.5 shadow-sm border border-slate-50 flex items-center justify-center">
                <img src="/golden_logo.jpg" alt="Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center mb-10">
              <h1 className="text-[25px] font-black text-[#1e293b] leading-tight mb-2 uppercase tracking-tight">
                {t('login.title')}
              </h1>
              <p className="text-[#38bdf8] font-black text-[12px] uppercase tracking-[0.15em] mb-1">
                {t('login.subtitle')}
              </p>
              <p className="text-slate-400 text-[13px] font-medium opacity-60 italic">
                {t('login.hint')}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 mb-8 border border-slate-100 shadow-inner">
              {tabBtn('user', t('login.userTab'))}
              {tabBtn('admin', t('login.adminTab'))}
            </div>

            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold text-center border border-emerald-100">{successMsg}</div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-xl text-[10px] font-bold text-center border border-red-100">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('login.email')}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder={t('login.emailPlaceholder')}
                    value={form.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-blue-200 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('login.password')}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder={t('login.passwordPlaceholder')}
                    value={form.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-blue-200 transition-all shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-slate-200 rounded-md bg-white peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all"></div>
                    <svg className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-700 transition-all">{t('login.remember')}</span>
                </label>
                <Link to="/forgot-password" title={t('login.forgot')} className="text-[11px] font-bold text-blue-500 hover:text-blue-600 transition-all">
                  {t('login.forgot')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#212349] text-white text-[15px] font-black uppercase tracking-[0.25em] rounded-xl shadow-[0_10px_30px_rgba(33,35,73,0.3)] hover:bg-[#2c2f61] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-6"
              >
                {loading ? t('login.loading') : t('login.button')}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-slate-100 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                {t('login.noAccount')}
              </p>
              <Link to="/register" className="text-[13px] font-black text-orange-500 hover:text-orange-600 transition-all uppercase tracking-widest">
                {t('login.register')}
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Social & Lang Corner */}
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 shadow-2xl gap-3">
        <div className="flex items-center gap-2 px-2">
          <button 
            onClick={() => i18n.changeLanguage('tr')}
            className={`text-[10px] font-black tracking-widest ${i18n.language.startsWith('tr') ? 'text-white' : 'text-white/40'}`}
          >TR</button>
          <span className="text-white/20 font-light">|</span>
          <button 
             onClick={() => i18n.changeLanguage('en')}
             className={`text-[10px] font-black tracking-widest ${!i18n.language.startsWith('tr') ? 'text-white' : 'text-white/40'}`}
          >GB</button>
        </div>
        <div className="w-px h-4 bg-white/10"></div>
        <a href="https://www.instagram.com/erusnowriders/" target="_blank" rel="noopener noreferrer" className="p-1 text-white/60 hover:text-white transition-all">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054 1.17.249 1.805.412 2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.358 1.078 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384s1.078-1.358 1.384-2.126c.296-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.306-.789-.718-1.459-1.384-2.126s-1.358-1.078-2.126-1.384c-.765-.296-1.636-.499-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16.4a4.4 4.4 0 110-8.8 4.4 4.4 0 010 8.8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
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
