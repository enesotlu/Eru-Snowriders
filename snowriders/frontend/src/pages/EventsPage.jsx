import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/events').then(res => { setEvents(res.data.events); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.location?.toLowerCase().includes(search.toLowerCase());
    if (filter === 'upcoming') return !e.isPast && !e.isFull && matchSearch;
    if (filter === 'registered') return e.isRegistered && matchSearch;
    if (filter === 'past') return e.isPast && matchSearch;
    return matchSearch;
  });

  const statusBadge = (event) => {
    if (event.isPast) return <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded-full">Sona Erdi</span>;
    if (event.isFull) return <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-full">Kontenjan Doldu</span>;
    if (event.isRegistered) return <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-1 rounded-full">✓ Kayıtlısın</span>;
    return <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-full">Kayıt Açık</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Etkinlikler 🎿</h1>
        <p className="text-slate-500 text-sm mt-1">Tüm etkinlikleri görüntüle ve kayıt ol</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text" placeholder="Etkinlik ara..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <div className="flex gap-2 flex-wrap">
          {[['all','Tümü'],['upcoming','Yaklaşan'],['registered','Kayıtlarım'],['past','Geçmiş']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === val ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏔️</p>
          <p className="text-slate-500">Etkinlik bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(event => (
            <Link key={event._id} to={`/events/${event._id}`}
              className="block bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h2 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{event.title}</h2>
                    {statusBadge(event)}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    <span>📅 {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    {event.location && <span>📍 {event.location}</span>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold text-slate-800">{event.registeredUsers?.length ?? 0}</p>
                  <p className="text-xs text-slate-400">/ {event.capacity}</p>
                  <p className="text-xs text-slate-400 mt-0.5">kayıtlı</p>
                </div>
              </div>
              {/* Capacity bar */}
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${event.isFull ? 'bg-red-400' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, ((event.registeredUsers?.length ?? 0) / event.capacity) * 100)}%` }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
