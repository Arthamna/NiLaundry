'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import BackButton from '@/components/ui/customer/BackButton';
import OrderTimeline, { type TimelineStep } from '@/components/ui/customer/OrderTimeline';
import ServicesSummary from '@/components/ui/customer/ServicesSummary';
import CourierCard from '@/components/ui/customer/CourierCard';

const STEPS: TimelineStep[] = [
    { title: 'Pickup Assigned', time: '06 Jun 09:12', state: 'done' },
    { title: 'Pickup Completed', time: '06 Jun 10:35', state: 'done' },
    { title: 'Processing', time: '06 Jun 11:00', state: 'done' },
    { title: 'Washing', time: '06 Jun 13:00', state: 'done' },
    { title: 'Ironing', time: 'Est. 07 Jun 11:00', state: 'current' },
    { title: 'QC', time: '—', state: 'pending' },
    { title: 'Delivery', time: 'Est. 07 Jun 14:00', state: 'pending' },
];

const SERVICES = [
    { label: 'Cuci Setrika 3kg', value: 'Rp 30.000' },
    { label: 'Pewangi Premium', value: 'Rp 5.000' },
    { label: 'Pickup & Delivery', value: 'Rp 10.000' },
];

export default function OrderDetailPage() {
    const params = useParams<{ order_id: string }>();
    // Temporary placeholder so the route is testable, e.g. /customer/orders/NL-2401
    const orderId = params?.order_id ?? 'NL-2401';

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name="Sarah Jenkins" activeVouchers={3} membership="Gold Member" />

            <div className="flex w-full flex-col gap-[20px]">
                <BackButton href="/customer/orders" />

                <OrderTimeline
                    orderId={`#${orderId}`}
                    service="Cuci Setrika Reguler"
                    status="Disetrika"
                    steps={STEPS}
                />

                <ServicesSummary
                    items={SERVICES}
                    voucher={{ label: 'Voucher CUCI20', value: '-Rp 9.000' }}
                    total={{ label: 'Total', value: 'Rp 36.000' }}
                />

                <CourierCard initials="BS" name="Budi Santoso" vehicle="Motor · B 4421 KZA" onChat={() => {}} />
            </div>
        </div>
    );
}
