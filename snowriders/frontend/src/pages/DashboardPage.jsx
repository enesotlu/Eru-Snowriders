import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then(res => {
      setEvents(res.data.events);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const upcoming = events.filter(e => !e.isPast && !e.isFull);
  const registered = events.filter(e => e.isRegistered);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Hoş geldin 👋</p>
            <h1 className="text-2xl font-bold">{user?.name} {user?.surname}</h1>
            <p className="text-blue-200 text-sm mt-1">{user?.department || 'ERÜ Snowriders Üyesi'}</p>
          </div>
          <div className="text-6xl opacity-80">🏔️</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <p className="text-3xl font-bold text-blue-600">{events.length}</p>
          <p className="text-sm text-slate-500 mt-1">Toplam Etkinlik</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <p className="text-3xl font-bold text-emerald-600">{registered.length}</p>
          <p className="text-sm text-slate-500 mt-1">Kayıtlarım</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center col-span-2 sm:col-span-1">
          <p className="text-3xl font-bold text-indigo-600">{upcoming.length}</p>
          <p className="text-sm text-slate-500 mt-1">Yaklaşan Etkinlik</p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">{t('dashboard.events')}</h2>
          <Link to="/events" className="text-sm text-blue-600 font-medium hover:underline">{t('dashboard.all')} →</Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Yükleniyor...</div>
        ) : upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
            <p className="text-4xl mb-3">🎿</p>
            <p className="text-slate-500">{t('dashboard.noEvent')}</p>
            {isAdmin && <Link to="/admin" className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline">Etkinlik Ekle →</Link>}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.slice(0, 4).map(event => (
              <Link key={event._id} to={`/events/${event._id}`}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{event.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-1 rounded-full shrink-0">
                    {event.remainingCapacity} kalan
                  </span>
                </div>
                {event.location && <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">📍 {event.location}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/events" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-3">
          <span className="text-2xl">🎿</span>
          <div><p className="font-semibold text-slate-800">Etkinlikler</p><p className="text-xs text-slate-500">Etkinliklere katıl</p></div>
        </Link>
        <Link to="/profile" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-3">
          <span className="text-2xl">👤</span>
          <div><p className="font-semibold text-slate-800">Profilim</p><p className="text-xs text-slate-500">Bilgilerini güncelle</p></div>
        </Link>
      </div>
    </div>
  );
}
