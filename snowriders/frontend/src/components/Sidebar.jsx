import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { isAdmin, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path) => {
    const isEventsPage = location.pathname.startsWith('/events');
    const isRegisteredTab = location.search.includes('tab=registered');

    if (path === '/my-bookings') return isRegisteredTab;
    if (path === '/events') return isEventsPage && !isRegisteredTab;
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: t('nav.home'), path: '/dashboard', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { name: t('nav.events'), path: '/events', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )},
    { name: t('dashboard.tabs.registered'), path: '/my-bookings', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )},
    { name: t('nav.profile'), path: '/profile', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )}
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 h-[calc(100vh-2rem)] my-4 ml-4 rounded-[2.5rem] py-12 px-8 shrink-0 transition-all duration-500 relative z-50 overflow-hidden bg-[#f1f5f9] border border-slate-100 shadow-sm">
      
      {/* Brand / Logo */}
      <Link to="/dashboard" className="relative z-10 flex flex-col items-center gap-4 px-2 mb-16 group no-underline text-center">
        <div className="w-16 h-16 rounded-[1.25rem] bg-white flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-105 transition-all duration-700 shadow-sm">
          <img src="/golden_logo.jpg" alt="Logo" className="w-10 h-10 rounded-xl object-contain" />
        </div>
        <div>
          <span className="block font-black text-slate-900 tracking-tighter leading-none text-xl font-archivo uppercase">ERU KAYAK</span>
          <span className="block font-black text-[0.65rem] text-slate-500 tracking-[0.4em] uppercase mt-2">SNOWBOARD</span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 space-y-2">
        <p className="px-6 text-[0.7rem] font-black text-slate-600 uppercase tracking-[0.5em] mb-6">{t('nav.navigation')}</p>
        
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`group flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 text-[11px] font-black uppercase tracking-[0.2em] ${
                active
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span className={`transition-all duration-300 ${active ? 'text-blue-700' : 'text-slate-500 group-hover:text-slate-700'}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
        
        {isAdmin && (
          <div className="pt-10">
            <p className="px-6 text-[0.7rem] font-black text-slate-500 uppercase tracking-[0.5em] mb-6">{t('nav.management')}</p>
            <Link 
              to="/admin" 
              className={`group flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 text-[11px] font-black uppercase tracking-[0.2em] ${
                isActive('/admin')
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            <span className={`transition-all duration-300 ${isActive('/admin') ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </span>
            {t('nav.admin')}
            </Link>
          </div>
        )}
      </nav>

      {/* Footer / User */}
      <div className="relative z-10 pt-8 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-5 px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
          {t('nav.logout')}
        </button>
      </div>

    </aside>
  );
}
