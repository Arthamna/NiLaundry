import React from 'react';
import { DollarSign, TrendingUp, Package, Star } from 'lucide-react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import AdminKpiCard from '@/components/ui/admin/AdminKpiCard';
import ServiceMixCard, { ServiceMixRow } from '@/components/ui/admin/ServiceMixCard';
import PaymentMixCard, { PaymentMixRow } from '@/components/ui/admin/PaymentMixCard';
import LiveOrdersTable, { LiveOrderRow } from '@/components/ui/admin/LiveOrdersTable';
import TopBranchesCard, { TopBranchRow } from '@/components/ui/admin/TopBranchesCard';

// Demo data mirrors the Figma design (node 120:4219) one-for-one.
const SERVICE_MIX: ServiceMixRow[] = [
    { label: 'Cuci Setrika Reguler', percent: 38, color: '#0f766e' },
    { label: 'Cuci Express', percent: 20, color: '#14b8a6' },
    { label: 'Dry Clean', percent: 15, color: '#0ea5e9' },
    { label: 'Sepatu', percent: 10, color: '#6366f1' },
    { label: 'Bed Cover', percent: 7, color: '#a855f7' },
    { label: 'Lainnya', percent: 10, color: '#94a3b8' },
];

const PAYMENT_MIX: PaymentMixRow[] = [
    { label: 'QRIS', amount: 'Rp7,1jt', color: '#00bba7' },
    { label: 'Bank', amount: 'Rp3,2jt', color: '#ffb900' },
    { label: 'Gopay', amount: 'Rp3,2jt', color: '#2b7fff' },
    { label: 'Ovo', amount: 'Rp2,1jt', color: '#ad46ff' },
];

const LIVE_ORDERS: LiveOrderRow[] = [
    { orderId: '#ORD-9082', customer: 'Anita Smith', branch: 'Tebet', status: 'delivery', deadline: 'Today, 14:00', total: 'Rp 45.000' },
    { orderId: '#ORD-9081', customer: 'Budi Kurniawan', branch: 'Kemang', status: 'completed', deadline: 'Tomorrow, 10:00', total: 'Rp 145.000' },
    { orderId: '#ORD-9080', customer: 'Citra Dewi', branch: 'BSD', status: 'processing', deadline: 'Overdue (2h)', isOverdue: true, total: 'Rp 62.000' },
    { orderId: '#ORD-9082', customer: 'Anita Smith', branch: 'Tebet', status: 'pickup', deadline: 'Today, 14:00', total: 'Rp 40.000' },
    { orderId: '#ORD-9081', customer: 'Budi Kurniawan', branch: 'Bekasi', status: 'completed', deadline: 'Tomorrow, 10:00', total: 'Rp 220.000' },
    { orderId: '#ORD-9082', customer: 'Anita Smith', branch: 'BSD', status: 'delivery', deadline: 'Today, 14:00', total: 'Rp 75.000' },
];

const TOP_BRANCHES: TopBranchRow[] = [
    { initials: 'TE', name: 'Tebet', percentOfTarget: 92, revenue: 'Rp48,2jt' },
    { initials: 'KE', name: 'Kemang', percentOfTarget: 85, revenue: 'Rp41,5jt' },
    { initials: 'BS', name: 'BSD', percentOfTarget: 78, revenue: 'Rp38,9jt' },
    { initials: 'BE', name: 'Bekasi', percentOfTarget: 70, revenue: 'Rp31,1jt' },
    { initials: 'BE', name: 'Bekasi', percentOfTarget: 70, revenue: 'Rp31,1jt' },
    { initials: 'BE', name: 'Bekasi', percentOfTarget: 70, revenue: 'Rp31,1jt' },
];

export default function AdminDashboardPage() {
    return (
        <>
            <AdminTopBar title="Dashboard" role="Super Admin" />

            <div className="flex w-full flex-col gap-[20px] p-[40px]">
                {/* KPI row */}
                <div className="grid grid-cols-4 gap-[20px]">
                    <AdminKpiCard label="Revenue Today" value="Rp12,4jt" icon={<DollarSign size={16} />} />
                    <AdminKpiCard label="Revenue This Month" value="Rp184jt" icon={<TrendingUp size={16} />} />
                    <AdminKpiCard label="Orders Today" value="142" icon={<Package size={16} />} />
                    <AdminKpiCard label="Average Rating" value="4.7" icon={<Star size={16} />} />
                </div>

                {/* Service Mix + Payment Mix */}
                <div className="flex w-full items-stretch gap-[20px]">
                    <ServiceMixCard rows={SERVICE_MIX} />
                    <PaymentMixCard rows={PAYMENT_MIX} />
                </div>

                {/* Live Orders + Top Branches */}
                <div className="flex w-full items-start gap-[20px]">
                    <LiveOrdersTable rows={LIVE_ORDERS} />
                    <TopBranchesCard rows={TOP_BRANCHES} />
                </div>
            </div>
        </>
    );
}
