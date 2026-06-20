// Profile endpoints (CUSTOMER_ENDPOINT.md > Page: Profile).
//
//   GET /pelanggan/me  -> the currently logged-in customer
//   PUT /pelanggan/me  -> update the logged-in customer

import { apiFetch } from './client';
import type { Pelanggan, UpdatePelangganInput } from './types';

/** GET /pelanggan/me — fetch the logged-in customer's profile. */
export async function getMe(signal?: AbortSignal): Promise<Pelanggan> {
    return apiFetch<Pelanggan>('/pelanggan/me', { signal });
}

/** PUT /pelanggan/me — update the logged-in customer's profile. */
export async function updateMe(input: UpdatePelangganInput): Promise<Pelanggan> {
    return apiFetch<Pelanggan>('/pelanggan/me', { method: 'PUT', body: input });
}
