// Courier picker for the customer add-new-order page.
//
//   GET /pelanggan/{id}/kurir?page=&limit=
//
// The backend returns the kurir list joined with tipe_kendaraan so the UI
// can show name + plate + vehicle type. Used when the customer chooses
// pickup (jenisAmbil='pickup') or delivery (jenisAntar='delivery').

import { apiFetch } from './client';
import type { Kurir, OrderKurir } from './types';

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

/**
 * GET /pelanggan/{id}/pesanan/{pesananId}/kurir — the courier(s) assigned to
 * this order's pickup/delivery legs. Used by the order-detail courier card
 * when the order status is 'pickup' or 'delivery'. Returns [] when the order
 * has no courier (walk-in / self pick-up) or isn't owned by the customer.
 */
export async function getOrderKurir(
    pelangganId: number,
    pesananId: number,
    signal?: AbortSignal,
): Promise<OrderKurir[]> {
    return apiFetch<OrderKurir[]>(`/pelanggan/${pelangganId}/pesanan/${pesananId}/kurir`, { signal });
}
