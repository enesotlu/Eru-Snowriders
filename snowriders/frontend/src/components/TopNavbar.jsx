import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function TopNavbar() {
  const { user, logoutUser, isAdmin } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getInitials = (name, surname) => {
    if (!name && !surname) return '👤';
    return `${name?.charAt(0) || ''}${surname?.charAt(0) || ''}`.toUpperCase();
  };

  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005';

  return (
    <nav className="h-20 px-10 flex items-center justify-between bg-transparent sticky top-0 z-[60]">
      
      {/* Page Title Context */}
      <div className="flex items-center gap-4">
         <h2 className="text-xl font-black text-slate-800 tracking-tight capitalize">
            {(() => {
              const path = location.pathname;
              if (path.startsWith('/events/') && path.split('/').length > 2) return 'Etkinlik Detayı';
              return path.split('/').filter(Boolean).pop() || 'Dashboard';
            })()}
         </h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        
        {/* Language Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button 
            onClick={() => changeLanguage('tr')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${i18n.language === 'tr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            TR
          </button>
          <button 
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${i18n.language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            EN
          </button>
        </div>


        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white text-[11px] font-bold overflow-hidden border-2 border-[#D4AF37]/50 shadow-sm">
              {user?.profileImage ? (
                <img src={`${backendUrl}${user.profileImage}`} alt="" className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.name, user?.surname)
              )}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-[12px] font-bold text-slate-700 leading-none">{user?.name} <span className="text-[10px] text-slate-400 font-medium ml-1">▼</span></p>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-slate-100 shadow-xl p-2 py-2.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="md:hidden border-b border-slate-100 mb-2 pb-2 space-y-1">
                <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all">
                  <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  {t('nav.home', 'Dashboard')}
                </Link>
                <Link to="/events" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all">
                  <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  {t('nav.events', 'Etkinlikler')}
                </Link>
                <Link to="/my-bookings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all">
                  <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  {t('dashboard.tabs.registered', 'Kayıtlı Etkinlikler')}
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50/50 hover:bg-blue-50 transition-all mt-1">
                    <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    {t('nav.admin', 'Admin')}
                  </Link>
                )}
              </div>
              <Link 
                to="/profile" 
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
              >
                <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {t('nav.profile')}
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-all text-left"
              >
                <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                {t('nav.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
