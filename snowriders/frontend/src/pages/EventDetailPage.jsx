import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { getEventTheme, extractLocationLink, getLocationTitle } from '../utils/theme';

export default function EventDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Evaluation state
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [evalLoading, setEvalLoading] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`).then(res => { 
      setEvent(res.data.event); 
      setLoading(false); 
    }).catch(() => navigate('/events'));
  }, [id, navigate]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') navigate('/events');
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [navigate]);

  const handleRegister = async () => {
    setActionLoading(true); setMessage({ type: '', text: '' });
    try {
      await api.post(`/events/${id}/register`);
      setEvent(prev => ({ ...prev, isRegistered: true, registeredUsers: [...(prev.registeredUsers || []), 'me'] }));
      setMessage({ type: 'success', text: t('event_detail.success_registered') });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || t('event_detail.errors.failed_register') });
    } finally { setActionLoading(false); }
  };

  const handleCancel = async () => {
    setCancelConfirm(false);
    setActionLoading(true);
    try {
      await api.delete(`/events/${id}/register`);
      setEvent(prev => ({ ...prev, isRegistered: false, registeredUsers: (prev.registeredUsers || []).slice(0, -1) }));
      setMessage({ type: 'info', text: t('event_detail.success_cancelled') });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || t('event_detail.errors.failed_cancel') });
    } finally { setActionLoading(false); }
  };

  const handleEvaluate = async () => {
    if (rating < 1 || rating > 5) return;
    setEvalLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.post(`/events/${id}/evaluate`, { rating, comment });
      setEvent(prev => ({ ...prev, userRating: rating, userComment: comment }));
      setShowEvalModal(false);
      setMessage({ type: 'success', text: res.data.message || t('event_detail.eval_success') });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || t('event_detail.eval_error') });
    } finally { setEvalLoading(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('dashboard.loading')}</p>
    </div>
  );
  if (!event) return (
    <div className="flex flex-col items-center justify-center py-40">
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('events.not_found')}</p>
    </div>
  );

  const registered = event.registeredUsers?.length ?? 0;
  const theme = getEventTheme(id);
  const mapLink = extractLocationLink(event.location);
  const locationTitle = getLocationTitle(event.location);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 px-4">
      {/* Back Navigation */}
      <button 
        onClick={() => navigate('/events')} 
        className="group flex items-center gap-4 text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-[0.4em]"
      >
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:translate-x-[-4px] transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        {t('event_detail.back')}
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden">
        
        {/* Header Section with Dynamic Gradient */}
        <div className={`p-12 lg:p-20 relative overflow-hidden bg-gradient-to-br ${theme.bg} text-white`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex flex-wrap gap-4 mb-8">
              {event.isPast ? (
                <span className="bg-black/20 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">{t('events.completed')}</span>
              ) : event.isRegistrationClosed ? (
                <span className="bg-[#212349]/40 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">{t('event_detail.registration_closed')}</span>
              ) : event.isFull ? (
                <span className="bg-red-500/40 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">{t('event_detail.full')}</span>
              ) : (
                <span className="bg-emerald-500/40 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">{t('dashboard.status.open')}</span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none uppercase drop-shadow-2xl mb-12">{event.title}</h1>
            
            <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="text-[13px] font-black uppercase tracking-widest">{new Date(event.date).toLocaleDateString()}</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-[13px] font-black uppercase tracking-widest">{event.startTime || '20:00'} - {event.endTime || '21:00'}</span>
               </div>
            </div>
          </div>
          
          <button onClick={() => navigate('/events')} className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-md group">
             <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content Section */}
        <div className="p-10 lg:p-16 space-y-12 bg-white">
          
          {/* Metrics List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location Card */}
            {mapLink ? (
              <a 
                href={mapLink}
                target="_blank" 
                rel="noopener noreferrer" 
                className={`bg-white rounded-[2.5rem] p-8 border-2 ${theme.border.replace('/20', '/60')} flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group cursor-pointer active:scale-95`}
              >
                <div className={`w-16 h-16 rounded-2xl ${theme.lightBg} flex items-center justify-center ${theme.text} shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-[12px] font-black ${theme.text} uppercase tracking-widest leading-none mb-3 opacity-70`}>{t('event_detail.location')}</p>
                    <h3 className={`text-lg md:text-2xl font-black ${theme.text} tracking-tight uppercase leading-tight break-words`}>
                      {getLocationTitle(event.location) || t('event_detail.open_map')}
                    </h3>
                </div>
              </a>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex items-center gap-6 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">{t('event_detail.location')}</p>
                    <h3 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight break-words">
                      {event.location || 'Erciyes'}
                    </h3>
                </div>
              </div>
            )}

            {/* Registration Progress */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex items-center gap-6 shadow-sm">
              <div className={`w-16 h-16 rounded-2xl ${theme.lightBg} flex items-center justify-center ${theme.text}`}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className={`text-[12px] font-black ${theme.text} uppercase tracking-widest leading-none mb-3 opacity-70`}>{t('event_detail.capacity')}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black ${theme.text} tracking-tighter`}>{event.registeredUsers?.length || 0}</span>
                  <span className="text-slate-300 font-bold">/</span>
                  <span className="text-slate-400 font-bold">{event.capacity}</span>
                </div>
              </div>
            </div>

            {/* Registration Deadline Check (Today) */}
            <div className={`bg-white rounded-[2.5rem] p-8 border border-slate-100 flex items-center gap-6 shadow-sm`}>
              <div className={`w-16 h-16 rounded-2xl ${theme.lightBg} flex items-center justify-center ${theme.text}`}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className={`text-[12px] font-black ${theme.text} uppercase tracking-widest leading-none mb-3 opacity-70`}>{t('event_detail.deadline')}</p>
                <h3 className={`text-2xl font-black ${theme.text} tracking-tight uppercase leading-none`}>
                  {event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : t('event_detail.not_specified')}
                </h3>
              </div>
            </div>
          </div>



          {/* Description Section */}
          <div className="space-y-8 bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100/50 mb-12">
             <div className="flex items-center gap-4">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-0.5">{t('event_detail.description')}</h2>
                <div className="h-px bg-slate-200 flex-1"></div>
             </div>
              <p className="text-slate-800 text-[16px] leading-relaxed font-bold whitespace-pre-wrap selection:bg-[#00AEEF]/20">
                {event.description}
              </p>
          </div>

          {/* Messages */}
          {message.text && (
            <div className={`p-8 rounded-3xl text-[11px] font-black uppercase tracking-wider border transition-all animate-in slide-in-from-top-4 duration-500 shadow-sm mb-12 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              message.type === 'error' ? 'bg-red-50 text-red-500 border-red-100' :
              'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              <div className="flex items-center gap-4">
                 <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                 {message.text}
              </div>
            </div>
          )}

          {/* Actions */}
          {event.isPast ? (
            event.isRegistered && (
              <div className="pt-6">
                {event.userRating ? (
                  <div className="bg-emerald-50/50 rounded-[2.5rem] p-8 border border-emerald-100 flex flex-col items-center justify-center text-center gap-4">
                    <p className="text-emerald-600 font-black text-sm uppercase tracking-widest">{t('event_detail.evaluated_event')}</p>
                    <div className="flex items-center gap-1 text-emerald-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-6 h-6 ${i < event.userRating ? 'fill-current' : 'text-emerald-200 fill-current opacity-30'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowEvalModal(true)}
                    className="w-full py-8 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-black tracking-widest rounded-[2.5rem] transition-all uppercase text-[12px] border border-blue-100 shadow-sm"
                  >
                    {t('event_detail.eval_submit')}
                  </button>
                )}
              </div>
            )
          ) : (
            <div className="pt-6">
              {event.isRegistered ? (
                cancelConfirm ? (
                  <div className="bg-slate-50/50 rounded-[2.5rem] p-12 border border-slate-100 text-center space-y-10 animate-in zoom-in-95 duration-500 shadow-inner">
                    <p className="text-slate-800 font-black text-xl uppercase tracking-tight">{t('event_detail.cancel_confirm')}</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <button onClick={handleCancel} disabled={actionLoading}
                        className="flex-1 py-5 bg-red-500 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[11px] shadow-lg shadow-red-500/20 hover:bg-red-600 hover:scale-[1.02]">
                        {actionLoading ? t('event_detail.processing') : t('event_detail.cancel_yes')}
                      </button>
                      <button onClick={() => setCancelConfirm(false)} disabled={actionLoading}
                        className="flex-1 py-5 bg-white text-slate-400 font-black rounded-2xl border border-slate-100 transition-all uppercase tracking-widest text-[11px] hover:border-slate-200">
                        {t('event_detail.cancel_no')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setCancelConfirm(true)} 
                    disabled={actionLoading}
                    className="w-full py-8 bg-white text-slate-300 hover:text-red-500 hover:bg-red-50/50 font-black tracking-widest rounded-[2rem] transition-all uppercase text-[10px] border border-slate-100 group shadow-sm"
                  >
                    {actionLoading ? t('event_detail.processing') : t('event_detail.cancel_action')}
                  </button>
                )
              ) : (
                <button 
                  onClick={handleRegister} 
                  disabled={actionLoading || event.isFull || event.isRegistrationClosed}
                  className={`w-full py-10 text-white font-black tracking-[0.4em] rounded-[2.5rem] transition-all transform hover:scale-[1.01] uppercase text-xl shadow-2xl relative overflow-hidden group
                    ${actionLoading || event.isFull || event.isRegistrationClosed 
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
                      : 'bg-[#212349] hover:bg-[#2c2f61] shadow-[#212349]/20'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {actionLoading ? t('event_detail.processing') : event.isRegistrationClosed ? t('event_detail.registration_closed') : event.isFull ? t('event_detail.full') : t('event_detail.register_now')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Evaluation Modal */}
      {showEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">{t('event_detail.eval_modal_title')}</h3>
              <button onClick={() => setShowEvalModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('event_detail.eval_rating')}</label>
                <div className="flex items-center gap-2 justify-center py-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-all hover:scale-110 active:scale-95 ${rating >= star ? 'text-yellow-400' : 'text-slate-200'}`}
                    >
                      <svg className="w-12 h-12 fill-current drop-shadow-sm" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('event_detail.eval_comment')}</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none font-medium h-32 break-words whitespace-pre-wrap"
                  maxLength={1000}
                ></textarea>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-4">
              <button 
                onClick={() => setShowEvalModal(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm"
              >
                {t('event_detail.eval_cancel')}
              </button>
              <button 
                onClick={handleEvaluate}
                disabled={rating === 0 || evalLoading}
                className={`px-8 py-3 rounded-xl font-black text-white uppercase tracking-widest text-xs transition-all shadow-md ${rating === 0 || evalLoading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'}`}
              >
                {evalLoading ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
