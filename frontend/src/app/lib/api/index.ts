// Barrel for the NiLaundry API client. Import from '@/lib/api'.

export * from './types';
export { API_BASE_URL, ApiError, apiFetch, getApiErrorMessage } from './client';
export {
    getToken,
    getCurrentPelangganId,
    getCachedPelanggan,
    setSession,
    clearSession,
    isAuthenticated,
} from './session';

export * as authApi from './auth';
export * as pelangganApi from './pelanggan';
export * as pesananApi from './pesanan';
export * as voucherApi from './voucher';
export * as ulasanApi from './ulasan';
export * as notifikasiApi from './notifikasi';
export * as pembayaranApi from './pembayaran';
