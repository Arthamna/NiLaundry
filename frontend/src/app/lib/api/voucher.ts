// Voucher endpoints (CUSTOMER_ENDPOINT.md > Home, Voucher, Payment).
//
//   GET  /pelanggan/{id}/voucher        -> list the customer's vouchers
//   GET  /pelanggan/{id}/voucher/hemat  -> total savings (HitungTotalHematVoucher)
//   POST /pelanggan/{id}/voucher/klaim  -> claim a voucher (SP: Klaim Voucher Pelanggan)

import { apiFetch } from './client';
import type { Voucher, VoucherHemat } from './types';

/** Which set of vouchers to list. Maps to the backend `?scope=` query. */
export type VoucherScope = 'available' | 'owned';

/**
 * GET /pelanggan/{id}/voucher — vouchers for the customer.
 *  - 'available' (default): claimable vouchers (valid, quota left, not yet used).
 *  - 'owned': vouchers the customer has already claimed (voucher_pelanggan),
 *    used by "My Vouchers" and the payment picker.
 */
export async function listVouchers(
    pelangganId: number,
    scope: VoucherScope = 'available',
    signal?: AbortSignal,
): Promise<Voucher[]> {
    const q = scope === 'owned' ? '?scope=owned' : '';
    return apiFetch<Voucher[]>(`/pelanggan/${pelangganId}/voucher${q}`, { signal });
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
