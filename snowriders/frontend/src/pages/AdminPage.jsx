import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = { title: '', description: '', date: '', location: '', capacity: '' };

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'members'
  
  // Events State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showParticipants, setShowParticipants] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [parsLoading, setParsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Members State
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const fetchEvents = () =>
    api.get('/admin/events').then(res => { setEvents(res.data.events); setLoading(false); });

  const fetchMembers = () => {
    setMembersLoading(true);
    api.get('/admin/users').then(res => { setMembers(res.data.users); setMembersLoading(false); });
  };

  useEffect(() => { 
    if (activeTab === 'events') fetchEvents();
    if (activeTab === 'members' && members.length === 0) fetchMembers();
  }, [activeTab]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Zorunlu';
    if (!form.description.trim()) e.description = 'Zorunlu';
    if (!form.date) e.date = 'Zorunlu';
    else if (new Date(form.date) < new Date(new Date().toDateString())) e.date = 'Geçmiş tarih seçilemez';
    if (!form.capacity || form.capacity < 1 || form.capacity > 500) e.capacity = '1-500 arasında olmalı';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true); setMessage({ type: '', text: '' });
    try {
      if (editId) {
        await api.put(`/admin/events/${editId}`, form);
        setMessage({ type: 'success', text: 'Etkinlik güncellendi.' });
      } else {
        await api.post('/admin/events', { ...form, capacity: Number(form.capacity) });
        setMessage({ type: 'success', text: 'Etkinlik oluşturuldu.' });
      }
      setForm(emptyForm); setEditId(null); setErrors({});
      fetchEvents();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Hata oluştu' });
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Etkinliği silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/admin/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
      setMessage({ type: 'success', text: 'Etkinlik silindi.' });
    } catch { setMessage({ type: 'error', text: 'Silinemedi' }); }
  };

  const handleEdit = (event) => {
    setEditId(event._id);
    setForm({
      title: event.title, description: event.description,
      date: event.date?.slice(0, 10), location: event.location || '', capacity: event.capacity
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadParticipants = async (event) => {
    setShowParticipants(event._id); setParsLoading(true); setParticipants([]);
    try {
      const res = await api.get(`/admin/events/${event._id}/registrations`);
      setParticipants(res.data.users);
    } finally { setParsLoading(false); }
  };

  const downloadCsv = async (event) => {
    try {
      const res = await api.get(`/admin/events/${event._id}/registrations/csv`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event.title}_katilimcilar.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage({ type: 'error', text: 'CSV indirilemedi.' });
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[field] ? 'border-red-400' : 'border-slate-200'}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Yönetim Paneli ⚙️</h1>
        <p className="text-slate-500 text-sm mt-1">Platformu, etkinlikleri ve üyeleri yönetin</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button 
          onClick={() => { setActiveTab('events'); setMessage({ type: '', text: '' }); }}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'events' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          🎿 Etkinlikler
        </button>
        <button 
          onClick={() => { setActiveTab('members'); setMessage({ type: '', text: '' }); }}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'members' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          👥 Tüm Üyeler
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
        }`}>{message.text}</div>
      )}

      {activeTab === 'events' ? (
        <>
          {/* Create / Edit Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="font-bold text-slate-800 mb-5">{editId ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Etkinlik Adı</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass('title')} placeholder="Kış Kampı 2025" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Açıklama</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass('description')} placeholder="Etkinlik hakkında detaylı bilgi..." />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tarih</label>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className={inputClass('date')} />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Kontenjan (max 500)</label>
              <input type="number" min="1" max="500" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} className={inputClass('capacity')} placeholder="50" />
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Konum (opsiyonel)</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputClass('location')} placeholder="Erciyes Dağı" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting}
              className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
              {submitting ? 'Kaydediliyor...' : editId ? 'Güncelle' : 'Etkinlik Oluştur'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); setErrors({}); }}
                className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition">
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Tüm Etkinlikler ({events.length})</h2>
        </div>
        {loading ? (
          <div className="text-center py-10 text-slate-400">Yükleniyor...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 text-slate-400">Henüz etkinlik yok.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map(event => (
              <div key={event._id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800">{event.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(event.date).toLocaleDateString('tr-TR')} · {event.registeredUsers?.length}/{event.capacity} kayıtlı
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0 flex-wrap">
                    <button onClick={() => loadParticipants(event)}
                      className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-600 font-medium rounded-lg transition">
                      Katılımcılar
                    </button>
                    <button onClick={() => downloadCsv(event)}
                      className="text-xs px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-lg transition">
                      ⬇ CSV İndir
                    </button>
                    <button onClick={() => handleEdit(event)}
                      className="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition">
                      Düzenle
                    </button>
                    <button onClick={() => handleDelete(event._id)}
                      className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition">
                      Sil
                    </button>
                  </div>
                </div>

                {/* Participants Panel */}
                {showParticipants === event._id && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-700 text-sm">Katılımcılar ({participants.length})</h4>
                      <button onClick={() => setShowParticipants(null)} className="text-xs text-slate-400 hover:text-slate-600">Kapat</button>
                    </div>
                    {parsLoading ? <p className="text-sm text-slate-400">Yükleniyor...</p> :
                      participants.length === 0 ? <p className="text-sm text-slate-400">Henüz kayıtlı kişi yok.</p> : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead><tr className="text-xs text-slate-500 border-b border-slate-200">
                              <th className="text-left pb-2">Ad Soyad</th>
                              <th className="text-left pb-2">Öğrenci No</th>
                              <th className="text-left pb-2">Telefon</th>
                              <th className="text-left pb-2">Email</th>
                              <th className="text-left pb-2">Bölüm</th>
                            </tr></thead>
                            <tbody className="divide-y divide-slate-100">
                              {participants.map(p => (
                                <tr key={p._id} className="hover:bg-white">
                                  <td className="py-2 font-medium text-slate-800">{p.name} {p.surname}</td>
                                  <td className="py-2 text-slate-600">{p.studentNumber}</td>
                                  <td className="py-2 text-slate-600">{p.phone || '-'}</td>
                                  <td className="py-2 text-slate-600">{p.email}</td>
                                  <td className="py-2 text-slate-500 text-xs">{p.department}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
        </>
      ) : (
        /* Members Tab */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Platform Üyeleri ({members.length})</h2>
            <button onClick={fetchMembers} className="text-xs text-blue-600 font-medium hover:underline">Yenile</button>
          </div>
          
          {membersLoading ? (
            <div className="text-center py-10 text-slate-400">Yükleniyor...</div>
          ) : members.length === 0 ? (
            <div className="text-center py-10 text-slate-400">Kayıtlı kullanıcı bulunamadı.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Ad Soyad</th>
                    <th className="px-6 py-4 font-medium">Öğrenci No</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Bölüm</th>
                    <th className="px-6 py-4 font-medium">Rol</th>
                    <th className="px-6 py-4 font-medium text-right">Kayıt Tarihi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map(user => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">{user.name} {user.surname}</td>
                      <td className="px-6 py-4 text-slate-600">{user.studentNumber}</td>
                      <td className="px-6 py-4 text-slate-600">{user.email}</td>
                      <td className="px-6 py-4 text-slate-500">{user.department}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400 text-xs">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
