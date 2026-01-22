
import React, { useState, useEffect } from 'react';
import { User, SiteConfig, Announcement, AffiliateLink } from '../types';
import { Bell, Calendar, User as UserIcon, ShieldCheck, Info, Tag, ExternalLink } from 'lucide-react';

interface Props {
  user: User | null;
  config: SiteConfig;
}

const Announcements: React.FC<Props> = ({ config }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateLink[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('jcbc_announcements');
    if (saved) {
      const parsed: Announcement[] = JSON.parse(saved);
      const sorted = parsed.sort((a, b) => {
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
        return b.timestamp - a.timestamp;
      });
      setAnnouncements(sorted);
    }
    setAffiliates(JSON.parse(localStorage.getItem('jcbc_affiliate_links') || '[]'));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-100 text-blue-900 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
          <Bell className="w-4 h-4" />
          <span>Kingdom Pulse Feed</span>
        </div>
        <h2 className="text-7xl md:text-8xl font-black text-blue-900 tracking-tighter uppercase italic leading-none">{config.announcementsTitle}</h2>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto italic opacity-70">{config.announcementsSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          {announcements.length === 0 ? (
            <div className="bg-white p-24 rounded-[4rem] border-4 border-dashed border-slate-100 text-center space-y-6 shadow-sm">
              <Info className="w-16 h-16 text-slate-200 mx-auto" />
              <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs italic">Awaiting bulletins on this Remnant frequency...</p>
            </div>
          ) : (
            announcements.map((ann) => (
              <div 
                key={ann.id} 
                className={`bg-white rounded-[4rem] shadow-2xl border-l-[16px] overflow-hidden group hover:shadow-blue-900/10 transition-all ${ann.priority === 'urgent' ? 'border-red-600' : 'border-blue-900'}`}
              >
                {ann.heroImage && (
                  <div className="w-full h-[450px] relative overflow-hidden">
                    <img src={ann.heroImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Hero Release" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                )}
                <div className="p-12 md:p-20 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-12">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-4">
                        {ann.priority === 'urgent' && (
                          <span className="bg-red-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse flex items-center gap-2">
                             <div className="w-2 h-2 bg-white rounded-full" />
                             Urgent Proclamation
                          </span>
                        )}
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                          <Calendar className="w-5 h-5" />
                          <span>{new Date(ann.timestamp).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
                        </span>
                      </div>
                      <h3 className="text-6xl md:text-7xl font-black text-blue-900 tracking-tighter uppercase italic leading-[0.9] group-hover:text-blue-800 transition-colors">{ann.title}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-slate-400 bg-slate-50 px-8 py-4 rounded-3xl border border-slate-100 shadow-inner">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                        <UserIcon className="w-6 h-6 text-blue-900" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-blue-900/60">{ann.author}</span>
                    </div>
                  </div>
                  <div className="prose prose-slate max-w-none prose-headings:font-bebas prose-headings:text-5xl prose-headings:uppercase prose-p:text-xl prose-p:leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: ann.content }} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="space-y-12">
          <div className="bg-blue-900 p-12 rounded-[3rem] text-white shadow-2xl space-y-10 sticky top-40">
            <div className="space-y-3">
              <h4 className="font-bebas text-3xl tracking-widest text-blue-400">Bulletin Support</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200/50">Kingdom Authorized Resources</p>
            </div>
            <div className="space-y-4">
              {affiliates.filter(l => l.isActive && l.placement === 'bulletin_sidebar').map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="font-bebas text-2xl tracking-widest text-white">{link.label}</span>
                    <ExternalLink className="w-5 h-5 text-blue-400 group-hover:translate-x-2 transition-transform" />
                  </div>
                </a>
              ))}
              {affiliates.filter(l => l.isActive && l.placement === 'bulletin_sidebar').length === 0 && (
                <div className="p-10 border border-white/5 rounded-3xl text-center">
                   <Tag className="w-8 h-8 text-white/10 mx-auto mb-4" />
                   <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">No Active Placements</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Announcements;
