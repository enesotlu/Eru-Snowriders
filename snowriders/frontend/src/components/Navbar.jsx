import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { t, i18n } = useTranslation();

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('tr') ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkClass = (path) =>
    `text-sm font-black transition-all px-4 py-2 rounded-2xl uppercase tracking-tight italic ${
      location.pathname === path 
        ? 'bg-[#00A8E8] text-white shadow-lg shadow-blue-500/20 border border-white/20' 
        : 'text-[#1A2B3C]/40 hover:text-[#1A2B3C] hover:bg-white/40 border border-transparent'
    }`;

  const mobileLinkClass = (path) =>
    `block text-sm font-black transition-all px-5 py-3.5 rounded-2xl uppercase tracking-tight italic ${
      location.pathname === path 
        ? 'bg-[#00A8E8] text-white shadow-lg shadow-blue-500/20 border border-white/20' 
        : 'text-[#1A2B3C]/40 hover:text-[#1A2B3C] hover:bg-white/40 border border-transparent'
    }`;

  const getInitials = (name, surname) => {
    if (!name || !surname) return '👤';
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  return (
    <nav className="bg-white/40 backdrop-blur-[30px] border-b border-white/60 sticky top-0 z-50 rounded-b-[2rem] shadow-[0_8px_32px_rgba(0,168,232,0.05)] mx-2 mt-2">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-white/60 group-hover:scale-110 group-hover:bg-[#00A8E8] group-hover:text-white transition-all duration-500 shadow-sm overflow-hidden">
                <img src="/golden_logo.jpg" alt="Logo" className="w-7 h-7 object-cover mix-blend-multiply opacity-90 group-hover:invert group-hover:brightness-0 group-hover:contrast-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[#1A2B3C] text-sm leading-none tracking-tighter uppercase italic">
                ERÜ <span className="text-[#00A8E8]">KAYAK & SNOWBOARD</span>
              </span>
              <span className="text-[8px] font-bold text-[#1A2B3C]/40 uppercase tracking-[0.2em] mt-0.5 italic">Kulübü</span>
            </div>
          </Link>

          {/* Nav Links - Desktop */}
          {user && (
            <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              <Link to="/dashboard" className={linkClass('/dashboard')}>{t('nav.home') || 'Dashboard'}</Link>
              <Link to="/events" className={linkClass('/events')}>{t('nav.events') || 'Expeditions'}</Link>
              {isAdmin && <Link to="/admin" className={linkClass('/admin')}>{t('nav.admin') || 'HQ'}</Link>}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="text-[10px] font-black text-[#1A2B3C]/60 hover:text-[#00A8E8] px-3 py-1.5 rounded-xl transition-all border border-white/60 bg-white/60 hover:bg-white shadow-sm uppercase italic"
            >
              {i18n.language.startsWith('tr') ? 'TR' : 'EN'}
            </button>

            {user && (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-white text-[#1A2B3C] font-black text-xs hover:bg-[#00A8E8] hover:text-white shadow-sm transition-all duration-500 border border-white/60 focus:outline-none"
                >
                  {getInitials(user.name, user.surname)}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-4 w-60 bg-white/95 backdrop-blur-[30px] rounded-[2rem] shadow-2xl border border-white py-3 origin-top-right z-50 animate-in fade-in zoom-in-95 duration-300 p-2">
                    <div className="px-4 py-4 border-b border-black/5 mb-2">
                      <p className="text-sm font-black text-[#1A2B3C] truncate italic uppercase tracking-tighter">{user.name} {user.surname}</p>
                      <p className="text-[10px] text-[#00A8E8] font-black truncate mt-1 opacity-60 italic">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2.5 text-xs font-black text-[#1A2B3C]/60 hover:bg-[#00A8E8]/5 hover:text-[#00A8E8] transition-all rounded-xl italic uppercase tracking-tight"
                    >
                      {t('nav.profile', 'Profile Detail')}
                    </Link>
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-black text-red-500 hover:bg-red-50 transition-all rounded-xl italic uppercase tracking-tight mt-1"
                    >
                      {t('nav.logout', 'Exit Station')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {user && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-3 rounded-xl text-[#1A2B3C]/60 hover:bg-white/60 hover:text-[#00A8E8] border border-transparent hover:border-white/60 focus:outline-none transition-all shadow-sm"
              >
                {isOpen ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && isOpen && (
          <div className="md:hidden border-t border-black/5 py-6 space-y-2 pb-8 animate-in slide-in-from-top-4 duration-500">
            <div className="px-5 py-4 mb-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
              <p className="text-sm font-black text-[#1A2B3C] italic tracking-tighter uppercase">{user.name} {user.surname}</p>
              <p className="text-[10px] text-[#00A8E8] font-bold opacity-60 italic">{user.email}</p>
            </div>
            
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className={mobileLinkClass('/dashboard')}>{t('nav.home') || 'DASHBOARD'}</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className={mobileLinkClass('/events')}>{t('nav.events') || 'EXPEDITIONS'}</Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className={mobileLinkClass('/profile')}>{t('nav.profile') || 'MY PROFILE'}</Link>
            {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin')}>{t('nav.admin') || 'HQ PANEL'}</Link>}
            
            <button
              onClick={() => { setIsOpen(false); handleLogout(); }}
              className="w-full text-left flex items-center gap-3 px-5 py-3.5 text-sm font-black text-red-500 bg-red-50 rounded-2xl transition-all border border-red-100 mt-6 italic uppercase tracking-tight"
            >
              <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              {t('nav.logout') || 'EXIT STATION'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
