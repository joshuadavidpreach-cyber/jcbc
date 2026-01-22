
import React, { useState, useEffect } from 'react';
import { User, SiteConfig, WorshipSong } from '../types';
import { Music, FileText, Music2, Download, Mic2, PlayCircle, Lock } from 'lucide-react';
import YouTubePlayer from '../components/YouTubePlayer';

interface Props {
  user: User | null;
  config: SiteConfig;
}

const JCBCMusic: React.FC<Props> = ({ user, config }) => {
  const [songs, setSongs] = useState<WorshipSong[]>([]);
  const [activeSongId, setActiveSongId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jcbc_worship_songs');
    if (saved) setSongs(JSON.parse(saved));
  }, []);

  const isWorshipTeam = user?.role === 'admin' || user?.role === 'worship' || user?.role === 'pastor';

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-32">
      {/* Hero */}
      <section className="text-center space-y-8 py-12 relative overflow-hidden rounded-[4rem] bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="relative z-10 space-y-6 p-12">
           <div className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
              <Music className="w-4 h-4" />
              <span>JCBC Worship Team</span>
           </div>
           <h1 className="text-6xl md:text-9xl font-black tracking-wide uppercase italic leading-tight">{config.worshipTeamTitle || "JCBC Music"}</h1>
           <p className="text-2xl text-blue-100 font-medium italic opacity-80 max-w-3xl mx-auto">{config.worshipTeamSubtitle || "Prophetic Sound for a New Era."}</p>
        </div>
      </section>

      {/* Song Library */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-8">
            <h2 className="text-4xl font-black text-blue-900 uppercase italic tracking-widest border-b border-slate-200 pb-4">Setlist Library</h2>
            {songs.length === 0 ? (
               <div className="p-12 border-4 border-dashed border-slate-100 rounded-[3rem] text-center text-slate-300 font-black uppercase tracking-widest">
                  Library Empty. Admin must deploy songs from Command Center.
               </div>
            ) : (
               songs.map(song => (
                  <div key={song.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-xl transition-all group">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-900 shadow-inner">
                              <Music2 className="w-8 h-8" />
                           </div>
                           <div className="space-y-1">
                              <h3 className="text-2xl font-black text-blue-900 uppercase italic leading-none">{song.title}</h3>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{song.artist} • {song.key} • {song.tempo} BPM</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           {song.youtubeLink && (
                              <button onClick={() => setActiveSongId(activeSongId === song.id ? null : song.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors" title="Listen">
                                 <PlayCircle className="w-5 h-5" />
                              </button>
                           )}
                           {isWorshipTeam ? (
                              <>
                                 <a href={song.chordChartUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 bg-blue-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-800 transition-colors">
                                    <FileText className="w-4 h-4" /> Charts
                                 </a>
                                 <button onClick={() => alert(song.lyrics)} className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                                    <Mic2 className="w-4 h-4" /> Lyrics
                                 </button>
                              </>
                           ) : (
                              <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                 <Lock className="w-3 h-3" /> Team Only
                              </div>
                           )}
                        </div>
                     </div>
                     {activeSongId === song.id && song.youtubeLink && (
                        <div className="mt-8 aspect-video rounded-2xl overflow-hidden bg-black animate-in slide-in-from-top-4">
                           <YouTubePlayer videoId={song.youtubeLink.split('v=')[1] || ''} title={song.title} />
                        </div>
                     )}
                  </div>
               ))
            )}
         </div>

         {/* Sidebar */}
         <aside className="space-y-8">
            <div className="bg-blue-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                  <h3 className="font-bebas text-3xl tracking-widest">Worship Team Portal</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">Access restricted to authorized musicians and vocalists. Please login to view chord charts and rehearsal schedules.</p>
                  {!isWorshipTeam && (
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-300 bg-red-900/30 p-4 rounded-xl">
                        <Lock className="w-4 h-4" /> Access Restricted
                     </div>
                  )}
               </div>
            </div>
            {config.worshipCustomHtml && (
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100" dangerouslySetInnerHTML={{ __html: config.worshipCustomHtml }} />
            )}
         </aside>
      </div>
    </div>
  );
};

export default JCBCMusic;
