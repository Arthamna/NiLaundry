'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import BackButton from '@/components/ui/customer/BackButton';
import OrderTimeline, { type TimelineStep, type StepState } from '@/components/ui/customer/OrderTimeline';
import ServicesSummary, { type ServiceLine } from '@/components/ui/customer/ServicesSummary';
import OrderReviewCard from '@/components/ui/customer/OrderReviewCard';
import {
    pesananApi,
    ulasanApi,
    getApiErrorMessage,
    getCurrentPelangganId,
    type JenisAmbil,
    type JenisAntar,
    type PesananDetail,
    type Ulasan,
} from '@/lib/api';

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

function scenarioSteps(jenisAmbil: JenisAmbil, jenisAntar: JenisAntar): string[] {
    const steps: string[] = [];
    if (jenisAmbil === 'pickup') steps.push('pickup');
    steps.push('processing');
    if (jenisAntar === 'delivery') steps.push('delivery');
    steps.push('completed');
    return steps;
}

function buildTimeline(
    jenisAmbil: JenisAmbil,
    jenisAntar: JenisAntar,
    status: string,
    eta: string,
): TimelineStep[] {
    const steps = scenarioSteps(jenisAmbil, jenisAntar);
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
                // Completed orders may carry a review the detail endpoint didn't embed.
                if (d.status === 'selesai' && !d.ulasan) {
                    return ulasanApi
                        .getUlasanForPesanan(pelangganId, pesananId, controller.signal)
                        .then(setUlasan)
                        .catch(() => {
                            /* no review yet — fine */
                        });
                }
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

                <OrderTimeline
                    orderId={`#${detail.id}`}
                    service={serviceTitle}
                    status={detail.status}
                    steps={buildTimeline(detail.jenisAmbil, detail.jenisAntar, detail.status, detail.estimasiSelesai)}
                />

                <ServicesSummary
                    items={serviceLines.length > 0 ? serviceLines : [{ label: 'Tidak ada item', value: '—' }]}
                    voucher={voucherLine}
                    total={{ label: 'Total', value: formatRp(detail.totalHarga) }}
                />

                {/* Courier/delivery block needs the `pengiriman`+`kurir` join, which has
                    no customer endpoint yet (CUSTOMER.md gap #4) — omitted until added. */}
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
