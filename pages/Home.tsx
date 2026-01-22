
import React from 'react';
import { Music, MapPin, Clock, ShieldCheck, ChevronRight, Globe, Users, Edit3, Youtube } from 'lucide-react';
import { SiteConfig, User } from '../types';
import YouTubePlayer from '../components/YouTubePlayer';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

interface HomeProps {
  config: SiteConfig;
  user: User | null;
  onUpdateConfig?: (config: SiteConfig) => void;
}

const Home: React.FC<HomeProps> = ({ config, user }) => {
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin' || user?.role === 'pastor' || user?.role === 'staff';

  const getYouTubeId = (url: string, embedCode?: string) => {
    if (embedCode) {
      const embedMatch = embedCode.match(/embed\/([\w-]{11})/);
      if (embedMatch && embedMatch[1]) return embedMatch[1];
      if (embedCode.length === 11 && !embedCode.includes(' ')) return embedCode;
    }
    if (!url) return 'Y2PblkqFaZE';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[8] && match[8].length === 11) ? match[8] : 'Y2PblkqFaZE';
  };

  const videoId = React.useMemo(() => 
    getYouTubeId(config.welcomeVideoUrl, config.welcomeVideoEmbedCode), 
    [config.welcomeVideoUrl, config.welcomeVideoEmbedCode]
  );

  const EditButton = ({ tab }: { tab: string }) => {
    if (!isAdmin) return null;
    return (
      <button 
        onClick={() => navigate(`/admin?tab=${tab}`)}
        className="ml-3 p-1.5 bg-slate-900 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all active:scale-95 z-50 relative"
        title="Edit Section"
      >
        <Edit3 className="w-3 h-3" />
      </button>
    );
  };

  return (
    <div className="space-y-24 animate-in fade-in duration-700">
      <SEO 
        title="Home - Apostolic Church Near Spokane" 
        description="Jesus Culture Bible Church in Chattaroy, WA. We are an Apostolic, Pentecostal, and Undenominational body engaging in Deliverance, Discipleship, and Dominion."
        config={config} 
      />
      
      {/* Hero Section */}
      <section className="space-y-12">
        <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-50 text-blue-900 rounded-full font-bold uppercase tracking-widest text-[10px] border border-blue-100">
            <Globe className="w-3 h-3" />
            <span>Regional Dominion Frequency - Spokane, WA</span>
            <EditButton tab="identity" />
          </div>
          
          <div className="relative">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas text-slate-900 tracking-wide leading-[0.9]">
              {config.welcomeTitle}
            </h1>
            <div className="absolute -top-6 -right-12"><EditButton tab="home" /></div>
          </div>
          
          <p className="text-lg md:text-2xl text-slate-500 font-serif italic max-w-2xl mx-auto leading-relaxed">
            "{config.welcomeSubtitle}"
          </p>
          <div className="text-xs font-black uppercase tracking-widest text-slate-400 mt-4">
             Serving Chattaroy, Deer Park, and North Spokane
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto relative group px-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-black">
            <YouTubePlayer videoId={videoId} title="JCBC Welcome - Apostolic Ministry Spokane" />
            <div className="absolute top-6 left-6 pointer-events-none z-30 hidden sm:block">
               <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <span>Authorized Apostolic Broadcast</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission/Vision Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
         <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all duration-500 relative group">
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"><EditButton tab="identity" /></div>
            <div className="space-y-6">
               <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-2"><ShieldCheck className="w-7 h-7" /></div>
               <h2 className="font-bebas text-4xl text-slate-900 tracking-wide">Our Mission</h2>
               <p className="text-lg text-slate-600 font-serif italic leading-relaxed">"{config.missionStatement}"</p>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                 Walking in the power of <span className="text-blue-900">John G. Lake</span> and JGLM principles.
               </p>
            </div>
            <div className="h-1.5 w-16 bg-blue-900 rounded-full mt-8" />
         </div>
         
         <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-500 relative group">
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"><EditButton tab="identity" /></div>
            <div className="space-y-6">
               <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-2 backdrop-blur-sm"><Users className="w-7 h-7" /></div>
               <h2 className="font-bebas text-4xl text-white tracking-wide">Our Vision</h2>
               <p className="text-lg text-slate-300 font-serif italic leading-relaxed">"{config.visionStatement}"</p>
               <p className="text-xs font-bold text-blue-300 uppercase tracking-widest">
                 Recovered Ministry • Dominion • Deliverance
               </p>
            </div>
            <div className="h-1.5 w-16 bg-blue-500 rounded-full mt-8" />
         </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto pt-8 pb-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: config.homeCard1Title, body: config.homeCard1Body, icon: Clock, footer: config.serviceTimes, action: null },
            { title: config.homeCard2Title, body: config.homeCard2Body, icon: MapPin, footer: null, action: { label: 'Get Directions', url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.locationAddress)}` } },
            { title: config.homeCard3Title, body: config.homeCard3Body, icon: Music, footer: null, action: { label: 'Listen Now', url: config.worshipLink } }
          ].map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center space-y-6 relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"><EditButton tab="home" /></div>
              <div className="w-16 h-16 bg-slate-50 text-blue-900 rounded-2xl flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300">
                <card.icon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bebas text-3xl text-slate-900 tracking-wide">{card.title}</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{card.body}</p>
              </div>
              {card.footer && (
                <div className="mt-auto pt-4 border-t border-slate-50 w-full">
                  <p className="font-bebas text-xl text-blue-900">{card.footer}</p>
                </div>
              )}
              {card.action && (
                <a href={card.action.url} target="_blank" rel="noopener noreferrer" className="mt-auto flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors group/link">
                  <span>{card.action.label}</span>
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-12 text-slate-300 font-black uppercase text-[9px] tracking-[0.3em]">
           Undenominational • Pentecostal • Apostolic • Chattaroy • Spokane
        </div>
      </section>

      {/* Custom HTML Injection */}
      {config.homeCustomHtml && (
        <section className="relative group max-w-7xl mx-auto px-4">
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity"><EditButton tab="home" /></div>
          <div 
            className="custom-content rounded-[2.5rem] overflow-hidden"
            dangerouslySetInnerHTML={{ __html: config.homeCustomHtml }}
          />
        </section>
      )}
    </div>
  );
};

export default Home;
