'use client';
import React, { useEffect, useState } from 'react';
import { Truck, PackageCheck, WashingMachine, CheckCircle2 } from 'lucide-react';

import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import StatsGrid from '@/components/ui/customer/StatsGrid';
import OrderProgress from '@/components/ui/customer/OrderProgress';
import RecentActivity from '@/components/ui/customer/RecentActivity';
import VouchersPanel from '@/components/ui/customer/VouchersPanel';
import QuickActions from '@/components/ui/customer/QuickActions';
import { getCachedPelanggan, pelangganApi, type Pelanggan } from '@/lib/api';

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
    {
        id: '1',
        message: 'Your laundry order #NIL-8842 has started washing.',
        timestamp: '10 minutes ago',
        isActive: true,
    },
    {
        id: '2',
        message: 'New voucher unlocked! Use GOLD20 for 20% off your next express service.',
        timestamp: '2 hours ago',
    },
    {
        id: '3',
        message: 'Payment for order #NIL-8839 successful.',
        timestamp: 'Yesterday',
    },
];

export default function CustomerDashboardPage() {
    // Start with cached profile so the name doesn't flicker on reload; refresh
    // from GET /pelanggan/me in the background to pick up any edits.
    const [profile, setProfile] = useState<Pelanggan | null>(() => getCachedPelanggan());

    useEffect(() => {
        const controller = new AbortController();
        pelangganApi
            .getMe(controller.signal)
            .then(setProfile)
            .catch(() => {
                // ignore — header falls back to cached profile / placeholder
            });
        return () => controller.abort();
    }, []);

    const displayName = profile?.nama ?? 'Pelanggan';

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name={displayName} activeVouchers={3} membership="Gold Member" />
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
