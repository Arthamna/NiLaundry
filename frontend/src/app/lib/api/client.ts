// Typed fetch wrapper for the NiLaundry backend.
//
// - Base URL comes from NEXT_PUBLIC_API_BASE_URL (see .env.local / .env.example).
// - Attaches the JWT as `Authorization: Bearer <token>` when authenticated.
// - Unwraps the { success, data, error } envelope and throws ApiError on failure.

import { ApiEnvelope } from './types';
import { getToken, clearSession } from './session';

export const API_BASE_URL: string =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

/** Error thrown for any non-successful API call. `status` is 0 for network errors. */
export class ApiError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    method?: HttpMethod;
    /** JSON-serializable request body. */
    body?: unknown;
    /** Attach the bearer token. Defaults to true. Set false for /auth routes. */
    auth?: boolean;
    signal?: AbortSignal;
}

/**
 * Perform an API request and return the unwrapped `data` payload.
 * @throws {ApiError} on network failure, non-2xx status, or `success: false`.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, auth = true, signal } = options;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (auth) {
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
            signal,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Network error';
        throw new ApiError(message, 0);
    }

    let envelope: ApiEnvelope<T> | null = null;
    try {
        envelope = (await response.json()) as ApiEnvelope<T>;
    } catch {
        // Body was empty or not JSON; handled below.
    }

    if (!response.ok || !envelope || envelope.success === false) {
        if (response.status === 401) clearSession();
        const message = envelope?.error ?? `Request failed with status ${response.status}`;
        throw new ApiError(message, response.status);
    }

    return envelope.data as T;
}

/** Human-friendly message for any thrown value (ApiError or otherwise). */
export function getApiErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    return 'Terjadi kesalahan. Coba lagi.';
}
