'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import BackButton from '@/components/ui/customer/BackButton';
import OrderTimeline, { type TimelineStep, type StepState } from '@/components/ui/customer/OrderTimeline';
import ServicesSummary, { type ServiceLine } from '@/components/ui/customer/ServicesSummary';
import OrderReviewCard from '@/components/ui/customer/OrderReviewCard';
import CourierCard from '@/components/ui/customer/CourierCard';
import {
    pesananApi,
    ulasanApi,
    kurirApi,
    getApiErrorMessage,
    getCurrentPelangganId,
    type JenisAmbil,
    type JenisAntar,
    type OrderKurir,
    type PesananDetail,
    type Ulasan,
} from '@/lib/api';
import { isCancelledStatus } from '@/lib/orderStatus';

const courierInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const COURIER_LEG_LABEL: Record<string, string> = { pickup: 'Kurir Pickup', delivery: 'Kurir Delivery' };

const formatRp = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;

function formatTimestamp(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// The tracked statuses are pickup → processing → delivery → completed. Which
// steps appear depends on the order's scenario (jenis_ambil / jenis_antar):
//   pickup + delivery → pickup, processing, delivery, completed
//   pickup + walkin   → pickup, processing, completed
//   walkin + delivery → processing, delivery, completed
//   walkin + walkin   → processing, completed
const STEP_LABEL: Record<string, string> = {
    pickup: 'Pickup',
    processing: 'Processing',
    delivery: 'Delivery',
    completed: 'Completed',
};

function scenarioSteps(jenisAmbil: JenisAmbil, jenisAntar: JenisAntar, status: string): string[] {
    const steps: string[] = [];
    // Include a leg step when the order's scenario calls for it OR when the
    // order is currently sitting on that step — the latter keeps the tracker
    // from stalling at step 0 for orders whose status doesn't line up with
    // jenis_ambil / jenis_antar (e.g. an order advanced to 'delivery').
    if (jenisAmbil === 'pickup' || status === 'pickup') steps.push('pickup');
    steps.push('processing');
    if (jenisAntar === 'delivery' || status === 'delivery') steps.push('delivery');
    steps.push('completed');
    return steps;
}

function buildTimeline(
    jenisAmbil: JenisAmbil,
    jenisAntar: JenisAntar,
    status: string,
    eta: string,
): TimelineStep[] {
    const steps = scenarioSteps(jenisAmbil, jenisAntar, status);
    let currentIndex = steps.indexOf(status);
    if (currentIndex < 0) currentIndex = 0; // tolerate legacy/unknown statuses
    return steps.map((key, i) => {
        const state: StepState = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'pending';
        const isLast = i === steps.length - 1;
        const time = isLast ? `Est. ${formatTimestamp(eta)}` : state === 'pending' ? '—' : '';
        return { title: STEP_LABEL[key] ?? key, time, state };
    });
}

function OrderDetailInner() {
    const params = useParams<{ order_id: string }>();
    const pesananId = Number(params?.order_id);

    const [detail, setDetail] = useState<PesananDetail | null>(null);
    const [ulasan, setUlasan] = useState<Ulasan | null>(null);
    const [couriers, setCouriers] = useState<OrderKurir[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const pelangganId = getCurrentPelangganId();

        if (pelangganId == null) {
            setError('Sesi tidak ditemukan. Silakan masuk kembali.');
            setIsLoading(false);
            return;
        }
        if (!Number.isInteger(pesananId) || pesananId <= 0) {
            setError('Pesanan tidak valid.');
            setIsLoading(false);
            return;
        }

        pesananApi
            .getPesanan(pelangganId, pesananId, controller.signal)
            .then((d) => {
                setDetail(d);
                setUlasan(d.ulasan ?? null);
                const tasks: Promise<unknown>[] = [];
                // Courier card: show the assigned courier(s) for the order's
                // pickup/delivery legs whenever they exist. They're relevant at
                // every active stage — an order keeps its assigned courier while
                // it's 'processing', not only while status is literally
                // 'pickup'/'delivery'. The endpoint returns [] for walk-in
                // orders, so it's safe to always ask (skip once cancelled).
                if (!isCancelledStatus(d.status)) {
                    tasks.push(
                        kurirApi
                            .getOrderKurir(pelangganId, pesananId, controller.signal)
                            .then(setCouriers)
                            .catch(() => {
                                /* no courier / not owned — fine */
                            }),
                    );
                }
                // Completed orders may carry a review the detail endpoint didn't embed.
                if (d.status === 'selesai' && !d.ulasan) {
                    tasks.push(
                        ulasanApi
                            .getUlasanForPesanan(pelangganId, pesananId, controller.signal)
                            .then(setUlasan)
                            .catch(() => {
                                /* no review yet — fine */
                            }),
                    );
                }
                return Promise.all(tasks);
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, [pesananId]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-[50px]">
                <DashboardHeader />
                <p className="text-[15px] text-[#62748e]">Memuat detail pesanan…</p>
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div className="flex flex-col gap-[50px]">
                <DashboardHeader />
                <div className="flex flex-col gap-[20px]">
                    <BackButton href="/customer/orders" />
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error ?? 'Pesanan tidak ditemukan.'}
                    </p>
                </div>
            </div>
        );
    }

    const isCompleted = detail.status === 'completed' || detail.status === 'selesai';
    const isCancelled = isCancelledStatus(detail.status);
    const showCouriers = !isCancelled && couriers.length > 0;

    // getPesanan embeds each line's layanan name + unit (joined via tarif).
    const serviceLines: ServiceLine[] = detail.items.map((it) => ({
        label: `${it.layananNama || `Tarif #${it.tarifId}`} × ${it.kuantitas}${it.satuan ? ` ${it.satuan}` : ''}`,
        value: formatRp(it.subtotal),
    }));

    const serviceTitle = detail.ringkasanLayanan || 'Pesanan Laundry';

    // When a voucher was applied at payment, the order total was reduced; show the
    // discount (sum of item subtotals − final total) as a voucher line.
    const itemsSum = detail.items.reduce((sum, it) => sum + it.subtotal, 0);
    const voucherDiscount = detail.voucher ? Math.max(0, itemsSum - detail.totalHarga) : 0;
    const voucherLine: ServiceLine | undefined = detail.voucher
        ? { label: `Voucher ${detail.voucher.kode}`, value: `- ${formatRp(voucherDiscount)}` }
        : undefined;

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader />

            <div className="flex w-full flex-col gap-[20px]">
                <BackButton href="/customer/orders" />

                {isCancelled ? (
                    <div className="flex w-full flex-col gap-[6px] rounded-[12.75px] border border-[#fecaca] bg-[#fef2f2] p-[16px]">
                        <div className="flex items-center justify-between">
                            <p className="text-[14px] leading-[20px] font-bold text-[#0f172b]">{`#${detail.id}`}</p>
                            <span className="flex items-center gap-[5.25px] rounded-full bg-[#f3f4f6] px-[7px] py-[1.75px]">
                                <span className="size-[5.25px] rounded-full bg-[#9ca3af]" />
                                <span className="text-[10.5px] leading-[14px] font-normal text-[#6b7280]">Cancelled</span>
                            </span>
                        </div>
                        <p className="text-[12.25px] leading-[17.5px] text-[#b91c1c]">
                            Pesanan ini dibatalkan karena pembayaran tidak diselesaikan.
                        </p>
                    </div>
                ) : (
                    <OrderTimeline
                        orderId={`#${detail.id}`}
                        service={serviceTitle}
                        status={detail.status}
                        steps={buildTimeline(detail.jenisAmbil, detail.jenisAntar, detail.status, detail.estimasiSelesai)}
                    />
                )}

                {/* Courier card(s) for the active pickup/delivery leg, from
                    GET /pelanggan/{id}/pesanan/{pesananId}/kurir. */}
                {showCouriers && (
                    <div className="flex w-full flex-col gap-[10px]">
                        {couriers.map((k, i) => (
                            <div key={`${k.jenis}-${i}`} className="flex w-full flex-col gap-[6px]">
                                <p className="text-[11px] leading-[16.5px] font-semibold text-[#62748e]">
                                    {COURIER_LEG_LABEL[k.jenis] ?? 'Kurir'}
                                </p>
                                <CourierCard
                                    initials={courierInitials(k.nama)}
                                    name={k.nama}
                                    vehicle={`${k.jenisKendaraan} · ${k.noPlat}`}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <ServicesSummary
                    items={serviceLines.length > 0 ? serviceLines : [{ label: 'Tidak ada item', value: '—' }]}
                    voucher={voucherLine}
                    total={{ label: 'Total', value: formatRp(detail.totalHarga) }}
                />

                {isCompleted && (
                    <OrderReviewCard
                        orderId={String(detail.id)}
                        service={serviceTitle}
                        initialRating={ulasan?.rating ?? 0}
                        initialComment={ulasan?.komentar ?? ''}
                    />
                )}
            </div>
        </div>
    );
}

export default function OrderDetailPage() {
    return (
        <Suspense fallback={null}>
            <OrderDetailInner />
        </Suspense>
    );
}
