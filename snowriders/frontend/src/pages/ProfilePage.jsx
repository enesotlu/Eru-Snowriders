import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = [
  'Bilgisayar Mühendisliği', 'Makine Mühendisliği', 'Elektrik Elektronik Mühendisliği',
  'İnşaat Mühendisliği', 'Endüstri Mühendisliği', 'Kimya Mühendisliği',
  'Tıp', 'Diş Hekimliği', 'Eczacılık', 'İktisadi ve İdari Bilimler',
  'Eğitim', 'Fen Edebiyat', 'Güzel Sanatlar', 'Diğer'
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', surname: '', department: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/users/me').then(res => {
      const u = res.data.user;
      setProfile(u);
      setForm({ name: u.name, surname: u.surname, department: u.department });
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.surname.trim()) {
      setMessage({ type: 'error', text: 'İsim ve soyisim boş bırakılamaz' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.put('/users/me', form);
      setProfile(data.user);
      updateUser({ name: data.user.name, surname: data.user.surname, department: data.user.department });
      setMessage({ type: 'success', text: 'Profil başarıyla güncellendi!' });
      setEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Güncelleme başarısız' });
    } finally { setLoading(false); }
  };

  if (!profile) return <div className="text-center py-20 text-slate-400">Yükleniyor...</div>;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profilim 👤</h1>
        <p className="text-slate-500 text-sm mt-1">Kişisel bilgilerini yönet</p>
      </div>

      {/* Avatar Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
          {profile.name?.charAt(0)}{profile.surname?.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{profile.name} {profile.surname}</h2>
          <p className="text-sm text-slate-500">{profile.email}</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
            profile.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}>{profile.role === 'admin' ? '⚙️ Admin' : '❄️ Üye'}</span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Bilgiler</h3>
          {!editing && (
            <button onClick={() => { setEditing(true); setMessage({ type: '', text: '' }); }}
              className="text-sm text-blue-600 font-medium hover:underline">Düzenle</button>
          )}
        </div>

        {message.text && (
          <div className={`p-3 rounded-xl text-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>{message.text}</div>
        )}

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">İsim</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Soyisim</label>
                <input value={form.surname} onChange={e => setForm({...form, surname: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Bölüm</label>
              <select value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button type="button" onClick={() => setEditing(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition">
                İptal
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            {[
              ['Öğrenci No', profile.studentNumber],
              ['Bölüm', profile.department],
              ['Email', profile.email],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-sm font-medium text-slate-800">{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
