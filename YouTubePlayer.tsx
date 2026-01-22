
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, ExternalLink, Youtube, Loader2 } from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  className?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  videoId, 
  title = "YouTube Video", 
  autoplay = false,
  className = "" 
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(autoplay);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const currentOrigin = window.location.origin;

  const handleInteraction = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const sendCommand = useCallback((func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        'https://www.youtube-nocookie.com'
      );
    }
  }, []);

  const togglePlay = () => {
    handleInteraction();
    if (isPlaying) {
      sendCommand('pauseVideo');
    } else {
      sendCommand('playVideo');
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    handleInteraction();
    if (isMuted) {
      sendCommand('unMute');
      sendCommand('setVolume', [100]);
    } else {
      sendCommand('mute');
    }
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    handleInteraction();
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: autoplay ? '1' : '0',
    rel: '0',
    controls: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
    origin: currentOrigin,
    widget_referrer: currentOrigin,
    iv_load_policy: '3',
    fs: '0',
    disablekb: '1'
  });

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  const directUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full aspect-video bg-slate-950 overflow-hidden group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-0 animate-pulse">
          <Loader2 className="w-8 h-8 text-slate-700 animate-spin" />
        </div>
      )}

      <iframe
        ref={iframeRef}
        width="100%"
        height="100%"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full border-0 pointer-events-none z-10"
        onLoad={() => setIsLoading(false)}
      />

      {/* Click Overlay for Play/Pause */}
      <div 
        className="absolute inset-0 cursor-pointer z-20" 
        onClick={togglePlay}
      />

      {/* Control Bar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent flex items-center justify-between z-30 transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex items-center space-x-4">
          <button 
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="text-white hover:text-blue-400 transition-all transform hover:scale-110 active:scale-95 p-2.5 bg-white/10 rounded-full backdrop-blur-md border border-white/5"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="text-white hover:text-blue-400 transition-all transform hover:scale-110 active:scale-95 p-2.5 bg-white/10 rounded-full backdrop-blur-md border border-white/5"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <a 
            href={directUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white rounded-lg font-bebas text-xs tracking-widest backdrop-blur-sm transition-all shadow-lg active:scale-95"
          >
            <Youtube className="w-3 h-3" />
            <span>Open App</span>
          </a>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="text-white hover:text-blue-400 transition-all transform hover:scale-110 active:scale-95 p-2.5 bg-white/10 rounded-full backdrop-blur-md border border-white/5"
            aria-label="Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Big Center Play Button (Visible when paused) */}
      {!isPlaying && !isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-600/90 backdrop-blur-xl rounded-full flex items-center justify-center text-white border-[6px] border-white/20 shadow-[0_0_60px_rgba(37,99,235,0.4)] animate-in zoom-in duration-300 pointer-events-auto cursor-pointer hover:scale-110 transition-transform hover:bg-blue-500" onClick={togglePlay}>
            <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Live Indicator (Optional aesthetic touch) */}
      <div className="absolute top-4 left-4 pointer-events-none z-30">
        <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
            {isPlaying ? 'Signal Active' : 'Signal Paused'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;
