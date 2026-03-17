import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage(t('recovery.checkEmail'));
    } catch (err) {
      setError(err.response?.data?.message || t('recovery.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-slate-900 font-inter">
      {/* Background Image */}
      <img src="/erciyes-bg.png" className="fixed inset-0 w-full h-full object-cover z-0 opacity-90" alt="" />
      
      <div className="flex-grow w-full flex items-center justify-center relative z-10 py-12 px-4">
        <div className="w-full max-w-[440px]">
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

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl border-2 border-[#D4AF37]/20 flex items-center justify-center overflow-hidden">
                <img src="/club-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-[25px] font-black text-[#1e293b] leading-tight mb-2 uppercase tracking-tight">
                {t('recovery.forgotTitle')}
              </h1>
              <p className="text-slate-400 text-[13px] font-medium opacity-60 italic">
                {t('recovery.forgotSubtitle')}
              </p>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold text-center border border-emerald-100">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-xl text-[10px] font-bold text-center border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('login.email')}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder={t('login.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-blue-200 transition-all shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#212349] text-white text-[15px] font-black uppercase tracking-[0.25em] rounded-xl shadow-[0_10px_30px_rgba(33,35,73,0.3)] hover:bg-[#2c2f61] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
              >
                {loading ? t('recovery.loading') : t('recovery.sendButton')}
              </button>
            </form>

            <div className="mt-10 text-center">
              <Link to="/login" className="text-[11px] font-black text-blue-500 hover:text-blue-600 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                {t('recovery.back')}
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
