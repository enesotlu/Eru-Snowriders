import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function VerifyEmailPage() {
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
      setServerError('Email bilgisi bulunamadı. Lütfen önce giriş yapmayı deneyin.');
    }
    if (initialMessage) {
      setServerError(initialMessage);
      window.history.replaceState({ email }, document.title);
    }
  }, [email, initialMessage]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      // Paste edildiğinde
      const pasted = value.replace(/[^0-9]/g, '').slice(0, 6);
      const newCode = [...code];
      for (let i = 0; i < pasted.length; i++) {
        newCode[i] = pasted[i];
      }
      setCode(newCode);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex].focus();
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
      setServerError('Email bilgisi bulunamadı.');
      return;
    }
    if (fullCode.length !== 6) {
      setServerError('Doğrulama kodu 6 haneli olmalıdır');
      return;
    }

    setLoading(true);
    setServerError('');
    setSuccessMsg('');

    try {
      await api.post('/auth/verify', { email, code: fullCode });
      setSuccessMsg('Email başarıyla doğrulandı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Hesabınız doğrulandı. Lütfen giriş yapın.' } });
      }, 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Doğrulama başarısız');
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
      setSuccessMsg('Yeni kod gönderildi. Lütfen emailinizi kontrol edin.');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Kod gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✉️</div>
          <h1 className="text-2xl font-bold text-slate-800">Email Doğrulama</h1>
          <p className="text-slate-500 mt-1">
            {email ? <><span className="font-semibold text-slate-700">{email}</span> adresine gönderilen 6 haneli kodu girin.</> : 'Lütfen emailinize gönderilen 6 haneli kodu girin.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          {serverError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center font-medium">
              {serverError}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm text-center font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  disabled={!email || loading || !!successMsg}
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || code.join('').length !== 6 || !email || !!successMsg}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-60 disabled:hover:bg-blue-600 shadow-sm"
            >
              {loading ? 'Doğrulanıyor...' : 'Kodu Onayla'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
            <p className="text-sm text-slate-500">
              Kodu almadınız mı?{' '}
              <button 
                onClick={resendCode} 
                disabled={loading || !email || !!successMsg}
                className="text-blue-600 font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
              >
                Tekrar Gönder
              </button>
            </p>
            <p className="text-sm text-slate-400">
              <Link to="/login" className="hover:text-slate-600 transition">← Giriş sayfasına dön</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
