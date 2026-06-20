// Authentication endpoints (CUSTOMER_ENDPOINT.md > Authentication).
//
//   POST /auth/register  -> register a new customer
//   POST /auth/login     -> log a customer in
//
// Both return { token, pelanggan }; we persist the session on success.

import { apiFetch } from './client';
import { setSession, clearSession } from './session';
import type { AuthResponse, LoginInput, RegisterInput } from './types';

/** POST /auth/login — log in and persist the JWT + customer. */
export async function login(input: LoginInput): Promise<AuthResponse> {
    const result = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: input,
        auth: false,
    });
    setSession(result.token, result.pelanggan);
    return result;
}

/** POST /auth/register — create a customer, then persist the JWT + customer. */
export async function register(input: RegisterInput): Promise<AuthResponse> {
    const result = await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: input,
        auth: false,
    });
    setSession(result.token, result.pelanggan);
    return result;
}

/** Local logout — clears the stored session. No backend call is documented. */
export function logout(): void {
    clearSession();
}
