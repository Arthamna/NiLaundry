'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import OrdersStatCards from '@/components/ui/branch/OrdersStatCards';
import OrdersTable, { OrdersRow } from '@/components/ui/branch/OrdersTable';
import OrderStatusDrawer from '@/components/ui/branch/OrderStatusDrawer';
import {
    adminApi,
    getApiErrorMessage,
    getCurrentCabangId,
    type AdminOrder,
    type AdminOrderDetail,
    type AdminPegawai,
    type OrderStatusStatistik,
} from '@/lib/api';
import { ORDER_STATUSES, STATUS_LABEL, type OrderStatus } from '@/components/ui/branch/StatusBadge';
import {
    avatarToneFor,
    formatEstFinish,
    formatOrderId,
    initialsOf,
    mapOrderStatus,
    uiStatusToBackend,
} from '@/components/ui/branch/format';

const FILTERS: ('all' | OrderStatus)[] = ['all', ...ORDER_STATUSES];
const STATUS_OPTIONS: OrderStatus[] = [...ORDER_STATUSES];

function toOrdersRow(o: AdminOrder): OrdersRow {
    const est = formatEstFinish(o.estimasiSelesai);
    return {
        id: String(o.id),
        orderId: formatOrderId(o.id),
        customerName: o.pelanggan.nama,
        customerPhone: o.pelanggan.noTelp,
        initials: initialsOf(o.pelanggan.nama),
        avatarTone: avatarToneFor(o.pelanggan.id),
        estFinish: est.label,
        isOverdue: est.isOverdue,
        status: mapOrderStatus(o.status),
    };
}

function countForUiStatus(counts: OrderStatusStatistik['counts'], target: OrderStatus): number {
    return counts.filter((c) => mapOrderStatus(c.status) === target).reduce((acc, c) => acc + c.count, 0);
}

function OrderDetailInner() {
    const router = useRouter();
    const params = useParams<{ order_id: string }>();
    const pesananId = Number(params?.order_id ?? 0);
    const cabangId = useMemo(() => getCurrentCabangId(), []);

    const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
    const [pegawai, setPegawai] = useState<AdminPegawai | null>(null);
    const [backdropOrders, setBackdropOrders] = useState<AdminOrder[]>([]);
    const [backdropStats, setBackdropStats] = useState<OrderStatusStatistik | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cabangId == null || !Number.isFinite(pesananId) || pesananId <= 0) {
            setError('Order tidak valid.');
            return;
        }
        const controller = new AbortController();

        Promise.all([
            adminApi.getOrderDetail(cabangId, pesananId, controller.signal),
            adminApi.listOrders(cabangId, { page: 1, limit: 10 }, controller.signal),
            adminApi.getOrderStatusStatistik(cabangId, controller.signal),
        ])
            .then(async ([d, list, stats]) => {
                setDetail(d);
                setBackdropOrders(list);
                setBackdropStats(stats);

                // Look up the pegawai assigned to this order so the drawer can
                // display + submit their id without the admin retyping it.
                const allPegawai = await adminApi.listPegawai(cabangId, controller.signal);
                setPegawai(allPegawai.find((p) => p.id === d.pegawaiId) ?? null);
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            });

        return () => controller.abort();
    }, [cabangId, pesananId]);

    async function handleSave(input: { pegawaiId: number; status: OrderStatus }) {
        if (cabangId == null || !detail) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            await adminApi.updateOrderDetail(cabangId, detail.id, {
                pegawaiId: input.pegawaiId,
                status: uiStatusToBackend(input.status),
            });
            router.push('/branch/orders');
        } catch (e) {
            setSubmitError(getApiErrorMessage(e));
            setSubmitting(false);
        }
    }

    const items = (detail?.items ?? []).map((it) => ({
        service: it.layananNama,
        weightQty: `${it.kuantitas} ${it.satuan}`,
    }));

    return (
        <>
            <BranchTopBar title="Orders" />
            <div className="flex w-full flex-col gap-8 px-10 pt-10 pb-10">
                <OrdersStatCards
                    total={backdropStats?.total ?? 0}
                    pickup={countForUiStatus(backdropStats?.counts ?? [], 'pickup')}
                    processing={countForUiStatus(backdropStats?.counts ?? [], 'processing')}
                    delivery={countForUiStatus(backdropStats?.counts ?? [], 'delivery')}
                    completed={countForUiStatus(backdropStats?.counts ?? [], 'completed')}
                />
                <div className="flex items-start gap-5">
                    {FILTERS.map((value, i) => (
                        <span
                            key={value}
                            className={`flex items-center rounded-full border px-[13px] py-[5px] text-[12px] leading-4 font-medium ${
                                i === 0
                                    ? 'border-[#005c55] bg-[#6df5e1] text-[#006f64]'
                                    : 'border-[#bdc9c6] bg-[#e5e9e7] text-[#181c1c]'
                            }`}
                        >
                            {value === 'all' ? 'All' : STATUS_LABEL[value]}
                        </span>
                    ))}
                </div>
                <OrdersTable rows={backdropOrders.map(toOrdersRow)} />

                {error && (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}
            </div>

            <Link
                href="/branch/orders"
                aria-label="Close order detail"
                className="fixed inset-y-0 right-0 left-20 z-30 bg-white/60 backdrop-blur-[2px]"
            />

            {detail && (
                <OrderStatusDrawer
                    orderId={formatOrderId(detail.id)}
                    statusLabel={STATUS_LABEL[mapOrderStatus(detail.status)]}
                    currentStatus={STATUS_LABEL[mapOrderStatus(detail.status)]}
                    estCompletion={new Date(detail.estimasiSelesai).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                    totalItem={detail.items.length}
                    items={items}
                    closeHref="/branch/orders"
                    pegawai={pegawai}
                    statusOptions={STATUS_OPTIONS}
                    onSubmit={handleSave}
                    isSubmitting={submitting}
                    error={submitError}
                />
            )}
        </>
    );
}

export default function BranchOrderDetailPage() {
    return (
        <Suspense fallback={null}>
            <OrderDetailInner />
        </Suspense>
    );
}
