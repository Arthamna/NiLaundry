// Courier picker for the customer add-new-order page.
//
//   GET /pelanggan/{id}/kurir?page=&limit=
//
// The backend returns the kurir list joined with tipe_kendaraan so the UI
// can show name + plate + vehicle type. Used when the customer chooses
// pickup (jenisAmbil='pickup') or delivery (jenisAntar='delivery').

import { apiFetch } from './client';
import type { Kurir } from './types';

export async function listKurir(
    pelangganId: number,
    params: { page?: number; limit?: number } = {},
    signal?: AbortSignal,
): Promise<Kurir[]> {
    const search = new URLSearchParams();
    if (params.page !== undefined) search.set('page', String(params.page));
    if (params.limit !== undefined) search.set('limit', String(params.limit));
    const qs = search.toString();
    const query = qs ? `?${qs}` : '';
    return apiFetch<Kurir[]>(`/pelanggan/${pelangganId}/kurir${query}`, { signal });
}
