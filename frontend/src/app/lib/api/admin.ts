// Branch admin endpoints. Every route is scoped by {id_cabang}; callers pass
// the current admin's cabang id (see getCurrentCabangId() in session). These
// back the /branch pages.
//
//   Dashboard:
//     GET /branch/{id_cabang}/order/statistik/data         -> today's order + revenue
//     GET /branch/{id_cabang}/order/list                   -> orders (paginated, filterable)
//     GET /branch/{id_cabang}/payments                     -> recent paid payments
//     GET /branch/{id_cabang}/reviews                      -> recent reviews
//   Orders:
//     GET /branch/{id_cabang}/order/statistik/status       -> per-status counts + total
//     GET /branch/{id_cabang}/order/{id_pesanan}/detail    -> one order's detail
//     PUT /branch/{id_cabang}/order/{id_pesanan}/detail    -> update + notify on 'selesai'
//   Reports:
//     GET /branch/{id_cabang}/order/statistik/payment/done           -> per-customer paid grouping
//     GET /branch/{id_cabang}/order/statistik/payment/method/chart   -> %-per-method
//     GET /branch/{id_cabang}/order/statistik/payment/method/total   -> total SUM
//     GET /branch/{id_cabang}/order/statistik/payment/method/average -> AVG
//   Reviews:
//     GET /branch/{id_cabang}/ulasan                       -> reviews paginated
//     GET /branch/{id_cabang}/ulasan/distribusi            -> count per rating 1..5
//     GET /branch/{id_cabang}/ulasan/average               -> average + per-rating counts
//   Staff:
//     GET /branch/{id_cabang}/pegawai                      -> staff list

import { apiFetch } from './client';
import type {
    AdminOrder,
    AdminOrderDetail,
    AdminPayment,
    AdminPegawai,
    ListOrdersParams,
    OrderStatistik,
    OrderStatusStatistik,
    PaymentAverage,
    PaymentByCustomer,
    PaymentMethodChartItem,
    PaymentTotal,
    UlasanAdmin,
    UlasanAverage,
    UlasanDistribusi,
    UpdateOrderDetailInput,
} from './types';

// --- Dashboard ---------------------------------------------------------------

export async function getOrderStatistik(
    cabangId: number,
    signal?: AbortSignal,
): Promise<OrderStatistik> {
    return apiFetch<OrderStatistik>(`/branch/${cabangId}/order/statistik/data`, { signal });
}

export async function listOrders(
    cabangId: number,
    params: ListOrdersParams = {},
    signal?: AbortSignal,
): Promise<AdminOrder[]> {
    const query = buildQuery(params);
    return apiFetch<AdminOrder[]>(`/branch/${cabangId}/order/list${query}`, { signal });
}

export async function listPayments(
    cabangId: number,
    opts: { limit?: number } = {},
    signal?: AbortSignal,
): Promise<AdminPayment[]> {
    const q = opts.limit ? `?limit=${opts.limit}` : '';
    return apiFetch<AdminPayment[]>(`/branch/${cabangId}/payments${q}`, { signal });
}

export async function listReviews(
    cabangId: number,
    opts: { limit?: number } = {},
    signal?: AbortSignal,
): Promise<UlasanAdmin[]> {
    const q = opts.limit ? `?limit=${opts.limit}` : '';
    return apiFetch<UlasanAdmin[]>(`/branch/${cabangId}/reviews${q}`, { signal });
}

// --- Orders ------------------------------------------------------------------

export async function getOrderStatusStatistik(
    cabangId: number,
    signal?: AbortSignal,
): Promise<OrderStatusStatistik> {
    return apiFetch<OrderStatusStatistik>(`/branch/${cabangId}/order/statistik/status`, { signal });
}

export async function getOrderDetail(
    cabangId: number,
    pesananId: number,
    signal?: AbortSignal,
): Promise<AdminOrderDetail> {
    return apiFetch<AdminOrderDetail>(`/branch/${cabangId}/order/${pesananId}/detail`, { signal });
}

export async function updateOrderDetail(
    cabangId: number,
    pesananId: number,
    input: UpdateOrderDetailInput,
): Promise<AdminOrderDetail> {
    return apiFetch<AdminOrderDetail>(`/branch/${cabangId}/order/${pesananId}/detail`, {
        method: 'PUT',
        body: input,
    });
}

// --- Reports -----------------------------------------------------------------

export async function listPaymentByCustomer(
    cabangId: number,
    params: { page?: number; limit?: number } = {},
    signal?: AbortSignal,
): Promise<PaymentByCustomer[]> {
    const q = buildSimpleQuery(params);
    return apiFetch<PaymentByCustomer[]>(
        `/branch/${cabangId}/order/statistik/payment/done${q}`,
        { signal },
    );
}

export async function getPaymentMethodChart(
    cabangId: number,
    signal?: AbortSignal,
): Promise<PaymentMethodChartItem[]> {
    return apiFetch<PaymentMethodChartItem[]>(
        `/branch/${cabangId}/order/statistik/payment/method/chart`,
        { signal },
    );
}

export async function getPaymentMethodTotal(
    cabangId: number,
    signal?: AbortSignal,
): Promise<PaymentTotal> {
    return apiFetch<PaymentTotal>(
        `/branch/${cabangId}/order/statistik/payment/method/total`,
        { signal },
    );
}

export async function getPaymentMethodAverage(
    cabangId: number,
    signal?: AbortSignal,
): Promise<PaymentAverage> {
    return apiFetch<PaymentAverage>(
        `/branch/${cabangId}/order/statistik/payment/method/average`,
        { signal },
    );
}

// --- Reviews -----------------------------------------------------------------

export async function listUlasan(
    cabangId: number,
    params: { page?: number; limit?: number } = {},
    signal?: AbortSignal,
): Promise<UlasanAdmin[]> {
    const q = buildSimpleQuery(params);
    return apiFetch<UlasanAdmin[]>(`/branch/${cabangId}/ulasan${q}`, { signal });
}

export async function getUlasanDistribusi(
    cabangId: number,
    signal?: AbortSignal,
): Promise<UlasanDistribusi> {
    return apiFetch<UlasanDistribusi>(`/branch/${cabangId}/ulasan/distribusi`, { signal });
}

export async function getUlasanAverage(
    cabangId: number,
    signal?: AbortSignal,
): Promise<UlasanAverage> {
    return apiFetch<UlasanAverage>(`/branch/${cabangId}/ulasan/average`, { signal });
}

// --- Staff -------------------------------------------------------------------

export async function listPegawai(
    cabangId: number,
    signal?: AbortSignal,
): Promise<AdminPegawai[]> {
    return apiFetch<AdminPegawai[]>(`/branch/${cabangId}/pegawai`, { signal });
}

// --- internals ---------------------------------------------------------------

function buildQuery(params: ListOrdersParams): string {
    const search = new URLSearchParams();
    if (params.page !== undefined) search.set('page', String(params.page));
    if (params.limit !== undefined) search.set('limit', String(params.limit));
    if (params.sort) search.set('sort', params.sort);
    if (params.search) search.set('search', params.search);
    if (params.status) search.set('status', params.status);
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}

function buildSimpleQuery(params: { page?: number; limit?: number }): string {
    const search = new URLSearchParams();
    if (params.page !== undefined) search.set('page', String(params.page));
    if (params.limit !== undefined) search.set('limit', String(params.limit));
    const qs = search.toString();
    return qs ? `?${qs}` : '';
}
