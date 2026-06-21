// Authentication endpoints.
//
//   POST /auth/register  -> register a new customer (pelanggan-only)
//   POST /auth/login     -> unified login (pelanggan or pengguna)
//
// Login persists the session via setSession(); the caller inspects the
// returned UnifiedAuthResponse.subjectType / role to decide where to redirect
// (customer dashboard vs the /branch admin console).

import { apiFetch } from './client';
import { setPelangganSession, setSession, clearSession } from './session';
import type { LoginInput, RegisterInput, RegisterResponse, UnifiedAuthResponse } from './types';

/**
 * POST /auth/login — log in and persist the session. Inspect
 * result.subjectType ('pelanggan' | 'pengguna') and result.role to route.
 */
export async function login(input: LoginInput): Promise<UnifiedAuthResponse> {
    const result = await apiFetch<UnifiedAuthResponse>('/auth/login', {
        method: 'POST',
        body: input,
        auth: false,
    });
    setSession(result);
    return result;
}

/** POST /auth/register — create a customer, then persist the JWT + customer. */
export async function register(input: RegisterInput): Promise<RegisterResponse> {
    const result = await apiFetch<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: input,
        auth: false,
    });
    setPelangganSession(result.token, result.pelanggan);
    return result;
}

/** Local logout — clears the stored session. No backend call is documented. */
export function logout(): void {
    clearSession();
}
