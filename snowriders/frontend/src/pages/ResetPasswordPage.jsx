import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError(t('register.errors.passwordLength'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('register.errors.passwordMatch'));
      return;
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(t('recovery.resetSuccess'));
      setTimeout(() => navigate('/login', { state: { message: t('recovery.loginRedirect') } }), 3000);
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
            
            {/* Logo */}
            <div className="flex justify-center mb-8 text-center">
               <div>
                <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg border-2 border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-8 overflow-hidden">
                  <img src="/club-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-2 uppercase">
                  {t('recovery.resetTitle')}
                </h1>
                <p className="text-slate-400 text-[10px] font-medium italic">
                  {t('recovery.resetSubtitle')}
                </p>
               </div>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold text-center border border-emerald-100">{message}</div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-xl text-[10px] font-bold text-center border border-red-100">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('recovery.newPasswordLabel')}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder={t('register.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-blue-200 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('recovery.confirmPasswordLabel')}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder={t('register.passwordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-blue-200 transition-all shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#212349] text-white text-[15px] font-black uppercase tracking-[0.25em] rounded-xl shadow-[0_10px_30px_rgba(33,35,73,0.3)] hover:bg-[#2c2f61] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
              >
                {loading ? t('recovery.loading') : t('recovery.resetTitle')}
              </button>
            </form>

            <div className="mt-10 text-center">
              <Link to="/login" className="text-[10px] font-black text-blue-500 hover:text-blue-600 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                {t('recovery.back')}
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Design Credits */}
      <footer className="fixed bottom-6 left-6 z-20 pointer-events-auto">
         <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] drop-shadow-sm">
           {t('login.footer')} <span className="text-white font-black">ABDULLAH ENES OTLU</span>
         </span>
      </footer>
    </div>
  );
}
