'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import OrdersSection from '@/components/ui/customer/OrdersSection';
import OrderCard, { type OrderStep } from '@/components/ui/customer/OrderCard';

const ACTIVE_STEPS: OrderStep[] = [
    { label: 'Pickup', done: true },
    { label: 'Cuci', done: true },
    { label: 'Setrika', done: true },
    { label: 'Antar', done: false },
];

const ACTIVE_ORDERS = [
    { id: '#NL-2401', service: 'Cuci Setrika Reguler', eta: 'ETA hari ini · 14:00 WIB' },
    { id: '#NL-2402', service: 'Cuci Setrika Reguler', eta: 'ETA hari ini · 14:00 WIB' },
    { id: '#NL-2403', service: 'Cuci Setrika Reguler', eta: 'ETA hari ini · 14:00 WIB' },
];

const COMPLETED_ORDERS = [
    { id: '#NL-2388', service: 'Cuci Setrika Reguler', eta: 'Selesai · 12 Jun 16:00 WIB' },
    { id: '#NL-2389', service: 'Cuci Setrika Reguler', eta: 'Selesai · 11 Jun 15:00 WIB' },
    { id: '#NL-2390', service: 'Cuci Setrika Reguler', eta: 'Selesai · 10 Jun 18:00 WIB' },
];

export default function CustomerOrdersPage() {
    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name="Sarah Jenkins" activeVouchers={3} membership="Gold Member" />

            <div className="flex w-full flex-col gap-[40px]">
                <div className="flex items-center justify-between">
                    <h1 className="text-[20px] leading-[28px] font-bold text-[#0f172b]">My Orders</h1>
                    <Link
                        href="/customer/orders/new"
                        className="flex items-center gap-[7px] rounded-[8.75px] bg-[#0f766e] px-[16px] py-[9px] text-[12.25px] leading-[17.5px] font-semibold text-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#0d655e]"
                    >
                        <Plus size={16} /> Place New Order
                    </Link>
                </div>

                <OrdersSection title="Active Order">
                    {ACTIVE_ORDERS.map((o) => (
                        <OrderCard
                            key={o.id}
                            orderId={o.id}
                            service={o.service}
                            status="disetrika"
                            eta={o.eta}
                            steps={ACTIVE_STEPS}
                        />
                    ))}
                </OrdersSection>

                <OrdersSection title="Completed Order">
                    {COMPLETED_ORDERS.map((o) => (
                        <OrderCard
                            key={o.id}
                            orderId={o.id}
                            service={o.service}
                            status="selesai"
                            eta={o.eta}
                        />
                    ))}
                </OrdersSection>
            </div>
        </div>
    );
}
