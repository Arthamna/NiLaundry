'use client';
import React from 'react';
import { Truck, PackageCheck, WashingMachine, CheckCircle2 } from 'lucide-react';

import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import StatsGrid from '@/components/ui/customer/StatsGrid';
import OrderProgress from '@/components/ui/customer/OrderProgress';
import RecentActivity from '@/components/ui/customer/RecentActivity';
import VouchersPanel from '@/components/ui/customer/VouchersPanel';
import QuickActions from '@/components/ui/customer/QuickActions';
import { getCachedPengguna } from '@/lib/api';

const STEPS = [
    { label: 'Pickup', sublabel: '9:15 AM', icon: <Truck size={18} />, status: 'done' as const },
    { label: 'Processing', sublabel: '10:30 AM', icon: <PackageCheck size={18} />, status: 'done' as const },
    { label: 'Washing', sublabel: 'In Progress', icon: <WashingMachine size={18} />, status: 'active' as const },
    { label: 'Delivery', sublabel: 'Pending', icon: <CheckCircle2 size={18} />, status: 'pending' as const },
];

const VOUCHERS = [
    { code: 'GOLD20', title: '20% Discount', description: 'Express Laundry Only', expiresIn: 'Expires in 3 days' },
    { code: 'FREESHIP', title: 'Free Shipping', description: 'Min. spend $20.00', expiresIn: 'Expires in 12 days' },
];

const ACTIVITY = [
    { id: '1', message: 'Order #NIL-8842 sedang dicuci.', timestamp: '10 menit lalu', isActive: true },
    { id: '2', message: 'Pegawai baru ditugaskan di cabang Anda.', timestamp: '2 jam lalu' },
    { id: '3', message: 'Pembayaran untuk pesanan #NIL-8839 berhasil.', timestamp: 'Kemarin' },
];

export default function AdminDashboardPage() {
    const pengguna = getCachedPengguna();
    const displayName = pengguna?.nama ?? 'Admin';
    const membership = pengguna?.cabangId != null ? `Admin Cabang ${pengguna.cabangId}` : 'Admin';

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name={displayName} activeVouchers={0} membership={membership} />
            <StatsGrid activeOrders={2} completedOrders={48} totalSaved="$124.50" />
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 flex flex-col gap-6">
                    <OrderProgress
                        orderId="NIL-8842"
                        estimatedTime="Today, 5:00 PM"
                        statusLabel="Dicuci (Processing)"
                        steps={STEPS}
                    />
                    <RecentActivity items={ACTIVITY} />
                </div>
                <div className="col-span-4 flex flex-col gap-6">
                    <VouchersPanel vouchers={VOUCHERS} />
                    <QuickActions onPlaceOrder={() => {}} />
                </div>
            </div>
        </div>
    );
}
