// Admin (branch staff) endpoints — ADMIN_ENDPOINT.md.
//
// Every route is scoped by {id_cabang}; callers pass the current admin's cabang
// id (see getCurrentCabangId() in session). These back the /branch pages.
//
// Dashboard:
//   GET /branch/{id_cabang}/order/statistik/data           -> today's order + revenue
//   GET /branch/{id_cabang}/order/list                     -> order list
// Orders:
//   GET /branch/{id_cabang}/order/statistik/status         -> per-status counts + total
//   GET /branch/{id_cabang}/order/{id_pesanan}/detail      -> one order's detail
//   PUT /branch/{id_cabang}/order/{id_pesanan}/detail      -> update status / est. finish
// Report:
//   GET /branch/{id_cabang}/order/statistik/payment        -> paid payment rows (ledger)
//   GET /branch/{id_cabang}/order/statistik/payment/method        -> per-method counts
//   GET /branch/{id_cabang}/order/statistik/payment/method/total  -> per-method count + total

import { apiFetch } from './client';
import type {
    AdminOrder,
    AdminOrderDetail,
    AdminPayment,
    ListOrdersParams,
    OrderStatistik,
    OrderStatusStatistik,
    PaymentMethodStat,
    PaymentMethodTotal,
    UpdateOrderDetailInput,
} from './types';

// --- Dashboard ---------------------------------------------------------------

/** GET /branch/{id_cabang}/order/statistik/data — Today's Order + Today's Revenue. */
export async function getOrderStatistik(
    cabangId: number,
    signal?: AbortSignal,
): Promise<OrderStatistik> {
    return apiFetch<OrderStatistik>(`/branch/${cabangId}/order/statistik/data`, { signal });
}

/** GET /branch/{id_cabang}/order/list — orders for the branch (optional pagination/sort/filter). */
export async function listOrders(
    cabangId: number,
    params: ListOrdersParams = {},
    signal?: AbortSignal,
): Promise<AdminOrder[]> {
    const query = buildQuery(params);
    return apiFetch<AdminOrder[]>(`/branch/${cabangId}/order/list${query}`, { signal });
}

// --- Orders ------------------------------------------------------------------

/** GET /branch/{id_cabang}/order/statistik/status — counts grouped by status + total. */
export async function getOrderStatusStatistik(
    cabangId: number,
    signal?: AbortSignal,
): Promise<OrderStatusStatistik> {
    return apiFetch<OrderStatusStatistik>(`/branch/${cabangId}/order/statistik/status`, { signal });
}

/** GET /branch/{id_cabang}/order/{id_pesanan}/detail — full detail of one order. */
export async function getOrderDetail(
    cabangId: number,
    pesananId: number,
    signal?: AbortSignal,
): Promise<AdminOrderDetail> {
    return apiFetch<AdminOrderDetail>(`/branch/${cabangId}/order/${pesananId}/detail`, { signal });
}

/** PUT /branch/{id_cabang}/order/{id_pesanan}/detail — update status / est. finish. */
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

// --- Report ------------------------------------------------------------------

/** GET /branch/{id_cabang}/order/statistik/payment — paid payment rows for the ledger. */
export async function getPaymentStats(
    cabangId: number,
    signal?: AbortSignal,
): Promise<AdminPayment[]> {
    return apiFetch<AdminPayment[]>(`/branch/${cabangId}/order/statistik/payment`, { signal });
}

/** GET /branch/{id_cabang}/order/statistik/payment/method — paid count per method (chart). */
export async function getPaymentByMethod(
    cabangId: number,
    signal?: AbortSignal,
): Promise<PaymentMethodStat[]> {
    return apiFetch<PaymentMethodStat[]>(`/branch/${cabangId}/order/statistik/payment/method`, {
        signal,
    });
}

/** GET /branch/{id_cabang}/order/statistik/payment/method/total — count + summed amount per method. */
export async function getPaymentByMethodTotal(
    cabangId: number,
    signal?: AbortSignal,
): Promise<PaymentMethodTotal[]> {
    return apiFetch<PaymentMethodTotal[]>(
        `/branch/${cabangId}/order/statistik/payment/method/total`,
        { signal },
    );
}

// --- internals ---------------------------------------------------------------

/** Serialize defined list params into a `?a=b&c=d` query string (empty when none). */
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
