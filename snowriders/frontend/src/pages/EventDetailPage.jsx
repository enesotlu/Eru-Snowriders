import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get(`/events/${id}`).then(res => { setEvent(res.data.event); setLoading(false); }).catch(() => navigate('/events'));
  }, [id]);

  const handleRegister = async () => {
    setActionLoading(true); setMessage({ type: '', text: '' });
    try {
      await api.post(`/events/${id}/register`);
      setEvent(prev => ({ ...prev, isRegistered: true, registeredUsers: [...(prev.registeredUsers || []), 'me'] }));
      setMessage({ type: 'success', text: 'Etkinliğe başarıyla kayıt oldunuz! 🎉' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Kayıt yapılamadı' });
    } finally { setActionLoading(false); }
  };

  const handleCancel = async () => {
    if (!confirm('Kaydınızı iptal etmek istediğinize emin misiniz?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/events/${id}/register`);
      setEvent(prev => ({ ...prev, isRegistered: false, registeredUsers: (prev.registeredUsers || []).slice(0, -1) }));
      setMessage({ type: 'info', text: 'Etkinlik kaydınız iptal edildi.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'İptal yapılamadı' });
    } finally { setActionLoading(false); }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Yükleniyor...</div>;
  if (!event) return null;

  const registered = event.registeredUsers?.length ?? 0;
  const pct = Math.min(100, (registered / event.capacity) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back */}
      <button onClick={() => navigate('/events')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors">
        ← Etkinliklere Dön
      </button>

      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            {event.isPast && <span className="text-xs bg-white/20 text-white font-semibold px-2 py-1 rounded-full mb-2 inline-block">Sona Erdi</span>}
            {event.isFull && !event.isPast && <span className="text-xs bg-red-400/80 text-white font-semibold px-2 py-1 rounded-full mb-2 inline-block">Kontenjan Doldu</span>}
            {!event.isPast && !event.isFull && <span className="text-xs bg-emerald-400/80 text-white font-semibold px-2 py-1 rounded-full mb-2 inline-block">Kayıt Açık</span>}
            <h1 className="text-2xl font-bold mt-1">{event.title}</h1>
          </div>
          <span className="text-4xl">🏔️</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Tarih</p>
          <p className="font-semibold text-slate-800">
            {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {event.location && (
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Konum</p>
            <p className="font-semibold text-slate-800">{event.location}</p>
          </div>
        )}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm col-span-2">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Kontenjan</p>
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-slate-800">{registered} / {event.capacity} kişi</p>
            <p className="text-sm text-slate-500">{event.remainingCapacity} kalan</p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${event.isFull ? 'bg-red-400' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h2 className="font-bold text-slate-800 mb-3">Etkinlik Hakkında</h2>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{event.description}</p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-2xl text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
          message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' :
          'bg-blue-50 text-blue-600 border border-blue-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Action Button */}
      {!event.isPast && (
        <div>
          {event.isRegistered ? (
            <button onClick={handleCancel} disabled={actionLoading}
              className="w-full py-4 bg-white border border-red-200 text-red-500 hover:bg-red-50 font-semibold rounded-2xl transition disabled:opacity-60">
              {actionLoading ? 'İşleniyor...' : 'Kaydımı İptal Et'}
            </button>
          ) : (
            <button onClick={handleRegister} disabled={actionLoading || event.isFull}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition disabled:opacity-60">
              {actionLoading ? 'Kaydediliyor...' : event.isFull ? 'Kontenjan Doldu' : 'Etkinliğe Kayıt Ol'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
