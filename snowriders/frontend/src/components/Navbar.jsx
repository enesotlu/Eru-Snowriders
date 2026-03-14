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
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
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
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
      location.pathname === path ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
    }`;

  const mobileLinkClass = (path) =>
    `block text-base font-medium transition-colors px-4 py-3 rounded-lg ${
      location.pathname === path ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
    }`;

  const getInitials = (name, surname) => {
    if (!name || !surname) return '👤';
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🏔️</span>
            <span className="font-bold text-slate-800 text-lg leading-none">
              ERÜ<span className="text-blue-600"> Snowriders</span>
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          {user && (
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              <Link to="/dashboard" className={linkClass('/dashboard')}>{t('nav.home')}</Link>
              <Link to="/events" className={linkClass('/events')}>{t('nav.events')}</Link>
              {isAdmin && <Link to="/admin" className={linkClass('/admin')}>{t('nav.admin')}</Link>}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 px-2 py-1 rounded transition border border-transparent hover:border-blue-100 bg-slate-50 hover:bg-blue-50"
            >
              {i18n.language === 'tr' ? 'TR' : 'EN'}
            </button>

            {user && (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition focus:outline-none ring-2 ring-transparent focus:ring-blue-300"
                >
                  {getInitials(user.name, user.surname)}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 origin-top-right z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 mb-2">
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.name} {user.surname}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                      {t('nav.profile')}
                    </Link>
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {user && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              >
                {isOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && isOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-2 pb-6">
            <div className="px-4 py-3 mb-2 bg-slate-50 rounded-xl">
              <p className="text-sm font-semibold text-slate-800">{user.name} {user.surname}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className={mobileLinkClass('/dashboard')}>{t('nav.home')}</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className={mobileLinkClass('/events')}>{t('nav.events')}</Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className={mobileLinkClass('/profile')}>{t('nav.profile')}</Link>
            {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin')}>{t('nav.admin')}</Link>}
            
            <button
              onClick={() => { setIsOpen(false); handleLogout(); }}
              className="w-full text-left block text-base font-medium text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg transition-colors mt-4"
            >
              {t('nav.logout')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
