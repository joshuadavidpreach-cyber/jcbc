
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { User, SiteConfig } from '../types';
import { 
  Home, Heart, MessageSquare, BookOpen, Video, LogOut, Settings, 
  Menu, X, Radio, GraduationCap, Coins, Bell, ShieldCheck, Edit3, Database,
  ArrowRight, Mail, ShoppingBag, ExternalLink, Music, User as UserIcon, Users, Lock, Palette
} from 'lucide-react';

interface LayoutProps {
  user: User | null;
  config: SiteConfig;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, config, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [designMode, setDesignMode] = useState(false); // New: Global Design Mode state

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pass designMode status to children via CSS variable or simple class toggle on body
  useEffect(() => {
    if (designMode) document.body.classList.add('design-mode-active');
    else document.body.classList.remove('design-mode-active');
  }, [designMode]);

  const themeStyles = {
    '--primary-color': config.primaryColor || '#1e3a8a',
    '--accent-color': config.accentColor || '#3b82f6',
    '--bg-color': config.backgroundColor || '#f8fafc',
    '--secondary-color': config.secondaryColor || '#0f172a',
    '--surface-color': config.surfaceColor || '#ffffff',
    '--text-primary': config.textPrimaryColor || '#1e293b',
    '--text-secondary': config.textSecondaryColor || '#64748b',
    '--remnant-radius': config.remnantRadius || '1.5rem',
    '--base-size': config.baseFontSize || '16px',
    '--heading-font': config.headingFont === 'Inter' ? "'Inter', sans-serif" : config.headingFont === 'Lora' ? "'Lora', serif" : "'Bebas Neue', sans-serif",
    '--body-font': config.bodyFont === 'Bebas Neue' ? "'Bebas Neue', sans-serif" : config.bodyFont === 'Lora' ? "'Lora', serif" : "'Inter', sans-serif",
  } as React.CSSProperties;

  const navItems = [
    { path: '/', label: 'Home', icon: Home, adminTab: 'home' },
    { path: '/staff', label: 'Leadership', icon: Users, adminTab: 'staff' },
    { path: '/devotionals', label: 'RhemaFire', icon: Video, adminTab: 'devotionals' },
    { path: '/announcements', label: 'Bulletin', icon: Bell, adminTab: 'announcements' },
    { path: '/podcast', label: 'Podcast', icon: Radio, adminTab: 'podcast' },
    { path: '/academy', label: 'Academy', icon: GraduationCap, adminTab: 'academy' },
    { path: '/giving', label: 'Giving', icon: Coins, adminTab: 'giving' },
    { path: '/store', label: 'Store', icon: ShoppingBag, adminTab: 'store' },
    { path: '/prayer', label: 'Prayer', icon: Heart, adminTab: 'prayer' },
    { path: '/chat', label: 'Community', icon: MessageSquare, adminTab: 'community' },
    { path: '/bible-study', label: 'Library', icon: BookOpen, adminTab: 'bible-study' },
    { path: '/music', label: 'Music', icon: Music, adminTab: 'ministry' },
  ];

  const isContributor = user?.role === 'admin' || user?.role === 'pastor' || user?.role === 'staff';
  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const currentNav = navItems.find(item => isActive(item.path));
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col transition-all duration-500 font-sans text-slate-900" style={themeStyles}>
      <style>{`
        :root {
          --jcbc-blue: var(--primary-color);
        }
        html { font-size: var(--base-size); }
        body { 
          background-color: var(--bg-color); 
          color: var(--text-primary);
          font-family: var(--body-font);
        }
        h1, h2, h3, h4, .font-bebas, .nav-font, .btn-font { font-family: var(--heading-font); }
        .text-blue-900 { color: var(--primary-color); }
        .bg-blue-900 { background-color: var(--primary-color); }
        .bg-blue-600 { background-color: var(--accent-color); }
        .text-blue-600 { color: var(--accent-color); }
        .bg-slate-900 { background-color: var(--secondary-color); }
        .bg-white { background-color: var(--surface-color); }
        
        .rounded-3xl, .rounded-\[2\.5rem\], .rounded-\[3rem\], .rounded-\[4rem\] {
          border-radius: var(--remnant-radius) !important;
        }

        /* Design Mode Highlights */
        body.design-mode-active .group:hover {
          outline: 2px dashed #3b82f6;
          outline-offset: 4px;
        }
        body.design-mode-active button[title="Edit Section"] {
          opacity: 1 !important;
          transform: scale(1.1);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
      
      {/* Global Lead Capture Header */}
      {config.leadCaptureActive && location.pathname === '/' && !isAdminPage && (
        <div className="bg-blue-900 text-white py-2 px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center z-[130] text-xs font-medium tracking-wide border-b border-white/10">
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3 text-blue-300" />
            <span className="opacity-90">{config.leadCaptureTitle} — {config.leadCaptureSubtitle}</span>
          </div>
          <button 
             onClick={() => {
               const email = prompt("Enter your email for the Remnant Newsletter:");
               if(email) alert("Subscription protocol initiated!");
             }}
             className="bg-white/10 hover:bg-white/20 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors border border-white/10"
          >
            Join Now
          </button>
        </div>
      )}

      <header 
        className={`sticky ${isContributor ? 'top-0' : (config.leadCaptureActive && location.pathname === '/' ? 'top-[40px]' : 'top-0')} z-[110] transition-all duration-500 w-full ${
          scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm py-2' : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className={`mx-auto px-6 flex items-center justify-between ${isAdminPage ? 'w-full max-w-[98%]' : 'max-w-7xl'}`}>
          <Link to="/" className="flex items-center space-x-4 group shrink-0">
            {config.logoImageUrl && (
              <div className="relative">
                <img 
                  src={config.logoImageUrl} 
                  alt={config.logoAlt} 
                  className={`object-contain transition-all duration-500 ${scrolled ? 'h-10' : 'h-14'}`}
                />
              </div>
            )}
            <div className="flex flex-col">
              <span className={`font-bebas tracking-wide text-slate-900 leading-none transition-all duration-500 ${scrolled ? 'text-xl' : 'text-2xl'}`}>{config.churchName}</span>
              <span className={`text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] transition-all duration-500 ${scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 mt-1'}`}>Equipping the Remnant</span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg font-bebas text-lg tracking-wide transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'text-blue-900 bg-blue-50' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-slate-200 mx-4" />
            
            {user ? (
              <div className="flex items-center gap-3">
                {isContributor && (
                  <>
                    <button 
                      onClick={() => setDesignMode(!designMode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bebas tracking-widest text-sm transition-all shadow-sm active:scale-95 ${designMode ? 'bg-green-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      title="Toggle Live Design Mode"
                    >
                      <Palette className="w-4 h-4" />
                      <span>{designMode ? 'Design: ON' : 'Design Mode'}</span>
                    </button>
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg font-bebas tracking-widest text-sm hover:bg-blue-800 transition-all shadow-md active:scale-95"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Command Center</span>
                    </Link>
                  </>
                )}
                <div className="flex flex-col items-end hidden 2xl:flex">
                  <span className="text-xs font-bold text-slate-900">{user.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.role}</span>
                </div>
                <button 
                  onClick={onLogout} 
                  className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bebas text-lg tracking-widest hover:bg-blue-900 transition-all shadow-md active:scale-95">
                Login
              </Link>
            )}
          </nav>

          <button className="xl:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-4 shadow-xl animate-in slide-in-from-top-4 duration-300 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-4 rounded-xl font-bebas text-xl tracking-widest flex items-center gap-4 ${
                    isActive(item.path) ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <item.icon className="w-5 h-5 opacity-70" />
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  {isContributor && (
                    <div className="space-y-2 pt-2">
                      <button 
                        onClick={() => { setDesignMode(!designMode); setIsMenuOpen(false); }}
                        className={`w-full p-4 rounded-xl font-bebas text-xl tracking-widest flex items-center gap-4 ${designMode ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        <Palette className="w-5 h-5" />
                        {designMode ? 'Live Design: ON' : 'Enable Design Mode'}
                      </button>
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="p-4 rounded-xl font-bebas text-xl tracking-widest flex items-center gap-4 bg-blue-900 text-white shadow-lg"
                      >
                        <Settings className="w-5 h-5" />
                        KDC Command Center
                      </Link>
                    </div>
                  )}
                  <button 
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="p-4 rounded-xl font-bebas text-xl tracking-widest flex items-center gap-4 text-red-500 hover:bg-red-50 mt-2 border-t border-slate-50"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-4 rounded-xl font-bebas text-xl tracking-widest flex items-center gap-4 text-blue-900 hover:bg-blue-50 mt-4 border-t border-slate-50"
                >
                  <UserIcon className="w-5 h-5" />
                  Member Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {/* Conditional container width based on route to expand Command Center */}
        <div className={`${isAdminPage ? 'w-full px-0 sm:px-4' : 'max-w-7xl mx-auto px-4 sm:px-6'} py-4 md:py-12 transition-all duration-500`}>
          <Outlet />
        </div>
      </main>

      {/* Floating Admin Quick Edit Button - Still kept for ease of use, but now redundant with Menu link */}
      {isContributor && !isAdminPage && !designMode && (
        <div className="fixed bottom-8 right-8 z-[200] animate-in slide-in-from-bottom-6 duration-700 hidden lg:block">
           <button 
             onClick={() => navigate(`/admin?tab=${currentNav?.adminTab || 'identity'}`)}
             className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-white hover:bg-blue-900 group"
             title={`Edit ${currentNav?.label || 'Site'} Config`}
           >
             <Edit3 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-500" />
           </button>
        </div>
      )}

      <footer className="bg-slate-950 text-slate-400 py-24 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
          <div className="space-y-8 col-span-1 lg:col-span-2 pr-0 lg:pr-12">
            <div className="flex items-center space-x-4">
               {config.logoImageUrl && <img src={config.logoImageUrl} alt={config.logoAlt} className="h-16 w-auto opacity-80 grayscale hover:grayscale-0 transition-all duration-500" />}
               <h3 className="font-bebas text-3xl text-white tracking-widest">{config.churchName}</h3>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-lg">
              {config.missionStatement} <br/><br/>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Serving Spokane, Chattaroy, and Deer Park, WA.</span>
            </p>
            <div className="flex items-center gap-4 pt-4">
               {/* Social Icons Placeholder - could use config urls */}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bebas text-xl text-white tracking-widest mb-4">Service Information</h4>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Gathering Times</span>
                <span className="text-slate-200 font-medium">{config.serviceTimes}</span>
              </div>
              <div className="flex flex-col pt-2">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Location</span>
                <address className="text-slate-200 font-medium not-italic">
                  {config.locationAddress}<br/>
                  <span className="text-xs text-slate-500">Near Spokane, WA</span>
                </address>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bebas text-xl text-white tracking-widest mb-4">Contact</h4>
            <div className="space-y-3">
              <p className="text-slate-200 font-medium">{config.locationPhone}</p>
              <p className="text-blue-400 font-medium">{config.locationEmail}</p>
              <div className="pt-4">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.locationAddress)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white border border-white/20 px-6 py-3 rounded-lg hover:bg-white hover:text-slate-900 transition-all">
                   Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center opacity-40 text-xs font-medium">
           <p className="tracking-wide">© {new Date().getFullYear()} {config.churchName}. Apostolic & Pentecostal Ministry.</p>
           <div className="flex items-center gap-2 mt-4 md:mt-0">
             <ShieldCheck className="w-4 h-4" />
             <span className="tracking-widest uppercase text-[10px] font-bold">Secure Kingdom Infrastructure</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
