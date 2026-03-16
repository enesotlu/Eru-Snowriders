import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';


export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', surname: '', department: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // AuthContext'ten hemen goster, API gelince createdAt dahil gercek veriyi yaz
    if (user) {
      setProfile(prev => prev || user); // sadece ilk kez set et (createdAt yoksa)
      setForm({ name: user.name || '', surname: user.surname || '', department: user.department || '' });
    }
    api.get('/users/me').then(res => {
      const u = res.data.user;
      setProfile(u); // API'den tam veri (createdAt dahil)
      setForm({ name: u.name, surname: u.surname, department: u.department });
    }).catch(err => {
      console.error(err);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.surname.trim()) {
      setMessage({ type: 'error', text: 'İsim ve soyisim boş bırakılamaz' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.put('/users/me', form);
      setProfile(data.user);
      updateUser({ name: data.user.name, surname: data.user.surname, department: data.user.department });
      setMessage({ type: 'success', text: t('profile.success') });
      setTimeout(() => setEditing(false), 500);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || t('profile.errors.failed') });
    } finally { setLoading(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const { data } = await api.post('/users/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(data.user);
      updateUser({ profileImage: data.user.profileImage });
      setMessage({ type: 'success', text: 'Profil fotoğrafı güncellendi' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Fotoğraf yüklenemedi' });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name, surname) => {
    if (!name && !surname) return '👤';
    return `${name?.charAt(0) || ''}${surname?.charAt(0) || ''}`.toUpperCase();
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('dashboard.loading')}</p>
      </div>
    );
  }

  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005';

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Profile Header section */}
      <section className="saas-card rounded-[3rem] bg-white border-slate-100 overflow-hidden shadow-sm relative">
        <div className="h-44 bg-blue-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-transparent"></div>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/5 blur-3xl rounded-full"></div>
        </div>
        
        <div className="px-10 pb-12 flex flex-col md:flex-row items-end gap-10 -mt-20 relative z-10">
          <div className="relative group/avatar">
            <div className="w-44 h-44 rounded-[2.5rem] bg-slate-100 p-1 shadow-xl border border-slate-200 overflow-hidden">
              <div className="w-full h-full rounded-[2.3rem] bg-white flex items-center justify-center text-blue-600 text-5xl font-black shadow-inner border border-slate-100 overflow-hidden">
                {profile.profileImage ? (
                  <img src={`${backendUrl}${profile.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials(profile.name, profile.surname)
                )}
              </div>
            </div>
            
            <label className="absolute bottom-2 right-2 w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-90 transition-all border-4 border-white group-hover/avatar:bg-blue-600">
               <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={loading} />
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </label>
          </div>
          
          <div className="flex-1 text-center md:text-left pt-6 md:pt-0">
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-4 uppercase">
              {profile.name} {profile.surname}
            </h1>
            <p className="text-slate-500 font-bold text-[13px] tracking-tight">{profile.email}</p>
          </div>

          {!editing && (
            <button 
              onClick={() => { setEditing(true); setMessage({ type: '', text: '' }); }}
              className="px-8 py-4 rounded-2xl bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-4 group mb-2"
            >
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              {t('profile.editButton')}
            </button>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Statistics / Sidebar */}
         <aside className="space-y-6">
            <div className="saas-card p-10 rounded-[3rem] bg-white border border-slate-100 space-y-10">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] border-b border-slate-100 pb-6 leading-none">{t('profile.membershipInfo')}</h3>
               <div className="space-y-8">
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('profile.joinDate')}</p>
                     <p className="text-[15px] font-black text-slate-800 mt-3 uppercase tracking-tight">
                        {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : '...'}
                     </p>
                  </div>
                  <div className="pt-8 border-t border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('profile.membershipType')}</p>
                     <p className="text-[15px] font-black text-blue-600 mt-2 uppercase tracking-[0.1em]">{t('profile.activeMember')}</p>
                  </div>
               </div>
            </div>
         </aside>

         {/* Main Content Area */}
         <div className="lg:col-span-2">
            <div className="saas-card rounded-[3rem] p-12 min-h-[440px] bg-white border border-slate-100 shadow-sm relative overflow-hidden">
               <h2 className="text-xl font-black text-slate-800 tracking-tighter mb-10 border-b border-slate-100 pb-8 leading-none uppercase">
                 {editing ? t('profile.updateTitle') : t('profile.personalInfo')}
               </h2>

              {message.text && (
                <div className={`mb-10 p-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] border transition-all animate-in slide-in-from-top-4 duration-700 ${
                  message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10 shadow-2xl shadow-emerald-500/10' : 'bg-red-500/10 text-red-500 border-red-500/10 shadow-2xl shadow-red-500/10'
                }`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                      {message.text}
                   </div>
                </div>
              )}

              {editing ? (
                <form onSubmit={handleSave} className="space-y-10">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="space-y-4">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">{t('register.name')}</label>
                       <input 
                         value={form.name} 
                         onChange={e => setForm({...form, name: e.target.value})}
                         className="w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 font-black text-[13px] focus:outline-none focus:border-blue-500 transition-all uppercase tracking-tight" 
                       />
                     </div>
                     <div className="space-y-4">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">{t('register.surname')}</label>
                       <input 
                         value={form.surname} 
                         onChange={e => setForm({...form, surname: e.target.value})}
                         className="w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 font-black text-[13px] focus:outline-none focus:border-blue-500 transition-all uppercase tracking-tight" 
                       />
                    </div>
                  </div>

                   <div className="space-y-4">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">{t('register.department')}</label>
                     <input 
                       value={form.department} 
                       onChange={e => setForm({...form, department: e.target.value})}
                       placeholder={t('register.deptSelect')}
                       className="w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 font-black text-[13px] focus:outline-none focus:border-blue-500 transition-all uppercase tracking-tight"
                     />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 pt-10">
                     <button 
                       type="submit" 
                       disabled={loading}
                       className="px-10 py-5 rounded-2xl bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all flex-1"
                     >
                       {loading ? t('profile.updating') : t('profile.saveButton')}
                     </button>
                     <button 
                       type="button" 
                       onClick={() => setEditing(false)}
                       className="px-10 py-5 rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all text-[10px] font-black uppercase tracking-[0.3em] border border-slate-100 flex-1"
                     >
                       {t('profile.cancelButton')}
                     </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                   {[
                     { label: t('register.studentNumber'), val: profile.studentNumber, icon: '🆔' },
                     { label: t('register.department'), val: profile.department, icon: '🎓' },
                     { label: t('profile.email'), val: profile.email, icon: '✉️' },
                     { label: t('profile.phone'), val: profile.phone || t('profile.notSet'), icon: '📱' },
                   ].map((field) => (
                     <div key={field.label} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-blue-500/20 shadow-sm transition-all group scale-100 hover:scale-[1.02] duration-500">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 leading-none">{field.label}</p>
                        <p className={`text-[16px] font-black text-slate-800 truncate tracking-tight ${field.label === t('profile.email') ? '' : 'uppercase'} leading-none mt-2`}>{field.val}</p>
                     </div>
                  ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
