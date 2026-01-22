
import React, { useState, useEffect } from 'react';
import { User, PrayerRequest, SiteConfig } from '../types';
import { Send, Heart, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrayerRequests: React.FC<{ user: User | null, config: SiteConfig }> = ({ user, config }) => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [newRequest, setNewRequest] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('jcbc_prayers');
    if (saved) setRequests(JSON.parse(saved));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newRequest.trim()) return;
    const req: PrayerRequest = { id: Date.now().toString(), userId: user.id, userName: user.name, request: newRequest, timestamp: Date.now(), likes: 0 };
    const updated = [req, ...requests];
    setRequests(updated);
    localStorage.setItem('jcbc_prayers', JSON.stringify(updated));
    setNewRequest('');
  };

  const toggleLike = (id: string) => {
    const updated = requests.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r);
    setRequests(updated);
    localStorage.setItem('jcbc_prayers', JSON.stringify(updated));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-16 pb-20">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 space-y-8">
        <div className="space-y-3">
          <h2 className="text-5xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">{config.prayerTitle}</h2>
          <p className="text-slate-500 text-lg font-medium italic">"{config.prayerSubtitle}"</p>
        </div>
        
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <textarea 
              value={newRequest} 
              onChange={(e) => setNewRequest(e.target.value)} 
              placeholder={config.prayerPlaceholder} 
              className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 outline-none min-h-[160px] font-medium shadow-inner transition-all" 
            />
            <button type="submit" className="flex items-center justify-center space-x-3 bg-blue-900 text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-800 transition-all shadow-xl active:scale-95 w-full sm:w-auto">
              <span>Send Request</span>
              <Send className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="p-12 bg-slate-50 rounded-[3rem] text-center space-y-6">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] italic">Access Denied: Authentication Required to releasing prayer requests.</p>
            <Link to="/login" className="inline-block bg-blue-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg">Login to Portal</Link>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black text-blue-900 uppercase italic tracking-widest ml-4">{config.prayerFeedTitle}</h3>
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
               <p className="text-slate-300 font-black uppercase tracking-widest text-[10px] italic">Feed is currently silent. Be the first to reach out.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-4 group hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-900 border border-blue-100 shadow-inner">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <span className="font-black text-blue-900 uppercase tracking-widest text-xs">{req.userName}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(req.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-lg text-slate-600 font-medium italic leading-relaxed">"{req.request}"</p>
                <button onClick={() => toggleLike(req.id)} className="flex items-center space-x-2 text-blue-600 hover:text-blue-900 transition-colors font-black uppercase tracking-widest text-[9px] bg-blue-50/50 px-4 py-2 rounded-full border border-blue-50">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>I am Interceding ({req.likes})</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {config.prayerCustomHtml && (
        <div className="pt-20 border-t border-slate-100" dangerouslySetInnerHTML={{ __html: config.prayerCustomHtml }} />
      )}
    </div>
  );
};

export default PrayerRequests;
