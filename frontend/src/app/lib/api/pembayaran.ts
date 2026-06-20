// Payment endpoint (CUSTOMER_ENDPOINT.md > Page: Payment).
//
//   POST /pelanggan/{id}/pembayaran/konfirmasi
//     Confirm payment -> sets pembayaran.status = 'paid' and writes the chosen
//     voucher_id onto the pesanan.

import { apiFetch } from './client';
import type { KonfirmasiPembayaranInput, Pembayaran } from './types';

/** POST /pelanggan/{id}/pembayaran/konfirmasi — confirm payment for an order. */
export async function konfirmasiPembayaran(
    pelangganId: number,
    input: KonfirmasiPembayaranInput,
): Promise<Pembayaran> {
    return apiFetch<Pembayaran>(`/pelanggan/${pelangganId}/pembayaran/konfirmasi`, {
        method: 'POST',
        body: input,
    });
}
