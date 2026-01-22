
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteConfig } from './types';
import Layout from './components/Layout';
import PWAInstallPrompt from './components/PWAInstallPrompt';

import Home from './pages/Home';
import PrayerRequests from './pages/PrayerRequests';
import CommunityChat from './pages/CommunityChat';
import BibleStudy from './pages/BibleStudy';
import DailyDevotional from './pages/DailyDevotional';
import SaintsArmyPodcast from './pages/SaintsArmyPodcast';
import TruthBibleAcademy from './pages/TruthBibleAcademy';
import Announcements from './pages/Announcements';
import Giving from './pages/Giving';
import Store from './pages/Store';
import Staff from './pages/Staff';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import LandingPageViewer from './pages/LandingPageViewer';
import JCBCMusic from './pages/JCBCMusic';

import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';

const DEFAULT_CONFIG: SiteConfig = {
  churchName: "Jesus Culture Bible Church",
  legalChurchName: "Jesus Culture Bible Church, Inc.",
  logoText: "JCBC",
  logoImageUrl: "https://i.ibb.co/C3m2v3Y9/jcbc-logo.png",
  logoAlt: "Jesus Culture Bible Church Official Logo - Apostolic Ministry Spokane",
  splashBackgroundImageUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2000&auto=format&fit=crop",
  splashAlt: "JCBC Ministry Atmosphere - Deliverance and Dominion",
  faviconUrl: "https://i.ibb.co/C3m2v3Y9/jcbc-logo.png",
  appIconUrl: "https://i.ibb.co/C3m2v3Y9/jcbc-logo.png",
  serviceTimes: "Sundays @ 11:00 AM",
  locationAddress: "26811 N Yale Rd, Chattaroy, WA 99003",
  locationPhone: "(509) 555-0123",
  locationEmail: "office@jcbc.org",
  worshipLink: "https://www.youtube.com/@jcbcmusic",
  missionStatement: "To equip the remnant, reclaim the culture, and dominate the region for the Kingdom of God through the power of the Word and the Spirit.",
  visionStatement: "To see a global awakening where the culture of the Bible is restored.",
  denominationalAlignment: "Undenominational / Apostolic / Pentecostal",
  establishedDate: "Est. 2024",
  taxEin: "",
  globalCustomHtml: "",

  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  twitterUrl: "",
  tiktokUrl: "",

  primaryColor: "#1e3a8a",
  accentColor: "#3b82f6",
  secondaryColor: "#0f172a",
  backgroundColor: "#f8fafc",
  surfaceColor: "#ffffff",
  textPrimaryColor: "#1e293b",
  textSecondaryColor: "#64748b",
  remnantRadius: "2.5rem",
  headerStyle: "glass",
  baseFontSize: "16px",
  headingFont: "Bebas Neue",
  bodyFont: "Inter",

  welcomeTitle: "EQUIPPING THE REMNANT",
  welcomeSubtitle: "An Apostolic and Pentecostal hub near Spokane, WA. Continuing the John G. Lake legacy of Deliverance and Dominion.",
  welcomeVideoUrl: "https://youtu.be/Y2PblkqFaZE",
  welcomeVideoEmbedCode: "",
  homeCard1Title: "KINGDOM ASSEMBLY",
  homeCard1Body: "Apostolic worship and teaching every Sunday.",
  homeCard2Title: "CHURCH CAMPUS",
  homeCard2Body: "Located in Chattaroy, WA. Serving the Spokane Region.",
  homeCard3Title: "JCBC WORSHIP",
  homeCard3Body: "Prophetic sound of the Recovered Ministry.",
  homeCustomHtml: "",
  staffPageTitle: "Kingdom Leadership",
  staffPageSubtitle: "Meet the voices guiding the Remnant.",
  staffCustomHtml: "",
  announcementsTitle: "Kingdom Bulletins",
  announcementsSubtitle: "Stay informed with updates from the Elders.",
  announcementsCustomHtml: "",
  storeTitle: "Kingdom Resource Depot",
  storeSubtitle: "Authorized digital downloads: JGLM, Discipleship, and Theology.",
  storeCustomHtml: "",
  devotionalPageTitle: "RhemaFire",
  devotionalPageSubtitle: "Daily Prophetic Devotionals for Dominion.",
  devotionalBannerText: "RhemaFire Broadcast",
  devotionalCustomHtml: "",
  podcastTitle: "Saints Army Podcast",
  podcastSubtitle: "Equipping the Remnant. Reclaiming the Culture. Deliverance & Discipleship.",
  podcastBannerImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2000&auto=format&fit=crop",
  podcastBannerAlt: "Saints Army Podcast HQ - Spokane WA",
  podcastSchedule: "Wednesdays @ 7:00 PM PST",
  podcastYoutubeLink: "https://www.youtube.com/@SaintsArmyPodcast",
  podcastFacebookLink: "https://www.facebook.com/SaintsArmyPodcast",
  pastorFacebookLink: "https://www.facebook.com/pastorjoshuadavid",
  pastorBioTitle: "Pastor Joshua David",
  pastorBioBody: "Leadership behind JCBC and the Saints Army© Podcast. Teaching Dominion Theology and Kingdom Discipleship.",
  podcastCustomHtml: "",
  academyTitle: "Truth Bible Academy",
  academySubtitle: "A premium online educational platform for Apostolic Discipleship.",
  academyBannerImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2000&auto=format&fit=crop",
  academyBannerAlt: "Truth Bible Academy Classroom - Biblical Studies",
  academyBenefit1: "Private Prayer List",
  academyBenefit2: "Exclusive Free E-Book",
  academyBenefit3: "Early Access Content",
  academyBenefit4: "Full Library Access",
  academyPriceText: "Enrolment Fee",
  academyMonthlyPrice: "27.00",
  academyJoinButtonText: "Join Academy",
  academyScholarshipText: "Your donation assists in Kingdom work.",
  instructorBio: "Pastor Joshua David is deeply educated in the Word.",
  academyCustomHtml: "",
  givingTitle: "Online Giving",
  givingSubtitle: "“Each one should give what he has decided in his heart to give.”",
  givingUrl: "https://www.churchcenter.com/giving",
  givingBodyTitle: "Tithe & Offering",
  givingBodyText: "Your generosity fuels the Gospel in Spokane and beyond.",
  givingBenefit1: "Global Missions",
  givingBenefit2: "Community Outreach",
  givingBenefit3: "Academy Scholarships",
  givingBenefit4: "Regional Revival",
  givingButtonText: "Give Online",
  givingSecureTitle: "Secure Processing",
  givingSecureText: "All donations are encrypted.",
  givingTheologyTitle: "Restoration View",
  givingTheologyText: "Giving is an act of worship and dominion.",
  givingCustomHtml: "",
  prayerTitle: "Send a Prayer Request",
  prayerSubtitle: "Intercessors are standing by for deliverance and healing.",
  prayerPlaceholder: "Write your request...",
  prayerFeedTitle: "Prayer Feed",
  prayerCustomHtml: "",
  communityTitle: "JCBC Connect",
  communitySubtitle: "Moderated community chat for the Remnant.",
  chatRules: "Welcome! Maintain the honor of the House.",
  chatJoinButtonText: "Join Chat",
  communityCustomHtml: "",
  studyLibraryTitle: "Study Library",
  studyLibrarySubtitle: "Archived teachings on John G. Lake, Healing, and Dominion.",
  studyRegisterButtonText: "Register Study",
  studyCustomHtml: "",
  worshipTeamTitle: "JCBC Worship",
  worshipTeamSubtitle: "Prophetic Sound of the Remnant.",
  worshipCustomHtml: "",
  automationProvider: 'internal',
  automationApiKey: '',
  automationListId: '',
  leadCaptureActive: false,
  leadCaptureTitle: 'Join the Remnant Culture',
  leadCaptureSubtitle: 'Receive RhemaFire updates directly to your inbox.',
  seoDescription: "Jesus Culture Bible Church in Chattaroy, WA. An Apostolic, Pentecostal, and Undenominational ministry near Spokane. Continuing the legacy of John G. Lake (JGLM) through deliverance, discipleship, and dominion.",
  seoKeywords: "Churches Near Spokane WA, John G. Lake, JGLM, Chattaroy Churches, Apostolic Church, Pentecostal, Undenominational, Deliverance, Discipleship, Dominion, Recovered Ministry, Healing Rooms, Jesus Culture Bible Church",
  schemaJsonLd: "",
  googleAnalyticsId: "",
  ogImage: "https://i.ibb.co/C3m2v3Y9/jcbc-logo.png"
};

const CinematicIntro: React.FC<{ onComplete: () => void, logoUrl: string, backgroundImage: string }> = ({ onComplete, logoUrl, backgroundImage }) => {
  const [fade, setFade] = useState(false);
  const [scale, setScale] = useState(false);

  useEffect(() => {
    const scaleTimer = setTimeout(() => setScale(true), 100);
    const timer = setTimeout(() => setFade(true), 2800);
    const completeTimer = setTimeout(onComplete, 3600);
    return () => {
      clearTimeout(scaleTimer);
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center transition-opacity duration-1000 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {backgroundImage && (
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] ease-out ${scale ? 'scale-110' : 'scale-100'}`}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/40 to-slate-900/90 backdrop-blur-[2px]" />
      <div className="relative text-center space-y-8 animate-fade-in px-8 z-10">
        <div className="relative inline-block">
          {logoUrl && (
            <img src={logoUrl} alt="JCBC Apostolic Church Spokane" className="w-32 md:w-48 h-auto mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
          )}
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full -z-10 animate-pulse" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-bebas text-white tracking-[0.2em] drop-shadow-2xl">Jesus Culture Bible Church</h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-[1px] w-8 md:w-16 bg-white/30" />
            <p className="text-[10px] md:text-[12px] font-black text-blue-200 uppercase tracking-[0.4em] italic drop-shadow-lg">Apostolic Ministry in Chattaroy, WA</p>
            <div className="h-[1px] w-8 md:w-16 bg-white/30" />
          </div>
        </div>
        <div className="pt-12">
          <div className="w-48 h-1 bg-white/10 mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 w-1/3 animate-[progress_3.5s_linear_forwards]" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const storedConfig = await api.getSiteConfig();
        if (storedConfig && Object.keys(storedConfig).length > 0) {
          setConfig({ ...DEFAULT_CONFIG, ...storedConfig });
        } else {
          setConfig(DEFAULT_CONFIG);
        }
      } catch (error) {
        console.error("Failed to load site config", error);
        setConfig(DEFAULT_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();

    const hasSeenSplash = sessionStorage.getItem('jcbc_splash_seen');
    if (!hasSeenSplash) setShowSplash(true);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('jcbc_splash_seen', 'true');
  };

  const updateConfig = async (c: SiteConfig) => {
    try {
      await api.updateSiteConfig(c);
      setConfig(c);
    } catch (e: any) {
      console.error("Config Save Failed:", e);
    }
  };

  if (loading || authLoading) return <div className="h-screen flex items-center justify-center bg-blue-900 font-bebas text-2xl text-white animate-pulse">Establishing Frequency...</div>;

  return (
    <>
      {showSplash && (
        <CinematicIntro
          onComplete={handleSplashComplete}
          logoUrl={config.logoImageUrl || DEFAULT_CONFIG.logoImageUrl}
          backgroundImage={config.splashBackgroundImageUrl || DEFAULT_CONFIG.splashBackgroundImageUrl}
        />
      )}
      <Router>
        <Routes>
          <Route path="/login" element={<Login logoUrl={config.logoImageUrl} />} />
          <Route path="/register" element={<Register logoUrl={config.logoImageUrl} />} />
          <Route path="/p/:slug" element={<LandingPageViewer config={config} />} />
          <Route element={<Layout user={user} config={config} onLogout={logout} />}>
            <Route path="/" element={<Home config={config} user={user} />} />
            <Route path="/devotionals" element={<DailyDevotional config={config} user={user} />} />
            <Route path="/announcements" element={<Announcements user={user} config={config} />} />
            <Route path="/podcast" element={<SaintsArmyPodcast config={config} user={user} />} />
            <Route path="/academy/*" element={<TruthBibleAcademy user={user} config={config} />} />
            <Route path="/prayer" element={<PrayerRequests user={user} config={config} />} />
            <Route path="/giving" element={<Giving config={config} />} />
            <Route path="/store" element={<Store config={config} user={user} />} />
            <Route path="/staff" element={<Staff config={config} user={user} />} />
            <Route path="/chat" element={<CommunityChat user={user} config={config} onUpdateUser={() => { }} />} />
            <Route path="/bible-study" element={<BibleStudy config={config} user={user} />} />
            <Route path="/music" element={<JCBCMusic config={config} user={user} />} />
            <Route path="/admin" element={<AdminPanel user={user} config={config} onUpdateConfig={updateConfig} onUpdateUser={() => { }} />} />
          </Route>
        </Routes>
        <PWAInstallPrompt />
      </Router>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;


export default App;
