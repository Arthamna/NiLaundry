// Client-side auth session: the JWT and the logged-in customer's id_pelanggan.
//
// NOTE: a JWT in localStorage is readable by any XSS on the page. For a real
// production app prefer an httpOnly secure cookie. This is acceptable for the
// course project, and is the single seam to change if that hardening is needed.

import type { Pelanggan } from './types';

const TOKEN_KEY = 'nilaundry:token';
const PELANGGAN_ID_KEY = 'nilaundry:pelangganId';
const PELANGGAN_KEY = 'nilaundry:pelanggan';

const isBrowser = (): boolean => typeof window !== 'undefined';

/** The raw JWT, or null when logged out / on the server. */
export function getToken(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(TOKEN_KEY);
}

/** The logged-in customer's id_pelanggan, or null when logged out. */
export function getCurrentPelangganId(): number | null {
    if (!isBrowser()) return null;
    const raw = window.localStorage.getItem(PELANGGAN_ID_KEY);
    if (!raw) return null;
    const id = Number(raw);
    return Number.isFinite(id) ? id : null;
}

/** The cached logged-in customer profile, or null. */
export function getCachedPelanggan(): Pelanggan | null {
    if (!isBrowser()) return null;
    const raw = window.localStorage.getItem(PELANGGAN_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as Pelanggan;
    } catch {
        return null;
    }
}

/** Persist the session after a successful login/register. */
export function setSession(token: string, pelanggan: Pelanggan): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(PELANGGAN_ID_KEY, String(pelanggan.id));
    window.localStorage.setItem(PELANGGAN_KEY, JSON.stringify(pelanggan));
}

/** Clear all session data (logout, or after a 401). */
export function clearSession(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(PELANGGAN_ID_KEY);
    window.localStorage.removeItem(PELANGGAN_KEY);
}

export function isAuthenticated(): boolean {
    return getToken() !== null;
}
