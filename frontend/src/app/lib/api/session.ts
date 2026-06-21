// Client-side auth session. Stores the JWT plus enough discriminator info
// (subjectType, role) for the UI to know whether the logged-in user is a
// pelanggan (customer) or a pengguna (admin / superadmin), and to render the
// right dashboard without re-fetching.
//
// NOTE: a JWT in localStorage is readable by any XSS on the page. For a real
// production app prefer an httpOnly secure cookie. This is acceptable for the
// course project, and is the single seam to change if that hardening is needed.

import type { Pelanggan, Pengguna, Role, SubjectType, UnifiedAuthResponse } from './types';

const TOKEN_KEY = 'nilaundry:token';
const SUBJECT_TYPE_KEY = 'nilaundry:subjectType';
const ROLE_KEY = 'nilaundry:role';
const PROFILE_KEY = 'nilaundry:profile';

const isBrowser = (): boolean => typeof window !== 'undefined';

/** The raw JWT, or null when logged out / on the server. */
export function getToken(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(TOKEN_KEY);
}

export function getSubjectType(): SubjectType | null {
    if (!isBrowser()) return null;
    const v = window.localStorage.getItem(SUBJECT_TYPE_KEY);
    return v === 'pelanggan' || v === 'pengguna' ? v : null;
}

export function getRole(): Role | null {
    if (!isBrowser()) return null;
    const v = window.localStorage.getItem(ROLE_KEY);
    return v === 'customer' || v === 'admin' || v === 'superadmin' ? v : null;
}

/** Cached profile for the logged-in subject, as Pelanggan or Pengguna depending on subjectType. */
export function getCachedProfile(): Pelanggan | Pengguna | null {
    if (!isBrowser()) return null;
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as Pelanggan | Pengguna;
    } catch {
        return null;
    }
}

/** Convenience: returns the cached customer profile only when logged in as one. */
export function getCachedPelanggan(): Pelanggan | null {
    if (getSubjectType() !== 'pelanggan') return null;
    return getCachedProfile() as Pelanggan | null;
}

/** Convenience: returns the cached pengguna profile only when logged in as one. */
export function getCachedPengguna(): Pengguna | null {
    if (getSubjectType() !== 'pengguna') return null;
    return getCachedProfile() as Pengguna | null;
}

/** The logged-in customer's id_pelanggan, or null when logged out / not a customer. */
export function getCurrentPelangganId(): number | null {
    const p = getCachedPelanggan();
    return p?.id ?? null;
}

/**
 * The logged-in branch admin's id_cabang — sourced from the pengguna profile
 * (role 'admin'). null for customers and for superadmins (who manage all branches).
 * Used to scope every /branch/{id_cabang}/... endpoint.
 */
export function getCurrentCabangId(): number | null {
    return getCachedPengguna()?.cabangId ?? null;
}

/** Persist the session after a successful login. Handles both subject types. */
export function setSession(result: UnifiedAuthResponse): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(TOKEN_KEY, result.token);
    window.localStorage.setItem(SUBJECT_TYPE_KEY, result.subjectType);
    window.localStorage.setItem(ROLE_KEY, result.role);
    const profile = result.subjectType === 'pelanggan' ? result.pelanggan : result.pengguna;
    if (profile) {
        window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } else {
        window.localStorage.removeItem(PROFILE_KEY);
    }
}

/** Persist a pelanggan-only session (used by /auth/register). */
export function setPelangganSession(token: string, pelanggan: Pelanggan): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(SUBJECT_TYPE_KEY, 'pelanggan');
    window.localStorage.setItem(ROLE_KEY, 'customer');
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(pelanggan));
}

/** Clear all session data (logout, or after a 401). */
export function clearSession(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(SUBJECT_TYPE_KEY);
    window.localStorage.removeItem(ROLE_KEY);
    window.localStorage.removeItem(PROFILE_KEY);
}

export function isAuthenticated(): boolean {
    return getToken() !== null;
}
