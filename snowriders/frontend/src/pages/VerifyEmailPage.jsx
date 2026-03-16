import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

export default function VerifyEmailPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const inputRefs = useRef([]);

  const email = location.state?.email || '';
  const initialMessage = location.state?.message || '';

  useEffect(() => {
    if (!email) {
      setServerError(t('verify.noEmail') || 'Email bilgisi bulunamadı.');
    }
    if (initialMessage) {
      setServerError(initialMessage);
      window.history.replaceState({ email }, document.title);
    }
  }, [email, initialMessage, t]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      const pasted = value.replace(/[^0-9]/g, '').slice(0, 6);
      const newCode = [...code];
      for (let i = 0; i < pasted.length; i++) {
        newCode[i] = pasted[i];
      }
      setCode(newCode);
      const focusIndex = Math.min(pasted.length, 5);
      if (inputRefs.current[focusIndex]) inputRefs.current[focusIndex].focus();
      return;
    }

    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (!email) {
      setServerError(t('verify.noEmail') || 'Email bilgisi bulunamadı.');
      return;
    }
    if (fullCode.length !== 6) {
      setServerError(t('verify.invalidCode') || 'Doğrulama kodu 6 haneli olmalıdır');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/verify', { email, code: fullCode });
      setSuccessMsg(t('verify.success') || 'Email başarıyla doğrulandı!');
      setTimeout(() => {
        navigate('/login', { state: { message: t('verify.loginRedirect') || 'Hesabınız doğrulandı. Lütfen giriş yapın.' } });
      }, 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || t('verify.error') || 'Doğrulama başarısız');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!email) return;
    setLoading(true);
    setServerError('');
    setSuccessMsg('');
    try {
      await api.post('/auth/resend-code', { email });
      setSuccessMsg(t('verify.resendSuccess') || 'Yeni kod gönderildi.');
    } catch (err) {
      setServerError(err.response?.data?.message || t('verify.resendError') || 'Kod gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative p-4 sm:p-6 md:p-8 bg-[#F0F7FF]">
      {/* Sunny Background Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-50 via-white to-white"></div>
      
      <div className="flex-grow w-full flex items-center justify-center relative z-10 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-[24px] rounded-[3rem] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,168,232,0.08)] border border-white relative overflow-hidden">
            
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white rounded-3xl p-2.5 shadow-sm border border-slate-50 flex items-center justify-center">
                  <img src="/golden_logo.jpg" alt="Logo" className="w-full h-full object-contain mix-blend-multiply opacity-90" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase mb-2">
                {t('verify.title') || 'DOĞRULAMA'}
              </h1>
              <div className="space-y-2">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest px-4 leading-relaxed">
                  {email ? (
                    <>
                      {t('verify.sentTo') || 'Kod gönderilen adres:'}<br/>
                      <span className="text-blue-500 lowercase">{email}</span>
                    </>
                  ) : (
                    t('verify.awaiting') || 'Doğrulama kodu bekleniyor'
                  )}
                </p>
              </div>
            </div>

            {serverError && (
              <div className="mb-10 p-5 rounded-2xl text-[11px] font-bold uppercase tracking-widest bg-red-50 text-red-500 border border-red-100 text-center">
                {serverError}
              </div>
            )}
            {successMsg && (
              <div className="mb-10 p-5 rounded-2xl text-[11px] font-bold uppercase tracking-widest bg-green-50 text-green-600 border border-green-100 text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-between gap-2 sm:gap-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    disabled={!email || loading || !!successMsg}
                    className="w-full h-14 sm:h-16 text-center text-xl font-bold rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 focus:outline-none focus:border-blue-200 transition-all shadow-sm"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || code.join('').length !== 6 || !email || !!successMsg}
                className="btn-primary w-full py-5 text-sm font-bold uppercase tracking-[0.2em] rounded-2xl transition-all disabled:opacity-50 mt-4 group flex items-center justify-center gap-3"
              >
                {loading ? 'DOĞRULANIYOR...' : (
                  <>
                    {t('verify.button') || 'DOĞRULA'}
                    <svg className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-50 text-center space-y-4">
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">
                {t('verify.noCode') || 'Kod gelmedi mi?'}{' '}
                <button 
                  onClick={resendCode} 
                  disabled={loading || !email || !!successMsg}
                  className="text-orange-500 hover:text-orange-600 transition-all font-bold"
                >
                  {t('verify.resend') || 'YENİDEN GÖNDER'}
                </button>
              </p>
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">
                <Link to="/login" className="hover:text-slate-500 transition-all">← {t('verify.back') || 'GİRİŞE DÖN'}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <footer className="relative z-10 py-8 px-10 flex flex-col md:flex-row items-center justify-between pointer-events-none opacity-40">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">
          {t('login.footer')} ABDULLAH ENES OTLU
        </span>
        
        <div className="flex items-center gap-6 pointer-events-auto mt-6 md:mt-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => i18n.changeLanguage('tr')} 
              className={`p-1.5 rounded-xl transition-all ${i18n.language.startsWith('tr') ? 'bg-white shadow-sm scale-110' : 'opacity-40 grayscale'}`}
            >
               <span className="text-xl">🇹🇷</span>
            </button>
            <button 
              onClick={() => i18n.changeLanguage('en')} 
              className={`p-1.5 rounded-xl transition-all ${!i18n.language.startsWith('tr') ? 'bg-white shadow-sm scale-110' : 'opacity-40 grayscale'}`}
            >
               <span className="text-xl">🇬🇧</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
