import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const emptyForm = { title: '', description: '', date: '', startTime: '', endTime: '', registrationDeadline: '', location: '', capacity: '' };

export default function AdminPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('events'); 
  
  // Events State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showParticipants, setShowParticipants] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [parsLoading, setParsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Members State
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const fetchEvents = () =>
    api.get('/admin/events')
      .then(res => { setEvents(res.data.events); setLoading(false); })
      .catch(() => { setLoading(false); });

  const fetchMembers = () => {
    setMembersLoading(true);
    api.get('/admin/users')
      .then(res => { setMembers(res.data.users); setMembersLoading(false); })
      .catch(() => { setMembersLoading(false); });
  };

  useEffect(() => { 
    if (activeTab === 'events') fetchEvents();
    if (activeTab === 'members' && members.length === 0) fetchMembers();
  }, [activeTab]);

  const validate = () => {
    const e = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!form.title.trim()) e.title = 'Zorunlu';
    if (!form.description.trim()) e.description = 'Zorunlu';
    
    if (!form.date) e.date = 'Zorunlu';
    else if (new Date(form.date) < today) e.date = 'Geçmiş bir tarih seçilemez';

    if (!form.registrationDeadline) e.registrationDeadline = 'Zorunlu';
    else {
      const deadline = new Date(form.registrationDeadline);
      if (deadline < today) e.registrationDeadline = 'Son kayıt geçmiş bir tarih olamaz';
      else if (form.date && deadline > new Date(form.date)) e.registrationDeadline = 'Son kayıt, etkinlikten sonra olamaz';
    }

    if (!form.capacity || form.capacity < 1 || form.capacity > 500) e.capacity = '1-500 arasında olmalı';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true); setMessage({ type: '', text: '' });
    try {
      if (editId) {
        await api.put(`/admin/events/${editId}`, { ...form, capacity: Number(form.capacity) });
        setMessage({ type: 'success', text: 'Etkinlik başarıyla güncellendi.' });
      } else {
        await api.post('/admin/events', { ...form, capacity: Number(form.capacity) });
        setMessage({ type: 'success', text: 'Yeni etkinlik oluşturuldu.' });
      }
      setForm(emptyForm); setEditId(null); setErrors({});
      fetchEvents();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Bir hata oluştu' });
    } finally { setSubmitting(false); }
  };

  const confirmDelete = async (id) => {
    try {
      await api.delete(`/admin/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
      setMessage({ type: 'success', text: 'Etkinlik silindi.' });
    } catch { 
      setMessage({ type: 'error', text: 'Silme işlemi başarısız.' }); 
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const handleEdit = (event) => {
    setEditId(event._id);
    setForm({
      title: event.title, description: event.description,
      date: event.date?.slice(0, 10),
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      registrationDeadline: event.registrationDeadline?.slice(0, 10) || '',
      location: event.location || '', capacity: event.capacity
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadParticipants = async (event) => {
    setShowParticipants(event._id); setParsLoading(true); setParticipants([]);
    try {
      const res = await api.get(`/admin/events/${event._id}/registrations`);
      setParticipants(res.data.users);
    } finally { setParsLoading(false); }
  };

  const downloadCsv = async (event) => {
    try {
      const res = await api.get(`/admin/events/${event._id}/registrations/csv`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event.title}_katilimcilar.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage({ type: 'error', text: 'CSV indirilemedi.' });
    }
  };

  const inputClass = (field) =>
    `w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:border-blue-400 transition-all ${errors[field] ? 'border-red-200 bg-red-50/30' : ''}`;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">{t('admin.title')}</h1>
          <p className="text-slate-500 text-sm mt-2 max-w-lg font-bold">
             {t('admin.subtitle')}
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => { setActiveTab('events'); setMessage({ type: '', text: '' }); }}
            className={`px-8 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
            {t('admin.tabs.events')}
          </button>
          <button 
            onClick={() => { setActiveTab('members'); setMessage({ type: '', text: '' }); }}
            className={`px-8 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === 'members' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
            {t('admin.tabs.members')}
          </button>
        </div>
      </section>

      {message.text && (
        <div className={`p-6 rounded-2xl text-[11px] font-bold uppercase tracking-widest border transition-all animate-in slide-in-from-top-4 duration-500 ${
          message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'
        }`}>{message.text}</div>
      )}

      {activeTab === 'events' ? (
        <div className="space-y-12">
          
          {/* Create / Edit Form */}
          <section className="saas-card rounded-[2.5rem] p-10 bg-white border border-slate-100 shadow-sm relative overflow-hidden">
            <h2 className="text-lg font-black text-slate-800 mb-8 border-b border-slate-100 pb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              {editId ? t('admin.form.update') : t('admin.form.create')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin.form.title')}</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass('title')} placeholder={t('admin.form.placeholders.title')} />
                  {errors.title && <p className="text-red-500 font-bold text-[10px] mt-2 italic">{errors.title}</p>}
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin.form.location')}</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputClass('location')} placeholder={t('admin.form.placeholders.location')} />
                  <p className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-wider opacity-60 italic">
                    💡 İsterseniz Google Haritalar linki de ekleyebilirsiniz.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin.form.description')}</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass('description')} placeholder={t('admin.form.placeholders.desc')} />
                {errors.description && <p className="text-red-500 font-bold text-[10px] mt-2 italic">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin.form.date')}</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => setForm({...form, date: e.target.value})} className={inputClass('date')} />
                  {errors.date && <p className="text-red-500 font-bold text-[10px] mt-2 italic">{errors.date}</p>}
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin.form.deadline')}</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]} value={form.registrationDeadline} onChange={e => setForm({...form, registrationDeadline: e.target.value})} className={inputClass('registrationDeadline')} />
                  {errors.registrationDeadline && <p className="text-red-500 font-bold text-[10px] mt-2 italic">{errors.registrationDeadline}</p>}
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin.form.start')}</label>
                  <input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} className={inputClass('startTime')} />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin.form.end')}</label>
                  <input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} className={inputClass('endTime')} />
                </div>
              </div>

              <div className="space-y-2.5 max-w-xs">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin.form.capacity')}</label>
                <input type="number" min="1" max="500" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} className={inputClass('capacity')} placeholder="50" />
                {errors.capacity && <p className="text-red-500 font-bold text-[10px] mt-2 italic">{errors.capacity}</p>}
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button type="submit" disabled={submitting}
                  className="btn-primary flex-1 py-4 text-xs font-bold leading-none shadow-blue-500/10 active:scale-95 disabled:opacity-50">
                   {submitting ? t('admin.form.processing') : editId ? t('admin.form.submitUpdate') : t('admin.form.submitCreate')}
                </button>
                {editId && (
                  <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); setErrors({}); }}
                    className="btn-secondary flex-1 py-4 text-xs font-bold leading-none">
                    {t('admin.form.cancel')}
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* List of Events */}
          <section className="saas-card rounded-[2.5rem] bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">{t('admin.list.active')} ({events.length})</h2>
              <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
            </div>
            
            {loading ? (
              <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">{t('admin.list.loading')}</div>
            ) : events.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">{t('admin.list.empty')}</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {events.map(event => (
                  <div key={event._id} className="p-8 hover:bg-slate-50/50 transition-all group">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-slate-800 mb-4 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{event.title}</h3>
                        <div className="flex flex-wrap gap-3">
                          <span className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                             📅 {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                             👥 {event.registeredUsers?.length || 0} / {event.capacity} Katılımcı
                          </span>
                           <span className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 truncate max-w-[200px]">
                             📍 {event.location || 'Konum Belirtilmedi'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap items-center">
                        <button onClick={() => loadParticipants(event)}
                          className="px-5 py-3 rounded-xl bg-slate-50 text-slate-700 font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-white hover:shadow-sm transition-all active:scale-95">
                          {t('admin.list.participants')}
                        </button>
                        <button onClick={() => downloadCsv(event)}
                          className="px-5 py-3 rounded-xl bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest border border-blue-200 hover:bg-white hover:shadow-sm transition-all active:scale-95">
                          {t('admin.list.csv')}
                        </button>
                        <button onClick={() => handleEdit(event)}
                          className="px-5 py-3 rounded-xl bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:text-blue-600 transition-all active:scale-95">
                          {t('admin.list.edit')}
                        </button>
                        
                        {deleteConfirmId === event._id ? (
                          <div className="flex items-center gap-2 bg-red-50 p-1.5 rounded-2xl border border-red-100 animate-in zoom-in duration-200">
                            <span className="text-[10px] font-black text-red-600 px-3 uppercase tracking-widest">{t('admin.list.confirm')}</span>
                            <button onClick={() => confirmDelete(event._id)} className="px-4 py-2 bg-red-600 text-white font-black rounded-xl text-[10px] uppercase shadow-sm">{t('admin.list.yes')}</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 bg-white text-slate-500 font-black rounded-xl text-[10px] uppercase border border-slate-200">{t('admin.list.no')}</button>
                          </div>
                        ) : (
                          <button onClick={() => handleDelete(event._id)}
                            className="px-5 py-3 rounded-xl bg-red-50 text-red-500 font-black text-[10px] uppercase tracking-widest border border-red-200 hover:bg-red-500 hover:text-white transition-all active:scale-95">
                            {t('admin.list.delete')}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expandable Participants Table */}
                    {showParticipants === event._id && (
                      <div className="mt-10 p-8 bg-slate-50 rounded-3xl border border-slate-200 animate-in slide-in-from-top-4 duration-500 shadow-inner">
                        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-5">
                          <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">{t('admin.participants.title')} ({participants.length})</h4>
                          <button onClick={() => setShowParticipants(null)} className="text-[10px] font-black text-slate-500 hover:text-red-500 transition-all uppercase tracking-widest">{t('admin.participants.close')} ✕</button>
                        </div>
                        {parsLoading ? <p className="text-[11px] font-black text-slate-500 uppercase animate-pulse">{t('admin.participants.loading')}</p> :
                          participants.length === 0 ? <p className="text-[11px] font-black text-slate-500 uppercase">{t('admin.participants.empty')}</p> : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                <thead className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                  <tr>
                                    <th className="pb-4 px-4">{t('admin.participants.table.name')}</th>
                                    <th className="pb-4 px-4">{t('admin.participants.table.id')}</th>
                                    <th className="pb-4 px-4">{t('admin.participants.table.phone')}</th>
                                    <th className="pb-4 px-4">{t('admin.participants.table.dept')}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {participants.map(p => (
                                    <tr key={p._id} className="hover:bg-white transition-all">
                                      <td className="py-4 px-4 text-slate-800 font-black text-sm tracking-tight">{p.name} {p.surname}</td>
                                      <td className="py-4 px-4 text-slate-600 text-[11px] font-black tracking-widest">{p.studentNumber}</td>
                                      <td className="py-4 px-4 text-slate-600 text-[11px] font-black tracking-widest">{p.phone || '-'}</td>
                                      <td className="py-4 px-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">{p.department}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )
                        }
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        /* Members Tab */
        <section className="saas-card rounded-[2.5rem] bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800">{t('admin.members.title')} ({members.length})</h2>
            <button onClick={fetchMembers} className="px-6 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest border border-blue-200 hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm">{t('admin.members.refresh')} ⟳</button>
          </div>
          
          {membersLoading ? (
            <div className="text-center py-24 text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">{t('admin.members.loading')}</div>
          ) : members.length === 0 ? (
            <div className="text-center py-24 text-slate-400 font-bold uppercase tracking-widest text-xs">{t('admin.members.empty')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-200 font-black">
                  <tr>
                    <th className="px-10 py-6">{t('admin.members.table.name')}</th>
                    <th className="px-10 py-6">{t('admin.members.table.id')}</th>
                    <th className="px-10 py-6">{t('admin.members.table.email')}</th>
                    <th className="px-10 py-6">{t('admin.members.table.dept')}</th>
                    <th className="px-10 py-6">{t('admin.members.table.phone')}</th>
                    <th className="px-10 py-6 text-right">{t('admin.members.table.date')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {members.map(user => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-all border-b border-slate-50">
                      <td className="px-10 py-6 text-slate-800 font-black text-sm tracking-tight">{user.name} {user.surname}</td>
                      <td className="px-10 py-6 text-slate-600 text-[11px] font-black tracking-widest">{user.studentNumber}</td>
                      <td className="px-10 py-6 text-blue-600 text-[11px] font-black">{user.email}</td>
                      <td className="px-10 py-6 text-slate-500 text-[10px] font-black uppercase tracking-widest">{user.department}</td>
                      <td className="px-10 py-6 text-slate-600 text-[11px] font-black tracking-widest">
                        {user.phone || '-'}
                      </td>
                      <td className="px-10 py-6 text-right text-slate-500 text-[10px] font-black tracking-widest uppercase">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
