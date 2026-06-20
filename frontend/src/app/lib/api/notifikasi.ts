// Inbox endpoint (CUSTOMER_ENDPOINT.md > Page: Inbox).
//
//   GET /pelanggan/{id}/notifikasi -> notifications for this customer

import { apiFetch } from './client';
import type { Notifikasi } from './types';

/** GET /pelanggan/{id}/notifikasi — list this customer's notifications. */
export async function listNotifikasi(
    pelangganId: number,
    signal?: AbortSignal,
): Promise<Notifikasi[]> {
    return apiFetch<Notifikasi[]>(`/pelanggan/${pelangganId}/notifikasi`, { signal });
}
