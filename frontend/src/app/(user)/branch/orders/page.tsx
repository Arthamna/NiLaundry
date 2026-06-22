'use client';

import React, { useEffect, useMemo, useState } from 'react';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import OrdersStatCards from '@/components/ui/branch/OrdersStatCards';
import OrdersTable, { OrdersRow } from '@/components/ui/branch/OrdersTable';
import {
    adminApi,
    getApiErrorMessage,
    getCurrentCabangId,
    type AdminOrder,
    type OrderStatusStatistik,
} from '@/lib/api';
import {
    avatarToneFor,
    formatEstFinish,
    formatOrderId,
    initialsOf,
    mapOrderStatus,
    uiStatusToBackend,
} from '@/components/ui/branch/format';
import type { OrderStatus } from '@/components/ui/branch/StatusBadge';

type FilterLabel = 'All' | OrderStatus;
const FILTERS: FilterLabel[] = ['All', 'Pickup', 'Processing', 'Delivery', 'Completed'];
const PAGE_SIZE = 10;

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
    return counts
        .filter((c) => mapOrderStatus(c.status) === target)
        .reduce((acc, c) => acc + c.count, 0);
}

export default function BranchOrdersPage() {
    const cabangId = useMemo(() => getCurrentCabangId(), []);
    const [filter, setFilter] = useState<FilterLabel>('All');
    const [page, setPage] = useState(1);
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [stats, setStats] = useState<OrderStatusStatistik | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (cabangId == null) {
            setError('Sesi cabang tidak ditemukan.');
            setIsLoading(false);
            return;
        }
        const controller = new AbortController();
        const statusParam = filter === 'All' ? undefined : uiStatusToBackend(filter);
        setIsLoading(true);

        Promise.all([
            adminApi.getOrderStatusStatistik(cabangId, controller.signal),
            adminApi.listOrders(
                cabangId,
                { page, limit: PAGE_SIZE, status: statusParam },
                controller.signal,
            ),
        ])
            .then(([s, o]) => {
                setStats(s);
                setOrders(o);
                setError(null);
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, [cabangId, filter, page]);

    const totalForFilter = filter === 'All'
        ? stats?.total ?? 0
        : countForUiStatus(stats?.counts ?? [], filter);

    return (
        <>
            <BranchTopBar title="Orders" branchName={`Branch #${cabangId ?? '-'}`} />

            <div className="flex w-full flex-col gap-8 px-10 pt-10 pb-10">
                <OrdersStatCards
                    total={stats?.total ?? 0}
                    pickup={countForUiStatus(stats?.counts ?? [], 'Pickup')}
                    processing={countForUiStatus(stats?.counts ?? [], 'Processing')}
                    delivery={countForUiStatus(stats?.counts ?? [], 'Delivery')}
                    completed={countForUiStatus(stats?.counts ?? [], 'Completed')}
                />

                <div className="flex items-start gap-5">
                    {FILTERS.map((label) => {
                        const isActive = label === filter;
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => {
                                    setFilter(label);
                                    setPage(1);
                                }}
                                className={`flex items-center rounded-full border text-[12px] leading-4 font-medium ${
                                    isActive
                                        ? 'border-[#005c55] bg-[#6df5e1] px-[13px] py-[3px] text-[#006f64]'
                                        : 'border-[#bdc9c6] bg-[#e5e9e7] px-[9px] py-[3px] text-[#181c1c]'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {error && (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}

                <OrdersTable
                    rows={isLoading ? [] : orders.map(toOrdersRow)}
                    page={page}
                    pageSize={PAGE_SIZE}
                    totalEntries={totalForFilter}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
}
