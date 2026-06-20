// Per-user preference + profile persistence.
//
// These are PLACEHOLDER implementations. They currently persist to localStorage
// so the UI works end-to-end, but each function is the single seam to swap for a
// real DB/API call later (e.g. `await fetch('/api/users/:id/...')`).

export type Theme = 'light' | 'dark';

export interface ProfileData {
    nama: string;
    nomorTelepon: string;
    email: string;
    alamat: string;
}

const THEME_KEY = (userId: string) => `nilaundry:theme:${userId}`;
const PROFILE_KEY = (userId: string) => `nilaundry:profile:${userId}`;

/** Load the saved theme for a user. TODO: replace localStorage with a DB/API read. */
export async function getUserTheme(userId: string): Promise<Theme> {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem(THEME_KEY(userId));
    return stored === 'dark' ? 'dark' : 'light';
}

/** Persist the theme for a user. TODO: replace localStorage with a DB/API write. */
export async function saveUserTheme(userId: string, theme: Theme): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(THEME_KEY(userId), theme);
}

/** Load saved profile overrides for a user. TODO: replace localStorage with a DB/API read. */
export async function getUserProfile(userId: string): Promise<Partial<ProfileData>> {
    if (typeof window === 'undefined') return {};
    const stored = window.localStorage.getItem(PROFILE_KEY(userId));
    if (!stored) return {};
    try {
        return JSON.parse(stored) as Partial<ProfileData>;
    } catch {
        return {};
    }
}

/**
 * Persist a single profile field for a user.
 * TODO: replace with a real DB/API mutation (e.g. PATCH /api/users/:id).
 */
export async function updateUserProfileField(
    userId: string,
    field: keyof ProfileData,
    value: string,
): Promise<void> {
    if (typeof window === 'undefined') return;
    const current = await getUserProfile(userId);
    const next = { ...current, [field]: value };
    window.localStorage.setItem(PROFILE_KEY(userId), JSON.stringify(next));
}
