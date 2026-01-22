
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { LandingPage, SiteConfig } from '../types';
import { ArrowLeft, CheckCircle2, Loader2, Send, Play, CreditCard, Lock } from 'lucide-react';

interface Props {
  config: SiteConfig;
}

const LandingPageViewer: React.FC<Props> = ({ config }) => {
  const { slug } = useParams();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedPages = localStorage.getItem('jcbc_landing_pages');
    if (savedPages) {
      const all: LandingPage[] = JSON.parse(savedPages);
      const found = all.find(p => p.slug === slug && p.isActive);
      if (found) {
        setPage(found);
        // Track View
        found.views = (found.views || 0) + 1;
        const updatedAll = all.map(p => p.id === found.id ? found : p);
        localStorage.setItem('jcbc_landing_pages', JSON.stringify(updatedAll));
      }
    }
    window.scrollTo(0, 0);
  }, [slug]);

  const handleConversion = (type: 'lead' | 'sale') => {
    setSubmitting(true);
    
    setTimeout(() => {
      // 1. Record Lead locally
      if (type === 'lead') {
        const savedLeads = JSON.parse(localStorage.getItem('jcbc_leads') || '[]');
        savedLeads.push({ email, source: slug, timestamp: Date.now() });
        localStorage.setItem('jcbc_leads', JSON.stringify(savedLeads));
      }

      // 2. Increment Conversion Count
      const savedPages = JSON.parse(localStorage.getItem('jcbc_landing_pages') || '[]');
      const updatedPages = savedPages.map((p: LandingPage) => {
        if (p.id === page?.id) {
          return { ...p, conversions: (p.conversions || 0) + 1 };
        }
        return p;
      });
      localStorage.setItem('jcbc_landing_pages', JSON.stringify(updatedPages));

      setSubmitting(false);
      setSubmitted(true);

      // 3. Handle Redirect (Funnel Logic)
      if (page?.redirectUrl) {
        setTimeout(() => window.location.href = page.redirectUrl!, 1500);
      }
    }, 1500);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    handleConversion('lead');
  };

  const handlePurchase = () => {
    if(confirm("Confirm purchase simulation?")) {
        handleConversion('sale');
    }
  };

  if (!page) return <div className="h-screen flex items-center justify-center bg-slate-50 font-bebas text-2xl text-blue-900 animate-pulse">Scanning Dimensions...</div>;

  // Render Template Selection
  const isDarkWebinar = page.template === 'dark_webinar';
  const isSqueeze = page.template === 'classic_squeeze';
  const isVSL = page.template === 'modern_vsl';

  return (
    <div className={`min-h-screen ${isDarkWebinar ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* Custom Styles Injection */}
      {page.customCss && <style>{page.customCss}</style>}

      {/* Header */}
      {!isSqueeze && (
        <div className={`max-w-7xl mx-auto px-8 py-6 flex justify-between items-center ${isDarkWebinar ? 'border-b border-white/10' : 'border-b border-slate-50'}`}>
           <Link to="/" className={`flex items-center space-x-3 transition-colors ${isDarkWebinar ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-blue-900'}`}>
              <ArrowLeft className="w-4 h-4" />
              <span className="font-bebas tracking-widest">Back to Hub</span>
           </Link>
           {config.logoImageUrl && <img src={config.logoImageUrl} alt="JCBC" className="h-10 w-auto" />}
        </div>
      )}

      <main className={`max-w-5xl mx-auto px-8 py-20 space-y-16 animate-in fade-in duration-1000 ${isSqueeze ? 'flex flex-col justify-center min-h-[80vh]' : ''}`}>
        
        {/* Dynamic Headlines */}
        <div className="text-center space-y-6">
           <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] ${isDarkWebinar ? 'text-white' : 'text-blue-900'}`}>
             {page.title}
           </h1>
           {isVSL && <p className="text-xl md:text-2xl font-bold text-red-600 uppercase tracking-widest animate-pulse">Watch The Presentation Below</p>}
        </div>
        
        {/* Main Content Area */}
        <div 
          className={`prose max-w-none text-xl leading-relaxed 
            ${isDarkWebinar ? 'prose-invert prose-p:text-slate-300 prose-headings:text-white' : 'prose-slate prose-headings:text-blue-900'}
            prose-img:rounded-[2.5rem] prose-headings:font-bebas prose-headings:uppercase`}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* Lead Capture Module */}
        {page.showCaptureForm && !page.price && (
          <div className={`${isDarkWebinar ? 'bg-blue-600' : 'bg-blue-900'} text-white p-12 md:p-20 rounded-[4rem] shadow-2xl relative overflow-hidden group mx-auto max-w-3xl`}>
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Send className="w-48 h-48" /></div>
            <div className="space-y-8 relative z-10 text-center">
              <div className="space-y-3">
                <h3 className="text-4xl md:text-5xl font-black uppercase italic leading-none">{page.captureTitle || 'Secure Your Access'}</h3>
                <p className="text-blue-100 font-medium italic opacity-80">Enter your email below to proceed to the next step.</p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your best email..." 
                    className="w-full p-6 rounded-[1.5rem] bg-white text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold text-lg text-center shadow-inner" 
                  />
                  <button 
                    disabled={submitting}
                    className="w-full bg-red-600 hover:bg-red-500 py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-red-800"
                  >
                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    <span>{page.captureButtonText || 'GET INSTANT ACCESS'}</span>
                  </button>
                  <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest flex items-center justify-center gap-2"><Lock className="w-3 h-3" /> Secure SSL Connection</p>
                </form>
              ) : (
                <div className="bg-white/10 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/20 text-center space-y-4 animate-in zoom-in duration-500">
                   <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
                   <h4 className="text-2xl font-black uppercase italic">Access Granted</h4>
                   <p className="text-blue-100 opacity-80">Redirecting you to the next chamber...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sales/Checkout Module */}
        {page.price && (
           <div className="max-w-md mx-auto bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-blue-50 text-center space-y-8 transform hover:scale-105 transition-transform duration-500">
              <div className="space-y-2">
                 <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Special Offer</p>
                 <h3 className="text-4xl font-black text-blue-900 uppercase italic">{page.productName || "Kingdom Resource"}</h3>
                 <div className="text-6xl font-black text-green-600 my-4">${page.price}</div>
              </div>
              <button 
                 onClick={handlePurchase}
                 disabled={submitting || submitted}
                 className="w-full py-6 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-xl shadow-lg hover:bg-green-500 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                 {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
                 <span>{page.captureButtonText || "Purchase Now"}</span>
              </button>
              <img src="https://i.ibb.co/C3m2v3Y9/jcbc-logo.png" className="h-8 mx-auto opacity-30 grayscale" alt="Secure" />
           </div>
        )}

      </main>

      <footer className="py-12 text-center opacity-20 border-t border-slate-50/10">
         <p className="text-[10px] font-black uppercase tracking-[0.4em]">© {new Date().getFullYear()} {config.churchName} FUNNEL-SYSTEMS</p>
      </footer>
    </div>
  );
};

export default LandingPageViewer;
