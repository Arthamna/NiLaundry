'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, ClipboardList, Wallet } from 'lucide-react';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import KpiCard from '@/components/ui/branch/KpiCard';
import RecentOrdersTable, { OrderRow } from '@/components/ui/branch/RecentOrdersTable';
import RecentPaymentsTable, { PaymentRow } from '@/components/ui/branch/RecentPaymentsTable';
import RecentReviewsTable, { ReviewRow } from '@/components/ui/branch/RecentReviewsTable';
import {
    adminApi,
    getApiErrorMessage,
    getCurrentCabangId,
    type AdminOrder,
    type AdminPayment,
    type OrderStatistik,
    type UlasanAdmin,
} from '@/lib/api';
import {
    avatarToneFor,
    formatDateLong,
    formatEstFinish,
    formatIDR,
    formatInvoiceId,
    formatOrderId,
    initialsOf,
    mapOrderStatus,
} from '@/components/ui/branch/format';

function toOrderRow(o: AdminOrder): OrderRow {
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

function toPaymentRow(p: AdminPayment): PaymentRow {
    return {
        id: String(p.id),
        invoiceId: formatInvoiceId(p.id),
        customerName: p.pelangganNama,
        customerPhone: p.pelangganNoTelp,
        date: formatDateLong(p.waktu),
        method: p.metode.toUpperCase(),
        amount: formatIDR(p.jumlah),
    };
}

function toReviewRow(u: UlasanAdmin): ReviewRow {
    return {
        id: String(u.id),
        initials: initialsOf(u.pelangganNama),
        avatarTone: avatarToneFor(u.pelangganId),
        customerName: u.pelangganNama,
        orderId: formatOrderId(u.pesananId),
        rating: u.rating,
        text: u.komentar,
        date: '', // schema has no ulasan.waktu_ulasan
    };
}

export default function BranchDashboardPage() {
    const cabangId = useMemo(() => getCurrentCabangId(), []);
    const [stats, setStats] = useState<OrderStatistik | null>(null);
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [payments, setPayments] = useState<AdminPayment[]>([]);
    const [reviews, setReviews] = useState<UlasanAdmin[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (cabangId == null) {
            setError('Sesi cabang tidak ditemukan. Silakan login ulang sebagai admin cabang.');
            setIsLoading(false);
            return;
        }
        const controller = new AbortController();
        Promise.all([
            adminApi.getOrderStatistik(cabangId, controller.signal),
            adminApi.listOrders(cabangId, { page: 1, limit: 5 }, controller.signal),
            adminApi.listPayments(cabangId, { limit: 5 }, controller.signal),
            adminApi.listReviews(cabangId, { limit: 3 }, controller.signal),
        ])
            .then(([s, o, p, r]) => {
                setStats(s);
                setOrders(o);
                setPayments(p);
                setReviews(r);
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, [cabangId]);

    const todayLabel = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    return (
        <>
            <BranchTopBar title="Dashboard" />

            <div className="flex w-full max-w-[1440px] flex-col gap-6 px-10 pt-10 pb-24">
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-[14px] leading-5 font-medium text-[#3e4947]">
                            {`Today's Performance`}
                        </span>
                        <h3 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                            Operational Dashboard
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 rounded-[8px] border border-[#e0e3e1] bg-white px-[13px] py-[7px]">
                        <Calendar size={13} className="text-[#3e4947]" />
                        <span className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947]">
                            {todayLabel}
                        </span>
                    </div>
                </div>

                {error && (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-6">
                    <KpiCard
                        label="Todays Order"
                        value={isLoading ? '…' : String(stats?.todaysOrder ?? 0)}
                        icon={<ClipboardList size={24} />}
                    />
                    <KpiCard
                        label="Todays Revenue"
                        value={isLoading ? '…' : formatIDR(stats?.todaysRevenue ?? 0)}
                        icon={<Wallet size={24} />}
                    />
                </div>

                <RecentOrdersTable rows={orders.map(toOrderRow)} />
                <RecentPaymentsTable rows={payments.map(toPaymentRow)} />
                <RecentReviewsTable rows={reviews.map(toReviewRow)} />
            </div>
        </>
    );
}
