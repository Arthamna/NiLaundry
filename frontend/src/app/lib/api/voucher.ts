// Voucher endpoints (CUSTOMER_ENDPOINT.md > Home, Voucher, Payment).
//
//   GET  /pelanggan/{id}/voucher        -> list the customer's vouchers
//   GET  /pelanggan/{id}/voucher/hemat  -> total savings (HitungTotalHematVoucher)
//   POST /pelanggan/{id}/voucher/klaim  -> claim a voucher (SP: Klaim Voucher Pelanggan)

import { apiFetch } from './client';
import type { Voucher, VoucherHemat } from './types';

/**
 * GET /pelanggan/{id}/voucher — vouchers belonging to / available to the customer.
 * (On Home this is the set of usable, not-yet-used vouchers; on the Voucher and
 * Payment pages it is the customer's owned vouchers. Same endpoint either way.)
 */
export async function listVouchers(
    pelangganId: number,
    signal?: AbortSignal,
): Promise<Voucher[]> {
    return apiFetch<Voucher[]>(`/pelanggan/${pelangganId}/voucher`, { signal });
}

/** GET /pelanggan/{id}/voucher/hemat — total discount value already used. */
export async function getTotalHemat(
    pelangganId: number,
    signal?: AbortSignal,
): Promise<VoucherHemat> {
    return apiFetch<VoucherHemat>(`/pelanggan/${pelangganId}/voucher/hemat`, { signal });
}

/** POST /pelanggan/{id}/voucher/klaim — claim a voucher by its code. */
export async function claimVoucher(pelangganId: number, kode: string): Promise<Voucher> {
    return apiFetch<Voucher>(`/pelanggan/${pelangganId}/voucher/klaim`, {
        method: 'POST',
        body: { kode },
    });
}
