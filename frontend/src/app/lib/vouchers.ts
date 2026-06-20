// Voucher action seam used by the UI dialogs. Delegates to the real API
// (POST /pelanggan/{id}/voucher/klaim) via @/lib/api.

import { voucherApi, getCurrentPelangganId, getApiErrorMessage } from '@/lib/api';

export interface RedeemResult {
    success: boolean;
    message: string;
}

/**
 * Redeem (claim) a voucher code for the logged-in customer.
 * Stored Procedure: Klaim Voucher Pelanggan.
 *
 * `userId` is accepted for backward compatibility with existing callers but is
 * ignored — the customer is resolved from the auth session.
 */
export async function redeemVoucher(userId: string, code: string): Promise<RedeemResult> {
    void userId;
    const trimmed = code.trim();
    if (trimmed.length === 0) {
        return { success: false, message: 'Masukkan kode voucher terlebih dahulu.' };
    }

    const pelangganId = getCurrentPelangganId();
    if (pelangganId === null) {
        return { success: false, message: 'Sesi tidak ditemukan. Silakan login kembali.' };
    }

    try {
        const voucher = await voucherApi.claimVoucher(pelangganId, trimmed);
        return { success: true, message: `Kode "${voucher.kode}" berhasil ditukarkan.` };
    } catch (err: unknown) {
        return { success: false, message: getApiErrorMessage(err) };
    }
}
