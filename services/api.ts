import {
    SiteConfig,
    Announcement,
    Devotional,
    Course,
    Book,
    Video,
    LandingPage,
    AffiliateLink,
    User,
    Servant,
    MinistrySchedule,
    EmailCampaign,
    WorshipSong,
    Asset,
    AssetFolder,
    StaffMember
} from '../types';

// Mock Delay to simulate network latency
const MOCK_DELAY = 500;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * MOCK API SERVICE
 * This service implements a clean async interface for all data operations.
 * It currently uses localStorage as a backing store but can be easily
 * swapped for Supabase, Firebase, or a custom REST API.
 */

const getFromStorage = <T>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error(`Failed to parse ${key} from storage`, e);
        return defaultValue;
    }
};

const saveToStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e: any) {
        if (e.name === 'QuotaExceededError') {
            alert("Storage limit reached. Please use external URLs for large assets.");
        }
        throw e;
    }
};

export const api = {
    // Site Configuration
    async getSiteConfig(): Promise<SiteConfig> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_site_config', {} as SiteConfig);
    },

    async updateSiteConfig(config: SiteConfig): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_site_config', config);
    },

    // Authentication & Users
    async getUsers(): Promise<User[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_all_users', []);
    },

    async saveUser(user: User): Promise<void> {
        await delay(MOCK_DELAY);
        const users = await this.getUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index >= 0) {
            users[index] = user;
        } else {
            users.push(user);
        }
        saveToStorage('jcbc_all_users', users);
    },

    // Announcements
    async getAnnouncements(): Promise<Announcement[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_announcements', []);
    },

    async saveAnnouncements(data: Announcement[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_announcements', data);
    },

    // Devotionals
    async getDevotionals(): Promise<Devotional[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_devotionals', []);
    },

    async saveDevotionals(data: Devotional[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_devotionals', data);
    },

    // Academy
    async getCourses(): Promise<Course[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_courses', []);
    },

    async saveCourses(data: Course[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_courses', data);
    },

    // Books / Store
    async getBooks(): Promise<Book[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_books', []);
    },

    async saveBooks(data: Book[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_books', data);
    },

    // Bible Studies
    async getBibleStudies(): Promise<Video[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_studies', []);
    },

    async saveBibleStudies(data: Video[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_studies', data);
    },

    // Landing Pages (Funnels)
    async getLandingPages(): Promise<LandingPage[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_landing_pages', []);
    },

    async saveLandingPages(data: LandingPage[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_landing_pages', data);
    },

    // Affiliates
    async getAffiliateLinks(): Promise<AffiliateLink[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_affiliate_links', []);
    },

    async saveAffiliateLinks(data: AffiliateLink[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_affiliate_links', data);
    },

    // Ministry & Staff
    async getStaff(): Promise<StaffMember[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_staff', []);
    },

    async saveStaff(data: StaffMember[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_staff', data);
    },

    async getServants(): Promise<Servant[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_servants', []);
    },

    async saveServants(data: Servant[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_servants', data);
    },

    async getSchedules(): Promise<MinistrySchedule[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_schedules', []);
    },

    async saveSchedules(data: MinistrySchedule[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_schedules', data);
    },

    // Communication
    async getEmailCampaigns(): Promise<EmailCampaign[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_email_campaigns', []);
    },

    async saveEmailCampaigns(data: EmailCampaign[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_email_campaigns', data);
    },

    async getWorshipSongs(): Promise<WorshipSong[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_worship_songs', []);
    },

    async saveWorshipSongs(data: WorshipSong[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_worship_songs', data);
    },

    // Assets
    async getAssets(): Promise<Asset[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_assets', []);
    },

    async saveAssets(data: Asset[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_assets', data);
    },

    async getFolders(): Promise<AssetFolder[]> {
        await delay(MOCK_DELAY);
        return getFromStorage('jcbc_folders', []);
    },

    async saveFolders(data: AssetFolder[]): Promise<void> {
        await delay(MOCK_DELAY);
        saveToStorage('jcbc_folders', data);
    }
};
