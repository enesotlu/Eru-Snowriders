import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { loginUser } = useAuth();
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const endpoint = activeTab === 'admin' ? '/auth/admin-login' : '/auth/login';
    
    try {
      const res = await api.post(endpoint, form);
      loginUser(res.data.user, res.data.token, rememberMe);
      
      if (res.data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || t('login.errors.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-slate-900 font-inter">
      {/* Background Image */}
      <img src="/erciyes-bg.png" className="fixed inset-0 w-full h-full object-cover z-0 opacity-90" alt="" />
      

      <div className="flex-grow w-full flex items-center justify-center relative z-10 py-12 px-4 overflow-y-auto">
        <div className="w-full max-w-[440px] my-auto">
          
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_40px_120px_rgba(0,0,0,0.4)] relative border border-white/20">
            {/* Language Selector In Card */}
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
            <div className="text-center mb-6">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl border-2 border-[#D4AF37]/20 flex items-center justify-center overflow-hidden">
                  <img src="/club-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
              <h1 className="text-[24px] font-black text-[#1e293b] tracking-tight uppercase mb-1">
                {t('login.title')}
              </h1>
              <p className="text-blue-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-1">
                {t('login.subtitle')}
              </p>
              <p className="text-slate-400 font-medium text-[11px] italic opacity-60">
                {t('login.hint') || 'Hesabınıza giriş yapın.'}
              </p>
            </div>

            {/* Tabs Section */}
            <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-100">
              <button
                onClick={() => setActiveTab('user')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'user' ? 'bg-[#212349] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t('login.userTab')}
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'admin' ? 'bg-[#212349] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t('login.adminTab')}
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl text-[10px] font-bold text-center uppercase tracking-widest animate-in fade-in zoom-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('login.email')}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder={t('login.emailPlaceholder')}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-blue-200 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('login.password')}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={t('login.passwordPlaceholder')}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-14 pr-12 py-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-blue-200 transition-all shadow-sm"
                  />
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
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-200 transition-all checked:bg-blue-500 checked:border-blue-500"
                    />
                    <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-widest">{t('login.remember')}</span>
                </label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                  {t('login.forgot')}
                </Link>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-5 bg-[#212349] text-white text-[17px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_40px_rgba(33,35,73,0.3)] hover:bg-[#2c2f61] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 group flex items-center justify-center gap-3"
              >
                {loading ? t('login.loading') : (
                  <>
                    {activeTab === 'admin' ? t('login.adminButton') : t('login.button')}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center pt-8 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                {t('login.noAccount')}
              </p>
              <Link to="/register" className="text-[14px] font-black text-orange-500 hover:text-orange-600 transition-all uppercase tracking-[0.2em]">
                {t('login.register')}
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
