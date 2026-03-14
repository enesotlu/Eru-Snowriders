import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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

  const handleTabChange = (t) => {
    setTab(t);
    setError('');
    setSuccessMsg('');
    setForm({ email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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
      setError(err.response?.data?.message || 'Giriş yapılamadı');
    } finally {
      setLoading(false);
    }
  };

  const tabBtn = (value, label) => (
    <button
      type="button"
      onClick={() => handleTabChange(value)}
      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
        tab === value
          ? value === 'admin'
            ? 'bg-slate-800 text-white shadow'
            : 'bg-blue-600 text-white shadow'
          : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏔️</div>
          <h1 className="text-2xl font-bold text-slate-800">ERÜ Snowriders</h1>
          <p className="text-slate-500 mt-1">Kulüp paneline hoş geldiniz</p>
        </div>
        
        {/* Toggle / Tabs */}
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 mb-8 shadow-inner">
          {tabBtn('user', t('login.userTab'))}
          {tabBtn('admin', t('login.adminTab'))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
            {tabBtn('user', '👤 Kullanıcı Girişi')}
            {tabBtn('admin', '⚙️ Admin Girişi')}
          </div>

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm">{successMsg}</div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
          )}

          {tab === 'admin' && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm">
              ⚠️ Bu alan yalnızca sistem adminleri içindir.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('login.email')}</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder={tab === 'admin' ? 'admin@snowriders.com' : 'ornek@gmail.com'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('login.password')}</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {t('login.remember')}
              </label>
              
              {tab === 'user' && (
                <Link to="/forgot-password" className="text-sm text-blue-600 font-semibold hover:underline">
                  {t('login.forgot')}
                </Link>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-xl transition disabled:opacity-60 mt-2 text-white ${
                tab === 'admin'
                  ? 'bg-slate-800 hover:bg-slate-900'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? t('login.loading') : tab === 'admin' ? t('login.adminButton') : t('login.button')}
            </button>
          </form>

          {tab === 'user' && (
            <p className="text-center text-sm text-slate-500 mt-6">
              {t('login.noAccount')} <Link to="/register" className="text-blue-600 font-semibold hover:underline">{t('login.register')}</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
