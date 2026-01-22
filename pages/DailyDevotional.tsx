
import React, { useState, useEffect } from 'react';
import { User, Devotional, SiteConfig } from '../types';
// Added ShieldCheck to the imports below
import { Calendar, ChevronDown, ChevronUp, Flame, Video, Edit3, Facebook, Twitter, Share2, Globe, Clock, User as UserIcon, ShieldCheck } from 'lucide-react';
import YouTubePlayer from '../components/YouTubePlayer';
import { useNavigate } from 'react-router-dom';

interface DailyDevotionalProps {
  user: User | null;
  config: SiteConfig;
}

const DailyDevotional: React.FC<DailyDevotionalProps> = ({ config, user }) => {
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin' || user?.role === 'pastor' || user?.role === 'staff';
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('jcbc_devotionals');
    if (saved) {
      try {
        const parsed: Devotional[] = JSON.parse(saved);
        // Sort by date descending for historical priority
        parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setDevotionals(parsed);
      } catch (e) {
        console.error("Failed to parse devotionals node", e);
      }
    }
  }, []);

  return (
    <div className="space-y-20 max-w-5xl mx-auto pb-40 animate-in fade-in duration-1000">
      {/* Dynamic Header Section */}
      <div className="text-center space-y-8 relative">
        <div className="inline-flex items-center space-x-3 px-8 py-3 bg-red-100 text-red-600 rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-sm animate-fade-in">
          <Flame className="w-5 h-5 fill-current" />
          <span>{config.devotionalBannerText}</span>
          {isAdmin && (
            <button onClick={() => navigate('/admin?tab=devotionals')} className="ml-3 p-1.5 hover:bg-red-200 rounded-full transition-colors" title="Launch Rhema Architect">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="space-y-4">
          <h2 className="text-7xl md:text-9xl font-black text-blue-900 tracking-tighter uppercase italic leading-none drop-shadow-sm">{config.devotionalPageTitle}</h2>
          <p className="text-slate-500 text-2xl md:text-3xl font-medium italic opacity-80 max-w-3xl mx-auto leading-relaxed">"{config.devotionalPageSubtitle}"</p>
        </div>
        <div className="absolute -top-10 -right-10 opacity-5 grayscale pointer-events-none rotate-12"><Flame className="w-64 h-64" /></div>
      </div>

      {/* Devotional Entry Grid */}
      <div className="space-y-24">
        {devotionals.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[5rem] border-4 border-dashed border-slate-100 flex flex-col items-center space-y-8 shadow-inner animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-slate-100 shadow-sm"><Video className="w-12 h-12" /></div>
             <div className="space-y-3">
                <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-xs italic">Frequency Standby...</p>
                <p className="text-slate-400 font-medium text-lg italic opacity-60">The Scribes are indexing the latest Rhema word. Check back for the broadcast.</p>
             </div>
             {isAdmin && (
               <button onClick={() => navigate('/admin?tab=devotionals')} className="text-blue-900 font-black uppercase text-[10px] tracking-widest bg-blue-50 px-10 py-4 rounded-full hover:bg-blue-100 transition-all border border-blue-100 shadow-lg active:scale-95">Initiate First Proclamation</button>
             )}
          </div>
        ) : (
          devotionals.map((dev) => (
            <article key={dev.id} className="bg-white rounded-[5rem] overflow-hidden shadow-[0_50px_100px_-30px_rgba(30,58,138,0.1)] border border-slate-50 transition-all hover:shadow-[0_80px_150px_-40px_rgba(30,58,138,0.2)] animate-in slide-in-from-bottom-12 group relative">
              {/* YouTube Visual Integration */}
              {dev.ytId && (
                <div className="relative aspect-video bg-slate-900 group-hover:brightness-110 transition-all duration-700">
                  <YouTubePlayer videoId={dev.ytId} title={dev.title} />
                  <div className="absolute top-10 left-10 z-20 pointer-events-none group-hover:translate-x-4 transition-transform duration-500">
                     <div className="px-8 py-3 bg-blue-900/90 backdrop-blur-xl text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-white/20 shadow-2xl">
                         AUTHORIZED RHEMAFIRE BROADCAST
                     </div>
                  </div>
                </div>
              )}

              {/* Textual Content Integration */}
              <div className="p-12 md:p-24 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-slate-50 pb-16">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center space-x-3 text-red-600 bg-red-50 px-6 py-2 rounded-full border border-red-100">
                        <Calendar className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">{dev.date}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-blue-900 bg-blue-50 px-6 py-2 rounded-full border border-blue-100 italic">
                        <Globe className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">{dev.series}</span>
                      </div>
                    </div>
                    <h3 className="text-6xl md:text-8xl font-black text-blue-900 tracking-tighter uppercase italic leading-[0.85] group-hover:translate-x-6 transition-transform duration-700">
                      {dev.title}
                    </h3>
                  </div>
                  {isAdmin && (
                    <button onClick={() => navigate('/admin?tab=devotionals')} className="p-5 bg-slate-50 text-slate-400 rounded-3xl hover:bg-blue-900 hover:text-white transition-all shadow-inner border border-slate-100 group/btn" title="Refine Entry">
                      <Edit3 className="w-8 h-8 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                </div>
                
                {/* Rich Text Injection (Wordprocessor Output) */}
                <div className="prose prose-blue max-w-none">
                  <div 
                    className="text-slate-600 leading-[1.85] space-y-8 font-medium text-2xl italic blog-post-content prose-headings:font-bebas prose-headings:text-5xl prose-headings:text-blue-900 prose-headings:uppercase prose-headings:tracking-widest prose-img:rounded-[3.5rem] prose-img:shadow-2xl prose-img:border-[10px] prose-img:border-white prose-a:text-blue-900 prose-a:font-black prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: dev.content || "<p class='opacity-50'>Transcribing spiritual frequency... Check back momentarily.</p>" }}
                  />
                </div>
                
                {/* Author & Engagement Node */}
                <div className="pt-16 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-10">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center font-black border-4 border-blue-50 shadow-xl group-hover:rotate-12 transition-transform">JD</div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Frequency Deployed By</span>
                        <span className="text-xl font-black uppercase tracking-widest text-blue-900 italic leading-none">Pastor Joshua David</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Share Truth Node:</span>
                      <div className="flex gap-4">
                         <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-lg"><Facebook className="w-6 h-6" /></button>
                         <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-400 hover:text-white transition-all shadow-sm hover:shadow-lg"><Twitter className="w-6 h-6" /></button>
                         <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm hover:shadow-lg"><Share2 className="w-6 h-6" /></button>
                      </div>
                   </div>
                </div>
              </div>

              {/* Atmospheric Accents */}
              <div className="absolute bottom-10 right-10 opacity-5 grayscale pointer-events-none -rotate-12 group-hover:rotate-0 transition-transform duration-1000"><ShieldCheck className="w-48 h-48" /></div>
            </article>
          ))
        )}
      </div>

      {/* Global Section Injection (WordPress-style) */}
      {config.devotionalCustomHtml && (
        <div className="pt-32 border-t border-slate-100 animate-in fade-in duration-1000 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-2 border border-slate-100 rounded-full text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Custom Page Extension</div>
          <div dangerouslySetInnerHTML={{ __html: config.devotionalCustomHtml }} />
        </div>
      )}
    </div>
  );
};

export default DailyDevotional;
