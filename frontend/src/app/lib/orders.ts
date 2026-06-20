// Order action seam used by the UI. Delegates to the real API via @/lib/api.

import { ulasanApi, pesananApi, getCurrentPelangganId } from '@/lib/api';
import type { CreatePesananInput, Pesanan } from '@/lib/api';

export interface NewOrderInput {
    service: string;
    pickupAddress: string;
    notes?: string;
}

class NoSessionError extends Error {
    constructor() {
        super('Sesi tidak ditemukan. Silakan login kembali.');
        this.name = 'NoSessionError';
    }
}

/**
 * Create a new laundry order (POST /pelanggan/{id}/pesanan).
 *
 * NOTE: the documented contract takes line items ({ tarifId, kuantitas }), not the
 * legacy { service, pickupAddress } shape. The Add New Order page should build a
 * CreatePesananInput and call `createPesananFromItems` below. This wrapper is kept
 * only so existing callers compile; migrate them to the items-based call.
 */
export async function createOrder(userId: string, input: NewOrderInput): Promise<void> {
    void userId;
    void input;
    throw new Error(
        'createOrder(NewOrderInput) is not supported by the backend contract. ' +
            'Use createPesananFromItems(items, catatan) with tarif-based line items.',
    );
}

/** Create an order from real line items, per CUSTOMER_ENDPOINT.md. */
export async function createPesananFromItems(input: CreatePesananInput): Promise<Pesanan> {
    const pelangganId = getCurrentPelangganId();
    if (pelangganId === null) throw new NoSessionError();
    return pesananApi.createPesanan(pelangganId, input);
}

/**
 * Submit a rating (1–5) and review for a completed order.
 * POST /pelanggan/{id}/ulasan/{pesanan_id} (Trigger: Validasi Insert Ulasan).
 */
export async function rateOrder(
    userId: string,
    orderId: string,
    rating: number,
    review?: string,
): Promise<void> {
    void userId;
    const pelangganId = getCurrentPelangganId();
    if (pelangganId === null) throw new NoSessionError();
    const pesananId = Number(orderId);
    await ulasanApi.createUlasan(pelangganId, pesananId, { rating, komentar: review ?? '' });
}
