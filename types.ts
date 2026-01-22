
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'pastor' | 'staff' | 'worship' | 'member';
  isOptedInChat: boolean;
  isEnrolled?: boolean;
  joinedDate?: string;
  phoneNumber?: string;
  ministryTeam?: 'worship' | 'ushers' | 'kids' | 'prayer' | 'media' | 'none';
  progress?: UserProgress; // New: Track student journey
}

export interface UserProgress {
  completedLessons: string[]; // Array of Lesson IDs
  enrolledCourses: string[]; // Array of Course IDs
  certificates: string[]; // Array of Course IDs completed
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  email?: string;
  order: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  priority: 'normal' | 'urgent';
  author: string;
  heroImage?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: string;
  coverImage: string;
  epubUrl: string;
  pdfUrl: string;
  isFree?: boolean;
}

export interface AffiliateLink {
  id: string;
  label: string;
  url: string;
  placement: 'bulletin_sidebar' | 'academy_header' | 'community_footer' | 'global_sidebar';
  isActive: boolean;
  icon?: string;
}

export interface AssetFolder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface Asset {
  id: string;
  name: string; // File name
  data: string; // Base64 or URL
  type: 'image' | 'video' | 'document' | 'audio';
  folderId: string | null; // ID of the AssetFolder or null for root
  altText?: string; // SEO Alt
  title?: string; // SEO Title
  description?: string; // Caption/Description
  width?: number;
  height?: number;
  size?: string; // e.g. "2.4 MB"
  timestamp: number;
}

export interface PrayerRequest {
  id: string;
  userId: string;
  userName: string;
  request: string;
  timestamp: number;
  likes: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  text: string;
  timestamp: number;
}

export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  type: 'lead_magnet' | 'sales_page' | 'upsell' | 'downsell' | 'thank_you' | 'webinar';
  
  // Conversion / Lead Gen
  showCaptureForm: boolean;
  captureTitle: string;
  captureButtonText: string;
  redirectUrl?: string; // Where to go after conversion (Funnel Step 2)
  
  // Sales
  price?: string; 
  productName?: string;
  checkoutUrl?: string;

  // Analytics
  views: number;
  conversions: number;
  
  // Tech
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  customCss?: string;
  headScripts?: string; // For pixels/tracking
  template?: 'blank' | 'modern_vsl' | 'classic_squeeze' | 'dark_webinar';
}

export interface EmailCampaign {
  id: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  sentDate?: string;
  targetList: 'all' | 'members' | 'leads';
}

export interface Servant {
  id: string;
  name: string;
  role: 'worship' | 'ushers' | 'kids' | 'media' | 'prayer';
  email: string;
  phone: string;
  availability: string;
}

export interface MinistrySchedule {
  id: string;
  date: string;
  event: string;
  assignments: {
    worshipLeader?: string;
    media?: string;
    kids?: string;
    ushers?: string;
  };
}

export interface WorshipSong {
  id: string;
  title: string;
  artist: string;
  key: string;
  tempo: string;
  lyrics: string;
  youtubeLink?: string;
  chordChartUrl?: string;
}

export interface SiteConfig {
  // Global & Identity
  churchName: string;
  legalChurchName: string;
  logoText: string;
  logoImageUrl: string;
  logoAlt: string;
  splashBackgroundImageUrl: string;
  splashAlt: string;
  faviconUrl: string;
  appIconUrl: string;
  serviceTimes: string;
  locationAddress: string;
  locationPhone: string;
  locationEmail: string;
  worshipLink: string;
  missionStatement: string;
  visionStatement: string;
  denominationalAlignment: string;
  establishedDate: string;
  taxEin: string;
  globalCustomHtml: string;
  
  // Social Nodes
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  tiktokUrl: string;

  // Theme Architect
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  remnantRadius: string;
  headerStyle: 'flat' | 'glass' | 'bold';
  baseFontSize: string;
  headingFont: string;
  bodyFont: string;

  // Home Page
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeVideoUrl: string;
  welcomeVideoEmbedCode: string;
  homeCard1Title: string;
  homeCard1Body: string;
  homeCard2Title: string;
  homeCard2Body: string;
  homeCard3Title: string;
  homeCard3Body: string;
  homeCustomHtml: string;

  // Staff Page
  staffPageTitle: string;
  staffPageSubtitle: string;
  staffCustomHtml: string;

  // Announcements
  announcementsTitle: string;
  announcementsSubtitle: string;
  announcementsCustomHtml: string;

  // Store
  storeTitle: string;
  storeSubtitle: string;
  storeCustomHtml: string;

  // RhemaFire
  devotionalPageTitle: string;
  devotionalPageSubtitle: string;
  devotionalBannerText: string;
  devotionalCustomHtml: string;

  // Podcast
  podcastTitle: string;
  podcastSubtitle: string;
  podcastBannerImage: string;
  podcastBannerAlt: string;
  podcastSchedule: string;
  podcastYoutubeLink: string;
  podcastFacebookLink: string;
  pastorFacebookLink: string;
  pastorBioTitle: string;
  pastorBioBody: string;
  podcastCustomHtml: string;

  // Academy
  academyTitle: string;
  academySubtitle: string;
  academyBannerImage: string;
  academyBannerAlt: string;
  academyBenefit1: string;
  academyBenefit2: string;
  academyBenefit3: string;
  academyBenefit4: string;
  academyPriceText: string;
  academyMonthlyPrice: string;
  academyJoinButtonText: string;
  academyScholarshipText: string;
  instructorBio: string;
  academyCustomHtml: string;

  // Giving
  givingTitle: string;
  givingSubtitle: string;
  givingUrl: string;
  givingBodyTitle: string;
  givingBodyText: string;
  givingBenefit1: string;
  givingBenefit2: string;
  givingBenefit3: string;
  givingBenefit4: string;
  givingButtonText: string;
  givingSecureTitle: string;
  givingSecureText: string;
  givingTheologyTitle: string;
  givingTheologyText: string;
  givingCustomHtml: string;

  // Prayer
  prayerTitle: string;
  prayerSubtitle: string;
  prayerPlaceholder: string;
  prayerFeedTitle: string;
  prayerCustomHtml: string;

  // Community
  communityTitle: string;
  communitySubtitle: string;
  chatRules: string;
  chatJoinButtonText: string;
  communityCustomHtml: string;

  // Bible Study
  studyLibraryTitle: string;
  studyLibrarySubtitle: string;
  studyRegisterButtonText: string;
  studyCustomHtml: string;

  // Worship Team
  worshipTeamTitle: string;
  worshipTeamSubtitle: string;
  worshipCustomHtml: string;

  // Growth & Automation
  automationProvider: 'internal' | 'mailchimp' | 'aweber' | 'getresponse';
  automationApiKey: string;
  automationListId: string;
  leadCaptureActive: boolean;
  leadCaptureTitle: string;
  leadCaptureSubtitle: string;

  // SEO/AEO Global
  seoDescription: string;
  seoKeywords: string;
  schemaJsonLd: string;
  googleAnalyticsId: string;
  ogImage: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  description: string;
  thumbnail: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
  category: 'Theology' | 'Prophecy' | 'Leadership' | 'Culture' | 'Family';
  price: string; // "0" for free
  status: 'draft' | 'published' | 'archived';
  lessons: Lesson[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface Lesson {
  id: string;
  title: string;
  youtubeId: string;
  duration: string; // e.g. "15 min"
  notes: string; // Rich Text
  order: number;
  isFreePreview?: boolean;
  resources?: { name: string; url: string; type: 'pdf' | 'link' }[];
}

export interface Devotional {
  id: string;
  title: string;
  series: string;
  date: string;
  ytId: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  category: BibleStudyCategory;
  date: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export type BibleStudyCategory = 'Theology' | 'Evangelism' | 'Youth' | 'Family' | 'Worship' | 'Prophecy' | 'General';
