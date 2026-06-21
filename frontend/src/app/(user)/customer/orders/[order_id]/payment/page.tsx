'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import BackButton from '@/components/ui/customer/BackButton';
import PaymentMethods from '@/components/ui/customer/PaymentMethods';
import PaymentVoucherSection, { type PaymentVoucher } from '@/components/ui/customer/PaymentVoucherSection';
import OrderSummaryCard, { type OrderServiceLine } from '@/components/ui/customer/OrderSummaryCard';
import {
    pesananApi,
    voucherApi,
    pembayaranApi,
    getApiErrorMessage,
    getCurrentPelangganId,
    type PesananDetail,
    type Voucher,
} from '@/lib/api';

const HEADING_CLASS = 'text-[32px] leading-[38px] font-bold tracking-[-0.6px] text-[#005c55]';
const idr = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;

function toPaymentVoucher(v: Voucher, now: number): PaymentVoucher {
    const ms = new Date(v.berlakuHingga).getTime() - now;
    return {
        amount: v.tipeDiskon === 'persen' ? `${v.nilaiDiskon}%` : idr(v.nilaiDiskon),
        code: v.kode,
        description: `Min. belanja ${idr(v.minPembelian)}`,
        expiry: ms <= 0 ? 'Kadaluarsa' : `${Math.ceil(ms / 86_400_000)} hari lagi`,
    };
}

export default function PaymentPage() {
    const params = useParams<{ order_id: string }>();
    const router = useRouter();
    const orderId = params?.order_id ?? '';

    const [detail, setDetail] = useState<PesananDetail | null>(null);
    const [serviceLines, setServiceLines] = useState<OrderServiceLine[]>([]);
    const [voucher, setVoucher] = useState<PaymentVoucher | null>(null);
    const [voucherId, setVoucherId] = useState<number | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const pelangganId = getCurrentPelangganId();
        const pesananId = Number(orderId);
        const request =
            pelangganId == null || !Number.isFinite(pesananId)
                ? Promise.reject(new Error('Sesi atau pesanan tidak valid.'))
                : Promise.all([
                      pesananApi.getPesanan(pelangganId, pesananId, controller.signal),
                      voucherApi.listVouchers(pelangganId, controller.signal),
                  ]);

        request
            .then(([d, vouchers]) => {
                setDetail(d);
                // service name is not stored per item (see CUSTOMER.md) — neutral label.
                setServiceLines(
                    d.items.map((it) => ({
                        service: 'Layanan',
                        quantity: `${it.kuantitas}`,
                        subtotal: idr(it.subtotal),
                    })),
                );
                const now = Date.now();
                const valid = vouchers.filter((v) => new Date(v.berlakuHingga).getTime() >= now);
                if (valid[0]) {
                    setVoucher(toPaymentVoucher(valid[0], now));
                    setVoucherId(valid[0].id);
                }
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, [orderId]);

    const total = detail ? idr(detail.totalHarga) : '';
    const showPay = voucher !== null && !expanded;

    async function handlePay() {
        const pelangganId = getCurrentPelangganId();
        const pesananId = Number(orderId);
        if (pelangganId == null || !Number.isFinite(pesananId)) return;
        setSubmitting(true);
        try {
            // NOTE: `metode` is hardcoded until PaymentMethods lifts the selected method (flagged in CUSTOMER.md).
            await pembayaranApi.konfirmasiPembayaran(pelangganId, {
                pesananId,
                metode: 'qris',
                voucherId: voucher ? voucherId : null,
            });
            router.push('/customer/orders');
        } catch (e) {
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
                        <BackButton href={`/customer/orders/${orderId}`} label="← Kembali" />
                        <h1 className={HEADING_CLASS}>Payment Methods</h1>
                    </div>
                    <PaymentMethods />
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
                                voucher={voucher}
                                expanded={expanded}
                                onToggle={() => setExpanded((v) => !v)}
                                onRemove={() => {
                                    setVoucher(null);
                                    setVoucherId(null);
                                }}
                            />
                        </div>

                        <h2 className={HEADING_CLASS}>Order Details</h2>
                        <OrderSummaryCard services={serviceLines} couriers={[]} total={total} />

                        <button
                            type="button"
                            onClick={handlePay}
                            disabled={submitting}
                            className="flex h-[40px] w-full items-center justify-center rounded-[6.75px] bg-[#009689] px-[113px] py-[8px] text-center text-[16px] leading-[17.5px] text-white transition-colors hover:bg-[#007e73] disabled:opacity-60"
                        >
                            {submitting ? (
                                <span className="font-black">Memproses…</span>
                            ) : showPay ? (
                                <span className="font-black">
                                    Pay <span className="font-normal">{total}</span>
                                </span>
                            ) : (
                                <span className="font-black">Make Order</span>
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
