// Review endpoints (CUSTOMER_ENDPOINT.md > Order, Order Detail, Review).
//
//   GET  /pelanggan/{id}/ulasan               -> all reviews a customer has written
//   GET  /pelanggan/{id}/ulasan/{id_pesanan}  -> the review for one order, if any
//   POST /pelanggan/{id}/ulasan/{pesanan_id}  -> add a review (Trigger: Validasi Insert Ulasan)

import { apiFetch } from './client';
import type { CreateUlasanInput, Ulasan } from './types';

/** GET /pelanggan/{id}/ulasan — list every review this customer has written. */
export async function listUlasan(pelangganId: number, signal?: AbortSignal): Promise<Ulasan[]> {
    return apiFetch<Ulasan[]>(`/pelanggan/${pelangganId}/ulasan`, { signal });
}

/** GET /pelanggan/{id}/ulasan/{id_pesanan} — the review for one order, or null. */
export async function getUlasanForPesanan(
    pelangganId: number,
    pesananId: number,
    signal?: AbortSignal,
): Promise<Ulasan | null> {
    return apiFetch<Ulasan | null>(`/pelanggan/${pelangganId}/ulasan/${pesananId}`, { signal });
}

/** POST /pelanggan/{id}/ulasan/{pesanan_id} — add a review to an order. */
export async function createUlasan(
    pelangganId: number,
    pesananId: number,
    input: CreateUlasanInput,
): Promise<Ulasan> {
    return apiFetch<Ulasan>(`/pelanggan/${pelangganId}/ulasan/${pesananId}`, {
        method: 'POST',
        body: input,
    });
}
