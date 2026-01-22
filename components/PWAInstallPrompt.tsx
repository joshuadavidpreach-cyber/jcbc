
import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a short delay to not annoy immediately
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If iOS and not installed, show instruction prompt occasionally
    if (ios && !localStorage.getItem('pwa_ios_dismissed')) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) localStorage.setItem('pwa_ios_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] animate-in slide-in-from-bottom-6 duration-700">
      <div className="bg-blue-900 text-white p-6 rounded-[2rem] shadow-2xl border border-white/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Download className="w-24 h-24 rotate-12" /></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0">
             <img src="https://i.ibb.co/C3m2v3Y9/jcbc-logo.png" alt="Icon" className="w-8 h-8 object-contain" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bebas text-xl tracking-widest">Install App</h4>
            <p className="text-[10px] opacity-80 font-medium">Add JCBC Portal to your home screen for instant access.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
          {isIOS ? (
            <div className="text-[10px] font-bold bg-blue-800 px-4 py-2 rounded-xl border border-blue-700 flex items-center gap-2">
               <span>Tap</span> <Share className="w-3 h-3" /> <span>then "Add to Home Screen"</span>
            </div>
          ) : (
            <button 
              onClick={handleInstall}
              className="flex-grow md:flex-grow-0 bg-white text-blue-900 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-50 transition-colors shadow-lg"
            >
              Install Now
            </button>
          )}
          <button onClick={handleDismiss} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
