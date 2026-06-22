// Superadmin endpoints — every route lives under `/admin/...` and requires a
// superadmin JWT (see middleware.RequireSuperAdmin on the backend). These back
// the `(user)/admin/*` pages: dashboard, orders, services, vouchers, staffs,
// couriers, customers, branches and payments.
//
// Wire shapes mirror backend/internal/dtos/superadmin.go one-for-one. Data
// values (names, addresses, notes) stay as stored in the database; only UI
// chrome is rendered in English.

import { apiFetch } from './client';

// ============================================================================
// Types — camelCase to match the backend JSON tags.
// ============================================================================

// --- Dashboard --------------------------------------------------------------

export interface SuperStatistikUmum {
    revenueToday: number;
    revenueThisMonth: number;
    orderToday: number;
    averageRating: number;
}

export interface SuperStatistikLayanan {
    idLayanan: number;
    namaLayanan: string;
    totalPesanan: number;
    totalRevenue: number;
}

export interface SuperTopCabang {
    idCabang: number;
    namaCabang: string;
    totalOrder: number;
    totalRevenue: number;
}

export interface SuperPaymentMix {
    metode: string;
    totalEntries: number;
    persentase: number;
}

export interface SuperLiveOrdersPerCabang {
    idCabang: number;
    namaCabang: string;
    totalLiveOrders: number;
}

// --- Orders -----------------------------------------------------------------

export interface SuperPesanan {
    id: number;
    jumlahItem: number;
    status: string;
    catatan: string;
    estimasiSelesai: string;
    totalHarga: number;
    pelangganId: number;
    voucherId: number | null;
    pegawaiId: number;
    namaPelanggan: string;
    noTelpPelanggan: string;
    namaPegawai: string;
    namaCabang: string;
    idCabang: number;
}

export interface SuperOrdersStats {
    total: number;
    pickup: number;
    processing: number;
    delivery: number;
    completed: number;
}

// --- Vouchers ---------------------------------------------------------------

export interface SuperVoucher {
    id: number;
    kode: string;
    tipeDiskon: string;
    nilaiDiskon: number;
    minPembelian: number;
    berlakuHingga: string;
    kuota: number;
    terpakai: number;
}

export interface SuperVoucherStat {
    activeVoucherWeek: number;
    totalCustomerSave: number;
    waktuKadaluarsaTerdekat: string;
    waktuKadaluarsaTerdekatHours: number;
}

export interface CreateVoucherInput {
    kode: string;
    tipeDiskon: string;
    nilaiDiskon: number;
    minPembelian: number;
    berlakuHingga: string; // ISO 8601
    kuota: number;
}

export type UpdateVoucherInput = Partial<CreateVoucherInput>;

// --- Staffs -----------------------------------------------------------------

export interface SuperPegawai {
    id: number;
    nama: string;
    email: string;
    noTelp: string;
    alamat: string;
    cabangId: number;
    cabangNama: string;
}

export interface CreatePegawaiInput {
    nama: string;
    email: string;
    noTelp: string;
    alamat: string;
    cabangId: number;
}

export type UpdatePegawaiInput = Partial<CreatePegawaiInput>;

// --- Couriers ---------------------------------------------------------------

export interface SuperKurir {
    id: number;
    nama: string;
    noTelp: string;
    noPlat: string;
    tipeKendaraanId: number;
    jenisKendaraan: string;
}

export interface CreateKurirInput {
    nama: string;
    noTelp: string;
    noPlat: string;
    tipeKendaraanId: number;
}

export type UpdateKurirInput = Partial<CreateKurirInput>;

export interface SuperTipeKendaraan {
    id: number;
    jenisKendaraan: string;
}

// --- Branches ---------------------------------------------------------------

export interface SuperCabang {
    id: number;
    nama: string;
    alamat: string;
    noTelp: string;
    jamBuka: string;
    jamTutup: string;
}

export interface SuperCabangPerformance {
    idCabang: number;
    namaCabang: string;
    totalOrder: number;
    totalRevenue: number;
    totalPaid: number;
}

export interface SuperCabangService {
    idLayanan: number;
    namaLayanan: string;
    satuanLayanan: string;
    deskripsiLayanan: string | null;
    idTarif: number;
    hargaPerSatuan: number;
    totalItem: number;
    totalRevenue: number;
}

export interface CreateCabangInput {
    nama: string;
    alamat: string;
    noTelp: string;
    jamBuka: string;
    jamTutup: string;
}

export type UpdateCabangInput = Partial<CreateCabangInput>;

export interface CreateTarifInput {
    hargaPerSatuan: number;
    layananIdLayanan: number;
}

export interface UpdateTarifInput {
    idTarif: number;
    hargaPerSatuan?: number;
    layananIdLayanan?: number;
}

export interface SuperBranchReview {
    id: number;
    rating: number;
    komentar: string;
    pesananId: number;
    pelangganNama: string;
    pegawaiNama: string;
    layananNama: string | null;
}

// --- Payments ---------------------------------------------------------------

export interface SuperPayment {
    id: number;
    pesananId: number;
    pelangganNama: string;
    pelangganNoTelp: string;
    waktu: string;
    metode: string;
    jumlah: number;
    namaCabang: string;
}

// --- Customers --------------------------------------------------------------

export interface SuperCustomer {
    id: number;
    nama: string;
    email: string;
    noTelp: string;
    alamat: string;
    totalOrder: number;
    totalSpend: number;
    avgRating: number;
    lastOrder: string | null;
}

export interface SuperCustomerOrderHistory {
    id: number;
    status: string;
    totalHarga: number;
    estimasiSelesai: string;
    namaCabang: string;
}

export interface SuperCustomerDetail extends SuperCustomer {
    orderHistory: SuperCustomerOrderHistory[];
}

// --- Catalog ----------------------------------------------------------------

export interface SuperLayanan {
    id: number;
    nama: string;
    satuan: string;
    deskripsi: string | null;
}

// ============================================================================
// Fetch functions
// ============================================================================

// --- Dashboard --------------------------------------------------------------

export const getStatistikUmum = (signal?: AbortSignal) =>
    apiFetch<SuperStatistikUmum>('/admin/statistik-umum', { signal });

export const getStatistikLayanan = (signal?: AbortSignal) =>
    apiFetch<SuperStatistikLayanan[]>('/admin/statistik-layanan', { signal });

export const getTopCabang = (signal?: AbortSignal) =>
    apiFetch<SuperTopCabang[]>('/admin/statistik-cabang/top', { signal });

export const getPaymentMix = (signal?: AbortSignal) =>
    apiFetch<SuperPaymentMix[]>('/admin/statistik-pembayaran', { signal });

// --- Orders -----------------------------------------------------------------

export interface ListPesananParams {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export const listPesanan = (params: ListPesananParams = {}, signal?: AbortSignal) =>
    apiFetch<SuperPesanan[]>(`/admin/statistik-pesanan${buildQuery(params)}`, { signal });

export const getOrdersStats = (signal?: AbortSignal) =>
    apiFetch<SuperOrdersStats>('/admin/orders/stats', { signal });

// --- Services ---------------------------------------------------------------

export const listServiceStats = (signal?: AbortSignal) =>
    apiFetch<SuperStatistikLayanan[]>('/admin/services', { signal });

// --- Vouchers ---------------------------------------------------------------

export const listVouchers = (signal?: AbortSignal) =>
    apiFetch<SuperVoucher[]>('/admin/vouchers', { signal });

export const getVouchersStatistik = (signal?: AbortSignal) =>
    apiFetch<SuperVoucherStat>('/admin/vouchers-statistik', { signal });

export const createVoucher = (input: CreateVoucherInput) =>
    apiFetch<SuperVoucher>('/admin/vouchers', { method: 'POST', body: input });

export const getVoucher = (id: number, signal?: AbortSignal) =>
    apiFetch<SuperVoucher>(`/admin/vouchers/${id}`, { signal });

export const updateVoucher = (id: number, input: UpdateVoucherInput) =>
    apiFetch<SuperVoucher>(`/admin/vouchers/${id}`, { method: 'PUT', body: input });

export const deleteVoucher = (id: number) =>
    apiFetch<{ deleted: boolean }>(`/admin/vouchers/${id}`, { method: 'DELETE' });

// --- Staffs -----------------------------------------------------------------

export const listPegawai = (signal?: AbortSignal) =>
    apiFetch<SuperPegawai[]>('/admin/staffs', { signal });

export const createPegawai = (input: CreatePegawaiInput) =>
    apiFetch<SuperPegawai>('/admin/staffs', { method: 'POST', body: input });

export const updatePegawai = (id: number, input: UpdatePegawaiInput) =>
    apiFetch<SuperPegawai>(`/admin/staffs/${id}`, { method: 'PUT', body: input });

export const deletePegawai = (id: number) =>
    apiFetch<{ deleted: boolean }>(`/admin/staffs/${id}`, { method: 'DELETE' });

// --- Couriers ---------------------------------------------------------------

export const listKurir = (signal?: AbortSignal) =>
    apiFetch<SuperKurir[]>('/admin/couriers', { signal });

export const createKurir = (input: CreateKurirInput) =>
    apiFetch<SuperKurir>('/admin/couriers', { method: 'POST', body: input });

export const updateKurir = (id: number, input: UpdateKurirInput) =>
    apiFetch<SuperKurir>(`/admin/couriers/${id}`, { method: 'PUT', body: input });

export const deleteKurir = (id: number) =>
    apiFetch<{ deleted: boolean }>(`/admin/couriers/${id}`, { method: 'DELETE' });

export const listTipeKendaraan = (signal?: AbortSignal) =>
    apiFetch<SuperTipeKendaraan[]>('/admin/tipe-kendaraan', { signal });

// --- Branches ---------------------------------------------------------------

export const listCabang = (signal?: AbortSignal) =>
    apiFetch<SuperCabang[]>('/admin/branch', { signal });

export const getCabang = (id: number, signal?: AbortSignal) =>
    apiFetch<SuperCabang>(`/admin/branch/${id}`, { signal });

export const getBranchPerformance = (signal?: AbortSignal) =>
    apiFetch<SuperCabangPerformance[]>('/admin/branch/detail/performance', { signal });

export const getBranchServices = (id: number, signal?: AbortSignal) =>
    apiFetch<SuperCabangService[]>(`/admin/branch/${id}/services`, { signal });

export const getBranchReviews = (
    id: number,
    params: { page?: number; limit?: number } = {},
    signal?: AbortSignal,
) => apiFetch<SuperBranchReview[]>(`/admin/branch/${id}/reviews${buildQuery(params)}`, { signal });

export const createCabang = (input: CreateCabangInput) =>
    apiFetch<SuperCabang>('/admin/branch', { method: 'POST', body: input });

export const updateCabang = (id: number, input: UpdateCabangInput) =>
    apiFetch<SuperCabang>(`/admin/branch/${id}`, { method: 'PUT', body: input });

export const deleteCabang = (id: number) =>
    apiFetch<{ deleted: boolean }>(`/admin/branch/${id}`, { method: 'DELETE' });

export const createTarif = (cabangId: number, input: CreateTarifInput) =>
    apiFetch<{ created: boolean }>(`/admin/branch/${cabangId}/services`, {
        method: 'POST',
        body: input,
    });

export const updateTarif = (cabangId: number, input: UpdateTarifInput) =>
    apiFetch<{ updated: boolean }>(`/admin/branch/${cabangId}/services`, {
        method: 'PUT',
        body: input,
    });

// --- Payments ---------------------------------------------------------------

export interface ListPaymentsParams {
    method?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export const listPayments = (params: ListPaymentsParams = {}, signal?: AbortSignal) =>
    apiFetch<SuperPayment[]>(`/admin/payments${buildQuery(params)}`, { signal });

// --- Customers --------------------------------------------------------------

export interface ListCustomersParams {
    search?: string;
    page?: number;
    limit?: number;
}

export const listCustomers = (params: ListCustomersParams = {}, signal?: AbortSignal) =>
    apiFetch<SuperCustomer[]>(`/admin/customers${buildQuery(params)}`, { signal });

export const getCustomer = (id: number, signal?: AbortSignal) =>
    apiFetch<SuperCustomerDetail>(`/admin/customers/${id}`, { signal });

// --- Catalog ----------------------------------------------------------------

export const listLayanan = (signal?: AbortSignal) =>
    apiFetch<SuperLayanan[]>('/admin/layanan', { signal });

// ============================================================================
// Helpers
// ============================================================================

function buildQuery(params: object): string {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params as Record<string, string | number | undefined>)) {
        if (value !== undefined && value !== '') search.set(key, String(value));
    }
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}
