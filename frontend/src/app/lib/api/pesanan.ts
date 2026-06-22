// Order endpoints (CUSTOMER_ENDPOINT.md > Home, Order, Order Detail, Add New Order).
//
//   GET  /pelanggan/{id}/pesanan                 -> list a customer's orders
//   GET  /pelanggan/{id}/pesanan/{id_pesanan}    -> one order's detail
//   GET  /pelanggan/{id}/pesanan/subtotal        -> compute subtotal (HitungSubtotalPesanan)
//   POST /pelanggan/{id}/pesanan                 -> create an order (voucher=null, payment=pending)

import { apiFetch } from './client';
import type {
    CreatePesananInput,
    ItemPesananInput,
    KatalogCabang,
    Pesanan,
    PesananDetail,
    SubtotalPesanan,
} from './types';

/**
 * GET /katalog — branches with their sellable services (tarif + layanan), used
 * by the "create new order" form. Replaces the previously hardcoded catalog.
 */
export async function getKatalog(signal?: AbortSignal): Promise<KatalogCabang[]> {
    return apiFetch<KatalogCabang[]>('/katalog', { signal });
}

/**
 * GET /pelanggan/{id}/pesanan — list a customer's orders.
 * Pass `status` to filter server-side (the UI mainly needs 'active' and 'selesai').
 */
export async function listPesanan(
    pelangganId: number,
    status?: string,
    signal?: AbortSignal,
): Promise<Pesanan[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiFetch<Pesanan[]>(`/pelanggan/${pelangganId}/pesanan${query}`, { signal });
}

/** GET /pelanggan/{id}/pesanan/{id_pesanan} — detail of one order. */
export async function getPesanan(
    pelangganId: number,
    pesananId: number,
    signal?: AbortSignal,
): Promise<PesananDetail> {
    return apiFetch<PesananDetail>(`/pelanggan/${pelangganId}/pesanan/${pesananId}`, { signal });
}

/**
 * GET /pelanggan/{id}/pesanan/subtotal — preview the subtotal for a set of line
 * items before the order exists (Function: HitungSubtotalPesanan). Items are sent
 * as a JSON-encoded `items` query param.
 */
export async function getSubtotal(
    pelangganId: number,
    items: ItemPesananInput[],
    signal?: AbortSignal,
): Promise<SubtotalPesanan> {
    const query = `?items=${encodeURIComponent(JSON.stringify(items))}`;
    return apiFetch<SubtotalPesanan>(`/pelanggan/${pelangganId}/pesanan/subtotal${query}`, {
        signal,
    });
}

/** POST /pelanggan/{id}/pesanan — create a new order. */
export async function createPesanan(
    pelangganId: number,
    input: CreatePesananInput,
): Promise<Pesanan> {
    return apiFetch<Pesanan>(`/pelanggan/${pelangganId}/pesanan`, {
        method: 'POST',
        body: input,
    });
}
