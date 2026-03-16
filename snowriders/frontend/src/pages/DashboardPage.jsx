import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { getEventTheme, getLocationTitle } from '../utils/theme';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then(res => {
      setEvents(res.data.events);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const fiveDaysFromNow = new Date(startOfToday.getTime() + 5 * 24 * 60 * 60 * 1000 + (23 * 60 * 60 * 1000) + (59 * 60 * 1000));

  const available = events.filter(e => !e.isPast);
  const registered = events.filter(e => e.isRegistered);
  const upcomingEarly = available.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate >= startOfToday && eventDate <= fiveDaysFromNow;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Welcome Section */}
      <section className="flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            {t('dashboard.welcome', { name: user?.name })}
          </h1>
        </div>
        <button 
           onClick={() => navigate('/events')}
           className="px-8 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-4"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          {t('dashboard.explore')}
        </button>
      </section>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: t('dashboard.stats.upcoming'), count: upcomingEarly.length, hint: t('dashboard.stats.upcomingHint'), icon: '📅', color: 'blue' },
          { label: t('dashboard.stats.registered'), count: registered.length, hint: t('dashboard.stats.registeredHint'), icon: '✅', color: 'emerald' },
          { label: t('dashboard.stats.total'), count: available.length, hint: t('dashboard.stats.totalHint'), icon: '❄️', color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
             <div className="flex items-center justify-between mb-8">
               <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
               <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform ${
                 stat.color === 'blue' ? 'text-blue-500' :
                 stat.color === 'emerald' ? 'text-emerald-500' :
                 stat.color === 'orange' ? 'text-orange-500' : 'text-purple-500'
               }`}>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    {stat.color === 'blue' && <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                    {stat.color === 'emerald' && <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {stat.color === 'orange' && <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />}
                    {stat.color === 'purple' && <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />}
                 </svg>
               </div>
             </div>
             <div>
               <span className="text-4xl font-black text-slate-900 block mb-2 tracking-tighter">
                 {typeof stat.count === 'string' ? stat.count : (stat.count < 10 ? `0${stat.count}` : stat.count)}
               </span>
               <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest block">
                 {stat.hint}
               </span>
             </div>
          </div>
        ))}
      </section>

      {/* Grid Layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Yaklaşan Etkinlikler */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{t('dashboard.upcomingTitle')}</h2>
            <Link to="/events?tab=upcoming" className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-all uppercase tracking-widest">
              {t('dashboard.viewAll')} —
            </Link>
          </div>
          
          <div className="space-y-6">
            {upcomingEarly.length === 0 ? (
              <div className="bg-white border-2 border-slate-100 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center text-center min-h-[300px]">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl mb-8 border border-slate-100 opacity-40">🏔️</div>
                 <p className="text-slate-600 text-[14px] font-bold max-w-xs leading-relaxed">
                   {t('dashboard.empty.upcoming')}
                 </p>
              </div>
            ) : (
              upcomingEarly.map((event) => {
                const theme = getEventTheme(event._id);
                const locationTitle = getLocationTitle(event.location);
                const timeString = event.startTime ? (event.endTime ? `${event.startTime} - ${event.endTime}` : event.startTime) : (event.time || '09.00');

                return (
                  <Link key={event._id} to={`/events/${event._id}`} className="block group">
                    <div className={`bg-white p-8 rounded-[2rem] border-2 ${theme.border} shadow-sm hover:shadow-md transition-all flex items-center justify-between group-hover:scale-[1.01]`}>
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl ${theme.lightBg} flex items-center justify-center ${theme.text} group-hover:scale-110 transition-transform`}>
                          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 6l6 14H4L14 6z" opacity="0.3" />
                            <path d="M10 10l-6 10h12l-6-10z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className={`text-lg font-black ${theme.text} uppercase tracking-tight transition-colors`}>{event.title}</h4>
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                             {new Date(event.date).toLocaleDateString()} • {timeString} • {locationTitle}
                          </p>
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-full ${theme.lightBg} flex items-center justify-center ${theme.text} group-hover:translate-x-1 transition-all`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                           <path d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* Right: Katıldığım Etkinlikler */}
        <section className="space-y-8">
          <div className="px-2">
            <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{t('dashboard.registeredTitle')}</h2>
          </div>
          
          <div className="space-y-6">
            {registered.length === 0 ? (
              <div className="bg-white border-2 border-slate-100 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center text-center h-[300px]">
                 <p className="text-slate-600 text-[12px] font-black uppercase tracking-widest text-center px-4">
                   {t('dashboard.empty.registered')}
                 </p>
                 <Link to="/events" className="mt-6 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-100 pb-1">
                   {t('dashboard.empty.registeredLink')}
                 </Link>
              </div>
            ) : (
              registered.slice(0, 4).map((event) => {
                const theme = getEventTheme(event._id);
                const timeString = event.startTime ? (event.endTime ? `${event.startTime} - ${event.endTime}` : event.startTime) : (event.time || '09.00');

                return (
                  <Link key={event._id} to={`/events/${event._id}`} className="block group">
                    <div className={`bg-white p-6 rounded-3xl border-2 ${theme.border} shadow-sm hover:shadow-md transition-all flex items-center justify-between group-hover:scale-[1.02]`}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-12 h-12 rounded-xl ${theme.lightBg} flex items-center justify-center ${theme.text} shrink-0 group-hover:scale-110 transition-transform`}>
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 6l6 14H4L14 6z" opacity="0.3" />
                            <path d="M10 10l-6 10h12l-6-10z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-sm font-black ${theme.text} uppercase tracking-tight truncate transition-colors`}>{event.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {new Date(event.date).toLocaleDateString()} • {timeString}
                          </p>
                        </div>
                      </div>
                      <svg className={`w-4 h-4 ${theme.text} opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
