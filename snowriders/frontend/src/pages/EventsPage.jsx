import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { getEventTheme, extractLocationLink, getLocationTitle } from '../utils/theme';

export default function EventsPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'all';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialTab);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/events').then(res => { 
      setEvents(res.data.events); 
      setLoading(false); 
    }).catch(() => setLoading(false));
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') navigate('/dashboard');
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [navigate]);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab) setFilter(tab);
  }, [location.search]);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const fiveDaysFromNow = new Date(startOfToday.getTime() + 5 * 24 * 60 * 60 * 1000 + (23 * 60 * 60 * 1000) + (59 * 60 * 1000));

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.location?.toLowerCase().includes(search.toLowerCase());
    const eventDate = new Date(e.date);
    
    if (filter === 'upcoming') {
      return eventDate >= startOfToday && eventDate <= fiveDaysFromNow && !e.isFull && matchSearch;
    }
    if (filter === 'registered') return e.isRegistered && matchSearch;
    if (filter === 'past') return e.isPast && matchSearch;
    return matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      
      {/* Main White Container */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden">
        
        {/* Header Section */}
        <div className="p-10 pb-0 text-center">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
            {t('events.title')} <span className="text-slate-300 font-medium">({events.length})</span>
          </h1>
          
          {/* Search Bar */}
          <div className="mt-8 mb-4 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text" 
                placeholder={t('events.search')}
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-200 transition-all placeholder-slate-400"
              />
            </div>
          </div>

          {/* Underline Tabs */}
          <div className="flex justify-start gap-8 border-b border-slate-100 px-2 mt-8 overflow-x-auto no-scrollbar">
            {[
              ['all', `${t('events.all')} (${events.length})`],
              ['upcoming', t('dashboard.tabs.upcoming')],
              ['registered', t('dashboard.tabs.registered')],
              ['past', t('dashboard.tabs.past')]
            ].map(([val, label]) => (
              <button 
                key={val} 
                onClick={() => setFilter(val)}
                className={`pb-4 px-1 text-sm font-black uppercase tracking-wider transition-all relative ${
                  filter === val 
                    ? 'text-blue-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-900 after:rounded-full translate-y-[1px]' 
                    : 'text-slate-300 hover:text-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        <div className="p-8 lg:p-12 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">{t('dashboard.loading')}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <span className="text-5xl mb-6 opacity-20 filter grayscale">🏂</span>
              <h4 className="text-[14px] font-black text-slate-300 mb-2 uppercase tracking-widest">{t('events.not_found')}</h4>
              <p className="text-slate-200 text-[12px] font-medium italic">{t('dashboard.empty.available')}</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {filtered.map((event) => {
                const theme = getEventTheme(event._id);
                const locationTitle = getLocationTitle(event.location);

                return (
                  <Link 
                    key={event._id} 
                    to={`/events/${event._id}`}
                    className={`group relative bg-slate-50/50 rounded-[2.5rem] border-4 ${theme.border.replace('/15', '')} p-10 transition-all hover:scale-[1.01] hover:shadow-xl flex flex-col items-center text-center`}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-6 right-8">
                      {(event.isPast || event.isRegistrationClosed) ? (
                        <span className="bg-[#212349] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">
                          {t('events.completed')}
                        </span>
                      ) : event.isFull ? (
                        <span className="bg-orange-500 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">
                          {t('events.full')}
                        </span>
                      ) : null}
                    </div>

                    {/* Content */}
                    <div className="mt-8 mb-4">
                      <h2 className={`font-black text-2xl ${theme.text} mb-6 tracking-tight uppercase leading-none`}>
                        {event.title}
                      </h2>
                      
                      <div className="flex flex-col items-center gap-4 text-slate-500 font-bold">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 opacity-40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[15px]">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 opacity-40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[15px]">
                            {event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : (event.startTime || event.time || '09.00 - 17.00')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 w-full justify-center">
                          <svg className="w-5 h-5 opacity-40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span className="text-[15px] truncate max-w-[250px]">
                            {locationTitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
