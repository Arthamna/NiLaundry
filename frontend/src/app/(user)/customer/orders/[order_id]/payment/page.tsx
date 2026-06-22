'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import BackButton from '@/components/ui/customer/BackButton';
import PaymentMethods from '@/components/ui/customer/PaymentMethods';
import PaymentVoucherSection, {
    type PaymentVoucher,
    type VoucherOption,
} from '@/components/ui/customer/PaymentVoucherSection';
import OrderSummaryCard, { type OrderServiceLine } from '@/components/ui/customer/OrderSummaryCard';
import {
    API_BASE_URL,
    pesananApi,
    voucherApi,
    pembayaranApi,
    getApiErrorMessage,
    getCurrentPelangganId,
    getToken,
    type PesananDetail,
    type Voucher,
} from '@/lib/api';

const HEADING_CLASS = 'text-[32px] leading-[38px] font-bold tracking-[-0.6px] text-[#005c55]';
const idr = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;

function expiryLabel(berlakuHingga: string, now: number): string {
    const ms = new Date(berlakuHingga).getTime() - now;
    return ms <= 0 ? 'Kadaluarsa' : `${Math.ceil(ms / 86_400_000)} hari lagi`;
}

function amountLabel(v: Voucher): string {
    return v.tipeDiskon === 'persen' ? `${v.nilaiDiskon}%` : idr(v.nilaiDiskon);
}

// Mirrors the backend's applyDiscount (pembayaran_service.go) so the UI shows
// the same final total the server will charge at confirmation.
function applyDiscount(total: number, v: Voucher): number {
    if (v.tipeDiskon === 'persen') return Math.max(0, total - (total * v.nilaiDiskon) / 100);
    if (v.tipeDiskon === 'nominal') return Math.max(0, total - v.nilaiDiskon);
    return total;
}

function toPaymentVoucher(v: Voucher, now: number): PaymentVoucher {
    return {
        amount: amountLabel(v),
        code: v.kode,
        description: `Min. belanja ${idr(v.minPembelian)}`,
        expiry: expiryLabel(v.berlakuHingga, now),
    };
}

export default function PaymentPage() {
    const params = useParams<{ order_id: string }>();
    const router = useRouter();
    const orderId = params?.order_id ?? '';

    const [detail, setDetail] = useState<PesananDetail | null>(null);
    const [serviceLines, setServiceLines] = useState<OrderServiceLine[]>([]);
    const [ownedVouchers, setOwnedVouchers] = useState<Voucher[]>([]);
    const [voucherId, setVoucherId] = useState<number | null>(null);
    const [metode, setMetode] = useState('qris');
    const [expanded, setExpanded] = useState(false);
    // Voucher id forwarded from the dashboard "Use Now" → new order flow; applied
    // automatically once the order + owned vouchers have loaded (if eligible).
    const [voucherParam, setVoucherParam] = useState<string | null>(null);
    const [autoApplied, setAutoApplied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [leaving, setLeaving] = useState(false);

    // Refs read by the cleanup effect — refs (not state) so unmount fires the
    // current values without re-running the effect each time they change.
    const paidRef = useRef(false);
    const cancelledRef = useRef(false);
    const pesananIdRef = useRef<number | null>(null);
    const pelangganIdRef = useRef<number | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const pelangganId = getCurrentPelangganId();
        const pesananId = Number(orderId);
        pelangganIdRef.current = pelangganId;
        pesananIdRef.current = Number.isFinite(pesananId) ? pesananId : null;

        const request =
            pelangganId == null || !Number.isFinite(pesananId)
                ? Promise.reject(new Error('Sesi atau pesanan tidak valid.'))
                : Promise.all([
                      pesananApi.getPesanan(pelangganId, pesananId, controller.signal),
                      // Only vouchers the customer has actually claimed can be applied.
                      voucherApi.listVouchers(pelangganId, 'owned', controller.signal),
                  ]);

        request
            .then(([d, vouchers]) => {
                setDetail(d);
                setServiceLines(
                    d.items.map((it) => ({
                        service: it.layananNama || 'Layanan',
                        quantity: `${it.kuantitas}${it.satuan ? ` ${it.satuan}` : ''}`,
                        subtotal: idr(it.subtotal),
                    })),
                );
                // Keep only still-valid, not-yet-used claimed vouchers; the user
                // picks one to apply.
                const now = Date.now();
                setOwnedVouchers(
                    vouchers.filter((v) => !v.usedByMe && new Date(v.berlakuHingga).getTime() >= now),
                );
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, [orderId]);

    useEffect(() => {
        setVoucherParam(new URLSearchParams(window.location.search).get('voucher'));
    }, []);

    // Auto-cancel hook. The order was created with status='Menunggu'; if the
    // customer leaves this page without confirming payment we flip it to
    // 'cancelled'. Two layers:
    //   - `beforeunload` / `pagehide` for tab close, refresh, external link:
    //     fetch with keepalive lets the request finish past unload.
    //   - cleanup function for in-app navigation (back button, route push).
    // The backend `cancelIfPending` only flips status when it's still
    // 'Menunggu', so already-paid or repeat calls are no-ops.
    useEffect(() => {
        function cancelViaKeepalive() {
            const pelangganId = pelangganIdRef.current;
            const pesananId = pesananIdRef.current;
            if (pelangganId == null || pesananId == null) return;
            if (paidRef.current || cancelledRef.current) return;
            cancelledRef.current = true;
            const token = getToken();
            void fetch(
                `${API_BASE_URL}/pelanggan/${pelangganId}/pesanan/${pesananId}/cancel`,
                {
                    method: 'POST',
                    keepalive: true,
                    headers: token
                        ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
                        : { 'Content-Type': 'application/json' },
                },
            ).catch(() => {});
        }

        window.addEventListener('beforeunload', cancelViaKeepalive);
        window.addEventListener('pagehide', cancelViaKeepalive);

        return () => {
            window.removeEventListener('beforeunload', cancelViaKeepalive);
            window.removeEventListener('pagehide', cancelViaKeepalive);
            // NOTE: do NOT auto-cancel here. React StrictMode (dev) runs this
            // cleanup on its mount→cleanup→mount cycle while the payment is
            // still 'pending', which would cancel the order the instant the
            // page opens — before the customer ever clicks Pay. Real exits are
            // already covered: the back button cancels explicitly via
            // handleBack, and tab close / refresh / external nav fire the
            // keepalive cancel above. An in-app link away leaves the order
            // pending, which is correct (better than cancelling a paid order).
        };
    }, []);

    const orderTotal = detail?.totalHarga ?? 0;
    // The order's stored total is pre-voucher; reflect an applied voucher's
    // discount in the UI right away (the backend recomputes the same way at
    // confirmation).
    const appliedVoucherRaw = voucherId != null ? (ownedVouchers.find((v) => v.id === voucherId) ?? null) : null;
    const discountedTotal = appliedVoucherRaw ? applyDiscount(orderTotal, appliedVoucherRaw) : orderTotal;
    const total = detail ? idr(discountedTotal) : '';
    const voucherSummary = appliedVoucherRaw
        ? { label: `Voucher ${appliedVoucherRaw.kode}`, amount: `- ${idr(Math.round(orderTotal - discountedTotal))}` }
        : undefined;

    // Auto-apply a forwarded voucher once the order total + owned vouchers are
    // known — but only if it's eligible (order total ≥ min purchase). Runs once.
    useEffect(() => {
        if (autoApplied || voucherParam == null || ownedVouchers.length === 0 || orderTotal <= 0) return;
        const wanted = Number(voucherParam);
        const v = ownedVouchers.find((x) => x.id === wanted);
        if (v && orderTotal >= v.minPembelian) setVoucherId(v.id);
        setAutoApplied(true);
    }, [autoApplied, voucherParam, ownedVouchers, orderTotal]);

    const options: VoucherOption[] = useMemo(() => {
        const now = Date.now();
        return ownedVouchers.map((v) => {
            const eligible = orderTotal >= v.minPembelian;
            return {
                id: v.id,
                amount: amountLabel(v),
                code: v.kode,
                description: `Min. belanja ${idr(v.minPembelian)}`,
                expiry: expiryLabel(v.berlakuHingga, now),
                eligible,
                reason: eligible ? undefined : `Min. belanja ${idr(v.minPembelian)}`,
            };
        });
    }, [ownedVouchers, orderTotal]);

    const appliedVoucher = useMemo<PaymentVoucher | null>(() => {
        if (voucherId == null) return null;
        const v = ownedVouchers.find((x) => x.id === voucherId);
        return v ? toPaymentVoucher(v, Date.now()) : null;
    }, [voucherId, ownedVouchers]);

    function handleApply(id: number) {
        const v = ownedVouchers.find((x) => x.id === id);
        if (!v || orderTotal < v.minPembelian) return;
        setVoucherId(id);
        setExpanded(false);
    }

    // In-app back: cancel the still-pending order and WAIT for it to commit
    // before navigating, so the order-detail page we land on re-fetches the
    // already-cancelled order (rather than racing the fire-and-forget cancel
    // in the unmount cleanup and showing it as still active).
    async function handleBack() {
        const pelangganId = pelangganIdRef.current;
        const pesananId = pesananIdRef.current;
        if (
            pelangganId != null &&
            pesananId != null &&
            !paidRef.current &&
            !cancelledRef.current
        ) {
            // Mark cancelled BEFORE awaiting so the unmount cleanup that fires
            // on navigation doesn't send a duplicate cancel.
            cancelledRef.current = true;
            setLeaving(true);
            try {
                await pesananApi.cancelPesanan(pelangganId, pesananId);
            } catch {
                /* idempotent / best-effort */
            }
        }
        router.push(`/customer/orders/${orderId}`);
    }

    async function handlePay() {
        const pelangganId = getCurrentPelangganId();
        const pesananId = Number(orderId);
        if (pelangganId == null || !Number.isFinite(pesananId)) return;
        setSubmitting(true);
        try {
            await pembayaranApi.konfirmasiPembayaran(pelangganId, {
                pesananId,
                metode,
                voucherId,
            });
            // Mark as paid BEFORE navigating so the cleanup effect that fires
            // on unmount doesn't fire the auto-cancel request.
            paidRef.current = true;
            router.push('/customer/orders');
        } catch (e) {
            // Payment failed → keep the order intact and let the customer retry.
            // (Previously this cancelled the order on any error, which destroyed
            // a perfectly good order on a transient failure.) The order is only
            // cancelled when the customer explicitly leaves via the back button.
            setError(getApiErrorMessage(e));
            setSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader />

            <div className="flex w-full flex-col gap-[32px]">
                <div className="flex w-full flex-col gap-[40px]">
                    <div className="flex w-full flex-col gap-[20px]">
                        <BackButton
                            href={`/customer/orders/${orderId}`}
                            label={leaving ? 'Membatalkan…' : '← Kembali'}
                            onClick={handleBack}
                            disabled={leaving}
                        />
                        <h1 className={HEADING_CLASS}>Payment Methods</h1>
                    </div>
                    <PaymentMethods value={metode} onChange={setMetode} />
                </div>

                {error && (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}

                {isLoading ? (
                    <p className="text-[15px] text-[#62748e]">Memuat pesanan…</p>
                ) : (
                    <>
                        <div className="flex w-full flex-col gap-[20px]">
                            <h2 className={HEADING_CLASS}>Voucher</h2>
                            <PaymentVoucherSection
                                voucher={appliedVoucher}
                                appliedId={voucherId}
                                options={options}
                                expanded={expanded}
                                onToggle={() => setExpanded((v) => !v)}
                                onApply={handleApply}
                                onRemove={() => setVoucherId(null)}
                            />
                        </div>

                        <h2 className={HEADING_CLASS}>Order Details</h2>
                        <OrderSummaryCard services={serviceLines} couriers={[]} voucher={voucherSummary} total={total} />

                        <button
                            type="button"
                            onClick={handlePay}
                            disabled={submitting}
                            className="flex h-[40px] w-full items-center justify-center rounded-[6.75px] bg-[#009689] px-[113px] py-[8px] text-center text-[16px] leading-[17.5px] text-white transition-colors hover:bg-[#007e73] disabled:opacity-60"
                        >
                            {submitting ? (
                                <span className="font-black">Memproses…</span>
                            ) : (
                                <span className="font-black">
                                    Pay <span className="font-normal">{total}</span>
                                </span>
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
