
import React from 'react';
import { SiteConfig, User } from '../types';
import { Youtube, Facebook, Bell, Share2, Heart, Users, ExternalLink, ShieldAlert, Radio, Edit3, MessageSquare, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  config: SiteConfig;
  user?: User | null;
}

const SaintsArmyPodcast: React.FC<Props> = ({ config, user }) => {
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin' || user?.role === 'pastor' || user?.role === 'staff';

  const EditButton = () => {
    if (!isAdmin) return null;
    return (
      <button 
        onClick={() => navigate('/admin?tab=podcast')}
        className="p-2 bg-blue-900 text-white rounded-full shadow-xl hover:scale-110 transition-all active:scale-95"
      >
        <Edit3 className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-32">
      {/* Hero Header */}
      <section className="relative min-h-[500px] md:min-h-[600px] rounded-[4rem] overflow-hidden bg-blue-900 flex items-center justify-center text-center p-8 md:p-20 shadow-2xl group border-b-[16px] border-blue-950">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-[3000ms] md:bg-fixed" 
          style={{ backgroundImage: `url(${config.podcastBannerImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/70 to-blue-950/95" />
        <div className="relative z-10 space-y-8 max-w-5xl w-full">
          <div className="inline-flex items-center space-x-3 px-6 py-2 bg-red-600/90 backdrop-blur-md text-white rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl animate-in slide-in-from-top duration-700 border border-white/20">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Weekly Kingdom Broadcast</span>
            <EditButton />
          </div>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-wide uppercase italic leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-in zoom-in duration-700 delay-100">
            {config.podcastTitle.split(' ').map((w,i) => (
              <React.Fragment key={i}>
                {w.toLowerCase() === 'podcast' ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">Podcast</span> : w}{' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 font-bold tracking-wide uppercase max-w-3xl mx-auto italic drop-shadow-lg opacity-90 leading-relaxed animate-in slide-in-from-bottom duration-700 delay-200">
            "{config.podcastSubtitle}"
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in duration-1000 delay-300">
             <a 
               href={config.podcastYoutubeLink} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="w-full sm:w-auto bg-red-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs md:text-sm flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(220,38,38,0.3)] hover:bg-red-500 hover:scale-105 transition-all active:scale-95 border-b-4 border-red-800 ring-2 ring-red-500/50"
             >
               <Youtube className="w-5 h-5 md:w-6 md:h-6" />
               <span>Subscribe on YouTube</span>
             </a>
             <a 
               href={config.podcastFacebookLink} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs md:text-sm flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:scale-105 transition-all active:scale-95 border-b-4 border-blue-800 ring-2 ring-blue-500/50"
             >
               <Facebook className="w-5 h-5 md:w-6 md:h-6" />
               <span>Follow on Facebook</span>
             </a>
          </div>
        </div>
      </section>

      {/* Stats/Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
         <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 text-center space-y-4 hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner group-hover:scale-110 transition-transform">
               <Bell className="w-8 h-8" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Next Transmission</h4>
            <p className="font-bebas text-2xl md:text-3xl text-blue-900 tracking-widest">{config.podcastSchedule}</p>
         </div>
         <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 text-center space-y-4 hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-inner group-hover:scale-110 transition-transform">
               <Zap className="w-8 h-8" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Remnant Frequency</h4>
            <p className="font-bebas text-2xl md:text-3xl text-red-600 tracking-widest">LIVE BROADCAST</p>
         </div>
         <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 text-center space-y-4 hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner group-hover:scale-110 transition-transform">
               <Users className="w-8 h-8" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Global Community</h4>
            <p className="font-bebas text-2xl md:text-3xl text-blue-600 tracking-widest">JOIN THE ARMY</p>
         </div>
      </div>

      {/* Detailed Call to Action Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch max-w-7xl mx-auto px-4">
        <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-xl border border-slate-100 space-y-10 group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-8 right-8"><EditButton /></div>
          <div className="space-y-6">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner border border-red-100">
               <Youtube className="w-10 h-10" />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter">Authorized YouTube Feed</h3>
            <p className="text-lg md:text-xl text-slate-500 font-medium italic leading-relaxed">
              "Join our live chat, watch full episodes, and dive into our video archives. Your subscription helps us reclaim the cultural territory."
            </p>
          </div>
          <a 
            href={config.podcastYoutubeLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs md:text-sm flex items-center justify-center gap-4 shadow-xl hover:bg-red-700 active:scale-95 transition-all border-b-4 border-red-800"
          >
            <span>Activate YouTube Protocol</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-xl border border-slate-100 space-y-10 group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-8 right-8"><EditButton /></div>
          <div className="space-y-6">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-blue-100">
               <Facebook className="w-10 h-10" />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter">Facebook Remnant Group</h3>
            <p className="text-lg md:text-xl text-slate-500 font-medium italic leading-relaxed">
              "Connect with our growing community and follow for real-time updates and exclusive live sessions with the Elders."
            </p>
          </div>
          <a 
            href={config.podcastFacebookLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs md:text-sm flex items-center justify-center gap-4 shadow-xl hover:bg-blue-700 active:scale-95 transition-all border-b-4 border-blue-800"
          >
            <span>Join the Facebook Army</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Pastor Bio Section */}
      <section className="bg-slate-950 rounded-[3rem] md:rounded-[5rem] p-10 md:p-24 text-white relative overflow-hidden group shadow-2xl max-w-7xl mx-auto mx-4">
        <div className="absolute top-12 right-12 opacity-0 group-hover:opacity-100 transition-opacity z-20"><EditButton /></div>
        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 pointer-events-none"><ShieldAlert className="w-[300px] h-[300px] md:w-[500px] md:h-[500px]" /></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-8">
               <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.85]">{config.pastorBioTitle}</h2>
            </div>
            <p className="text-xl md:text-2xl text-blue-100/80 font-medium leading-relaxed italic">"{config.pastorBioBody}"</p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-6 pt-4">
              <a 
                href={config.pastorFacebookLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center space-x-4 bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl hover:bg-blue-50 transition-all active:scale-95 border-b-4 border-slate-200"
              >
                <Facebook className="w-5 h-5 fill-current text-blue-600" />
                <span>Pastor's Official Channel</span>
              </a>
              <button className="flex items-center justify-center space-x-4 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl hover:bg-blue-500 transition-all active:scale-95 border-b-4 border-blue-800">
                <MessageSquare className="w-5 h-5" />
                <span>Contact Leadership</span>
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-full aspect-square bg-white/5 rounded-[4rem] border-[20px] border-white/5 flex flex-col items-center justify-center p-12 backdrop-blur-xl text-center space-y-8 shadow-inner hover:border-white/10 transition-all duration-700">
                 <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30 animate-pulse">
                    <Users className="w-16 h-16 text-blue-400" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-4xl font-black uppercase italic tracking-tighter">Join the Remnant</h4>
                    <p className="text-blue-300 font-black uppercase tracking-[0.4em] text-[10px] italic">A Global Community of Fire & Truth</p>
                 </div>
                 <div className="h-1 w-24 bg-blue-500/30 rounded-full" />
                 <p className="text-sm text-blue-100/40 font-bold uppercase tracking-widest leading-relaxed">
                   Authorized by the Oversight of Jesus Culture Bible Church
                 </p>
            </div>
          </div>
        </div>
      </section>

      {config.podcastCustomHtml && (
        <div className="pt-20 border-t border-slate-100" dangerouslySetInnerHTML={{ __html: config.podcastCustomHtml }} />
      )}
    </div>
  );
};

export default SaintsArmyPodcast;
