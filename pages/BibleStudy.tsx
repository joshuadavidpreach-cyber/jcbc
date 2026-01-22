
import React, { useState, useEffect } from 'react';
import { User, Video, BibleStudyCategory, SiteConfig } from '../types';
import { categorizeBibleStudyVideo } from '../services/gemini';
import { Plus, Video as VideoIcon, Search, Loader2, X, Info, Youtube, ExternalLink, Tag, Check } from 'lucide-react';
import YouTubePlayer from '../components/YouTubePlayer';

interface Props {
  user: User;
  config: SiteConfig;
}

const CATEGORIES: BibleStudyCategory[] = ['Theology', 'Evangelism', 'Youth', 'Family', 'Worship', 'Prophecy', 'General'];

const BibleStudy: React.FC<Props> = ({ config, user }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<BibleStudyCategory | 'All'>('All');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'pastor' || user?.role === 'staff';

  useEffect(() => {
    const saved = localStorage.getItem('jcbc_studies');
    if (saved) setVideos(JSON.parse(saved));
  }, []);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = getYouTubeId(url);
    if (!ytId) return alert('Invalid YouTube URL');
    setLoading(true);
    try {
      const category = await categorizeBibleStudyVideo(title, description);
      const newVideo: Video = { 
        id: Date.now().toString(), 
        title, 
        description, 
        youtubeId: ytId, 
        category, 
        date: new Date().toISOString().split('T')[0]
      };
      const updated = [newVideo, ...videos];
      setVideos(updated);
      localStorage.setItem('jcbc_studies', JSON.stringify(updated));
      setUrl(''); setTitle(''); setDescription(''); setShowAddForm(false);
    } finally { setLoading(false); }
  };

  const updateVideoCategory = (id: string, newCategory: BibleStudyCategory) => {
    const updated = videos.map(v => v.id === id ? { ...v, category: newCategory } : v);
    setVideos(updated);
    localStorage.setItem('jcbc_studies', JSON.stringify(updated));
    setEditingCategoryId(null);
  };

  const deleteVideo = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Purge this teaching from the Archives?")) {
      const updated = videos.filter(v => v.id !== id);
      setVideos(updated);
      localStorage.setItem('jcbc_studies', JSON.stringify(updated));
    }
  };

  const filteredVideos = videos.filter(v => (activeCategory === 'All' || v.category === activeCategory) && (v.title.toLowerCase().includes(searchTerm.toLowerCase())));
  const navCategories: (BibleStudyCategory | 'All')[] = ['All', ...CATEGORIES];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-6xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">{config.studyLibraryTitle}</h2>
          <p className="text-slate-500 text-lg font-medium italic opacity-70">"{config.studyLibrarySubtitle}"</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center justify-center space-x-3 bg-blue-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-blue-800 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            <span>{config.studyRegisterButtonText}</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-100 animate-in fade-in zoom-in duration-300">
          <form onSubmit={handleAddVideo} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Broadcast YouTube URL" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" required />
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Teaching Title" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" required />
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed summary of the session..." className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none h-32 font-medium shadow-inner" />
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-6 text-slate-400 font-black uppercase text-[10px] tracking-widest">Discard</button>
              <button type="submit" disabled={loading} className="bg-blue-900 text-white px-12 py-4 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center space-x-3 shadow-xl">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <VideoIcon className="w-5 h-5" />}
                <span>{loading ? 'Analyzing Content...' : 'Archive Session'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {activeVideoId && (
        <div className="space-y-6 animate-in slide-in-from-top-6 duration-700">
          <div className="bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl border-[16px] border-white relative">
            <button onClick={() => setActiveVideoId(null)} className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            <div className="aspect-video relative">
              <YouTubePlayer videoId={activeVideoId} title="Study Player" />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center space-x-4 bg-white px-8 py-4 rounded-full border border-slate-100 shadow-md">
          <Search className="w-6 h-6 text-slate-300" />
          <input type="text" placeholder="Search Archives..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow bg-transparent outline-none text-slate-700 font-medium" />
        </div>
        <div className="flex flex-wrap gap-2 px-2">
          {navCategories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-200 hover:text-blue-900'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredVideos.map((video) => (
          <div key={video.id} onClick={() => { setActiveVideoId(video.youtubeId); window.scrollTo({ top: 300, behavior: 'smooth' }); }} className="bg-white rounded-[3rem] overflow-hidden shadow-lg border border-slate-100 group hover:shadow-2xl transition-all cursor-pointer">
            <div className="relative aspect-video">
              <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-900 shadow-2xl group-hover:scale-125 transition-transform"><VideoIcon className="w-7 h-7 fill-current" /></div>
              </div>
              {isAdmin && (
                <button onClick={(e) => deleteVideo(e, video.id)} className="absolute top-4 right-4 p-3 bg-red-600/20 backdrop-blur-md text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"><X className="w-4 h-4" /></button>
              )}
            </div>
            <div className="p-10 space-y-4">
              <span className="text-[9px] font-black text-blue-900 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">{video.category}</span>
              <h4 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter leading-tight group-hover:text-blue-800 transition-colors">{video.title}</h4>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">{new Date(video.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {config.studyCustomHtml && (
        <div className="pt-20 border-t border-slate-100" dangerouslySetInnerHTML={{ __html: config.studyCustomHtml }} />
      )}
    </div>
  );
};

export default BibleStudy;
