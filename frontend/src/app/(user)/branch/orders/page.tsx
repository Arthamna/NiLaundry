'use client';

import React, { useEffect, useMemo, useState } from 'react';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import OrdersStatCards from '@/components/ui/branch/OrdersStatCards';
import OrdersTable, { OrdersRow, SortDir } from '@/components/ui/branch/OrdersTable';
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
import { ORDER_STATUSES, STATUS_LABEL, type OrderStatus } from '@/components/ui/branch/StatusBadge';

type FilterValue = 'all' | OrderStatus;
const FILTERS: FilterValue[] = ['all', ...ORDER_STATUSES];
const PAGE_SIZE = 10;

type SortKey = 'id' | 'est';

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
    const [filter, setFilter] = useState<FilterValue>('all');
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState<SortKey>('id');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [stats, setStats] = useState<OrderStatusStatistik | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const sortParam = `${sortKey === 'id' ? 'id_pesanan' : 'estimasi_selesai_pesanan'} ${sortDir}`;

    useEffect(() => {
        if (cabangId == null) {
            setError('Sesi cabang tidak ditemukan.');
            setIsLoading(false);
            return;
        }
        const controller = new AbortController();
        const statusParam = filter === 'all' ? undefined : uiStatusToBackend(filter);
        setIsLoading(true);

        Promise.all([
            adminApi.getOrderStatusStatistik(cabangId, controller.signal),
            adminApi.listOrders(
                cabangId,
                { page, limit: PAGE_SIZE, status: statusParam, sort: sortParam },
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
    }, [cabangId, filter, page, sortParam]);

    function handleSort(key: string) {
        const k = key as SortKey;
        if (k === sortKey) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(k);
            setSortDir('desc');
        }
        setPage(1);
    }

    const totalForFilter =
        filter === 'all' ? stats?.total ?? 0 : countForUiStatus(stats?.counts ?? [], filter);

    return (
        <>
            <BranchTopBar title="Orders" />

            <div className="flex w-full flex-col gap-8 px-10 pt-10 pb-10">
                <OrdersStatCards
                    total={stats?.total ?? 0}
                    pickup={countForUiStatus(stats?.counts ?? [], 'pickup')}
                    processing={countForUiStatus(stats?.counts ?? [], 'processing')}
                    delivery={countForUiStatus(stats?.counts ?? [], 'delivery')}
                    completed={countForUiStatus(stats?.counts ?? [], 'completed')}
                />

                <div className="flex items-start gap-3">
                    {FILTERS.map((value) => {
                        const isActive = value === filter;
                        const label = value === 'all' ? 'All' : STATUS_LABEL[value];
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => {
                                    setFilter(value);
                                    setPage(1);
                                }}
                                className={`flex items-center rounded-full border px-[13px] py-[5px] text-[12px] leading-4 font-medium transition-colors ${
                                    isActive
                                        ? 'border-[#005c55] bg-[#6df5e1] text-[#006f64]'
                                        : 'border-[#bdc9c6] bg-[#e5e9e7] text-[#181c1c] hover:bg-[#d8dedc]'
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
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                />
            </div>
        </>
    );
}
