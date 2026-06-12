'use client';

import React from 'react';
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
    { id: '#NL-2401', service: 'Cuci Setrika Reguler', eta: 'ETA hari ini · 14:00 WIB' },
    { id: '#NL-2401', service: 'Cuci Setrika Reguler', eta: 'ETA hari ini · 14:00 WIB' },
];

const COMPLETED_ORDERS = [
    { id: '#NL-2401', service: 'Cuci Setrika Reguler', eta: 'ETA hari ini · 14:00 WIB' },
    { id: '#NL-2401', service: 'Cuci Setrika Reguler', eta: 'ETA hari ini · 14:00 WIB' },
    { id: '#NL-2401', service: 'Cuci Setrika Reguler', eta: 'ETA hari ini · 14:00 WIB' },
];

export default function CustomerOrdersPage() {
    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name="Sarah Jenkins" activeVouchers={3} membership="Gold Member" />

            <div className="flex w-full flex-col gap-[40px]">
                <OrdersSection title="Active Order">
                    {ACTIVE_ORDERS.map((o, i) => (
                        <OrderCard
                            key={i}
                            orderId={o.id}
                            service={o.service}
                            status="disetrika"
                            eta={o.eta}
                            steps={ACTIVE_STEPS}
                        />
                    ))}
                </OrdersSection>

                <OrdersSection title="Completed Order">
                    {COMPLETED_ORDERS.map((o, i) => (
                        <OrderCard
                            key={i}
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
