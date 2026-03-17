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
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-slate-900 font-inter">
      {/* Background Image */}
      <img src="/erciyes-bg.png" className="fixed inset-0 w-full h-full object-cover z-0 opacity-90" alt="" />
      
      <div className="flex-grow w-full flex items-center justify-center relative z-10 py-12 px-4">
        <div className="w-full max-w-md">
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
            
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg border-2 border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-8 overflow-hidden">
                  <img src="/club-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase mb-2">
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
              <div className="mb-10 p-5 rounded-2xl text-[11px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 text-center">
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
                className="w-full py-5 bg-[#212349] text-white text-[15px] font-black uppercase tracking-[0.25em] rounded-xl shadow-[0_10px_30px_rgba(33,35,73,0.3)] hover:bg-[#2c2f61] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 group flex items-center justify-center gap-3"
              >
                {loading ? 'DOĞRULANIYOR...' : (
                  <>
                    {t('verify.button') || 'DOĞRULA'}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-50 text-center space-y-4">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                {t('verify.noCode') || 'Kod gelmedi mi?'}{' '}
                <button 
                  onClick={resendCode} 
                  disabled={loading || !email || !!successMsg}
                  className="text-orange-500 hover:text-orange-600 transition-all font-bold"
                >
                  {t('verify.resend') || 'YENİDEN GÖNDER'}
                </button>
              </p>
              <p className="text-[11px] font-bold uppercase tracking-widest">
                <Link to="/login" className="text-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                  {t('verify.back') || 'GİRİŞE DÖN'}
                </Link>
              </p>
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
