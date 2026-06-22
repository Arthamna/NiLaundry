'use client';

import React, { useEffect, useState } from 'react';

import OrdersTable from '@/components/ui/admin/OrdersTable';
import { Order, STATUS_FILTERS, toOrderStatus } from '@/components/ui/admin/orderData';
import { superadminApi, getApiErrorMessage } from '@/lib/api';
import { initialsOf, formatEstFinish } from '@/components/ui/branch/format';

type Filter = (typeof STATUS_FILTERS)[number];

interface StatItem {
    label: string;
    value: number;
}

// Summary card (Figma node 488:8413): plain label + large number, no icon.
function StatCard({ label, value }: StatItem) {
    return (
        <div className="flex flex-col gap-[4px] rounded-[12px] border border-[#bdc9c6] bg-white p-[17px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <span className="text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-[#3e4947]">
                {label}
            </span>
            <span className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                {value}
            </span>
        </div>
    );
}

function toRow(o: superadminApi.SuperPesanan): Order {
    const est = formatEstFinish(o.estimasiSelesai);
    return {
        id: String(o.id),
        code: `#ORD-${String(o.id).padStart(4, '0')}`,
        branch: o.namaCabang,
        customerName: o.namaPelanggan,
        customerInitials: initialsOf(o.namaPelanggan),
        customerPhone: o.noTelpPelanggan,
        estFinish: est.isOverdue ? '' : est.label,
        overdue: est.isOverdue ? est.label : undefined,
        status: toOrderStatus(o.status),
    };
}

// Page body for /admin/orders (Figma node 120:4975).
export default function OrdersView() {
    const [filter, setFilter] = useState<Filter>('All');
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<superadminApi.SuperOrdersStats | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Stats are global (unaffected by the active filter) — fetch once.
    useEffect(() => {
        const ac = new AbortController();
        superadminApi
            .getOrdersStats(ac.signal)
            .then((s) => setStats(s))
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            });
        return () => ac.abort();
    }, []);

    // Order list re-fetches whenever the status filter changes.
    useEffect(() => {
        const ac = new AbortController();
        setLoading(true);
        const status = filter === 'All' ? undefined : filter.toLowerCase();
        superadminApi
            .listPesanan({ limit: 50, status }, ac.signal)
            .then((rows) => setOrders((rows ?? []).map(toRow)))
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            })
            .finally(() => {
                if (!ac.signal.aborted) setLoading(false);
            });
        return () => ac.abort();
    }, [filter]);

    const cancelled = stats
        ? Math.max(0, stats.total - stats.pickup - stats.processing - stats.delivery - stats.completed)
        : 0;
    const statCards: StatItem[] = [
        { label: 'Total Orders', value: stats?.total ?? 0 },
        { label: 'Pickup', value: stats?.pickup ?? 0 },
        { label: 'Processing', value: stats?.processing ?? 0 },
        { label: 'Delivery', value: stats?.delivery ?? 0 },
        { label: 'Completed', value: stats?.completed ?? 0 },
        { label: 'Cancelled', value: cancelled },
    ];

    return (
        <div className="flex w-full flex-col gap-[20px] p-[40px]">
            {error && (
                <p className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
                    {error}
                </p>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-6 gap-[20px]">
                {statCards.map((stat) => (
                    <StatCard key={stat.label} label={stat.label} value={stat.value} />
                ))}
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap items-center gap-[8px]">
                {STATUS_FILTERS.map((value) => {
                    const isActive = filter === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setFilter(value)}
                            className={`rounded-full border text-[12px] leading-[16px] font-medium transition-colors ${
                                isActive
                                    ? 'border-[#005c55] bg-[#6df5e1] px-[13px] py-[3px] text-[#006f64]'
                                    : 'border-[#bdc9c6] bg-[#e5e9e7] px-[9px] py-[3px] text-[#181c1c] hover:bg-[#dde3e0]'
                            }`}
                        >
                            {value}
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            {loading ? (
                <p className="text-[13px] text-[#6e7977]">Loading…</p>
            ) : (
                <OrdersTable orders={orders} />
            )}
        </div>
    );
}
