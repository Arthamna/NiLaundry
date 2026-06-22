'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Package, Star } from 'lucide-react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import AdminKpiCard from '@/components/ui/admin/AdminKpiCard';
import ServiceMixCard, { ServiceMixRow } from '@/components/ui/admin/ServiceMixCard';
import PaymentMixCard, { PaymentMixRow } from '@/components/ui/admin/PaymentMixCard';
import LiveOrdersTable, { LiveOrderRow } from '@/components/ui/admin/LiveOrdersTable';
import TopBranchesCard, { TopBranchRow } from '@/components/ui/admin/TopBranchesCard';
import { superadminApi, getApiErrorMessage } from '@/lib/api';
import {
    formatIDR,
    formatIDRShort,
    formatDateShort,
    initialsOf,
    mapOrderStatus,
    formatPaymentMethod,
    paymentMethodColor,
} from '@/components/ui/branch/format';

// Color palette assigned by index to the Service Mix bars / Payment Mix tiles.
const MIX_COLORS = ['#0f766e', '#14b8a6', '#0ea5e9', '#6366f1', '#a855f7', '#94a3b8'];

export default function AdminDashboardPage() {
    const [umum, setUmum] = useState<superadminApi.SuperStatistikUmum | null>(null);
    const [services, setServices] = useState<superadminApi.SuperStatistikLayanan[]>([]);
    const [payMix, setPayMix] = useState<superadminApi.SuperPaymentMix[]>([]);
    const [topCabang, setTopCabang] = useState<superadminApi.SuperTopCabang[]>([]);
    const [liveOrders, setLiveOrders] = useState<superadminApi.SuperPesanan[]>([]);
    const [nowTs, setNowTs] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ac = new AbortController();
        setNowTs(Date.now());
        Promise.all([
            superadminApi.getStatistikUmum(ac.signal),
            superadminApi.getStatistikLayanan(ac.signal),
            superadminApi.getPaymentMix(ac.signal),
            superadminApi.getTopCabang(ac.signal),
            superadminApi.listPesanan({ limit: 6 }, ac.signal),
        ])
            .then(([u, s, p, t, o]) => {
                setUmum(u);
                setServices(s ?? []);
                setPayMix(p ?? []);
                setTopCabang(t ?? []);
                setLiveOrders(o ?? []);
            })
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            })
            .finally(() => {
                if (!ac.signal.aborted) setLoading(false);
            });
        return () => ac.abort();
    }, []);

    const totalServiceOrders = services.reduce((sum, s) => sum + s.totalPesanan, 0) || 1;
    const serviceMix: ServiceMixRow[] = services.slice(0, 6).map((s, i) => ({
        label: s.namaLayanan,
        percent: Math.round((s.totalPesanan / totalServiceOrders) * 100),
        color: MIX_COLORS[i % MIX_COLORS.length],
    }));

    const paymentMix: PaymentMixRow[] = payMix.map((p) => ({
        label: formatPaymentMethod(p.metode),
        amount: String(p.totalEntries),
        color: paymentMethodColor(p.metode),
    }));

    const liveRows: LiveOrderRow[] = liveOrders
        .map((o) => ({ o, status: mapOrderStatus(o.status) }))
        .filter(({ status }) => status !== 'cancelled')
        .map(({ o, status }) => {
            const est = formatDateShort(o.estimasiSelesai);
            const overdue =
                nowTs > 0 && new Date(o.estimasiSelesai).getTime() < nowTs && status !== 'completed';
            return {
                orderId: `#ORD-${String(o.id).padStart(4, '0')}`,
                customer: o.namaPelanggan,
                branch: o.namaCabang,
                status: status as 'pickup' | 'processing' | 'delivery' | 'completed',
                deadline: overdue ? `Overdue · ${est}` : est,
                isOverdue: overdue,
                total: formatIDR(o.totalHarga),
            };
        });

    const maxRevenue = Math.max(...topCabang.map((b) => b.totalRevenue), 1);
    const topBranches: TopBranchRow[] = topCabang.slice(0, 6).map((b) => ({
        initials: initialsOf(b.namaCabang),
        name: b.namaCabang,
        percentOfTarget: Math.round((b.totalRevenue / maxRevenue) * 100),
        revenue: formatIDRShort(b.totalRevenue),
    }));

    return (
        <>
            <AdminTopBar title="Dashboard" role="Super Admin" />

            <div className="flex w-full flex-col gap-[20px] p-[40px]">
                {error && (
                    <p className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
                        {error}
                    </p>
                )}

                {/* KPI row */}
                <div className="grid grid-cols-4 gap-[20px]">
                    <AdminKpiCard
                        label="Revenue Today"
                        value={umum ? formatIDRShort(umum.revenueToday) : '—'}
                        icon={<DollarSign size={16} />}
                    />
                    <AdminKpiCard
                        label="Revenue This Month"
                        value={umum ? formatIDRShort(umum.revenueThisMonth) : '—'}
                        icon={<TrendingUp size={16} />}
                    />
                    <AdminKpiCard
                        label="Orders Today"
                        value={umum ? String(umum.orderToday) : '—'}
                        icon={<Package size={16} />}
                    />
                    <AdminKpiCard
                        label="Average Rating"
                        value={umum ? umum.averageRating.toFixed(1) : '—'}
                        icon={<Star size={16} />}
                    />
                </div>

                {/* Service Mix + Payment Mix */}
                <div className="flex w-full items-stretch gap-[20px]">
                    <ServiceMixCard rows={serviceMix} />
                    <PaymentMixCard rows={paymentMix} />
                </div>

                {/* Live Orders + Top Branches */}
                <div className="flex w-full items-start gap-[20px]">
                    <LiveOrdersTable rows={liveRows} />
                    <TopBranchesCard rows={topBranches} />
                </div>

                {loading && <p className="text-[13px] text-[#6e7977]">Loading…</p>}
            </div>
        </>
    );
}
