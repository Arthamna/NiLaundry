'use client';

import React, { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import BackButton from '@/components/ui/customer/BackButton';
import OrderTimeline, { type TimelineStep } from '@/components/ui/customer/OrderTimeline';
import ServicesSummary from '@/components/ui/customer/ServicesSummary';
import CourierCard from '@/components/ui/customer/CourierCard';
import OrderReviewCard from '@/components/ui/customer/OrderReviewCard';

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

function OrderDetailInner() {
    const params = useParams<{ order_id: string }>();
    const searchParams = useSearchParams();

    // Temporary placeholder so the route is testable, e.g. /customer/orders/NL-2401
    const orderId = params?.order_id ?? 'NL-2401';
    const isCompleted = searchParams.get('status') === 'completed';
    const status = isCompleted ? 'Selesai' : 'Disetrika';
    // When present (e.g. ?reviewed=4) the completed detail renders the reviewed state (node 186-2579).
    const reviewedRating = Number(searchParams.get('reviewed')) || 0;

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name="Sarah Jenkins" activeVouchers={3} membership="Gold Member" />

            <div className="flex w-full flex-col gap-[20px]">
                <BackButton href="/customer/orders" />

                <OrderTimeline orderId={`#${orderId}`} service="Cuci Setrika Reguler" status={status} steps={STEPS} />

                <ServicesSummary
                    items={SERVICES}
                    voucher={{ label: 'Voucher CUCI20', value: '-Rp 9.000' }}
                    total={{ label: 'Total', value: 'Rp 36.000' }}
                />

                {/* Completed orders show the review part; active orders show the courier. */}
                {isCompleted ? (
                    <OrderReviewCard orderId={orderId} service="Cuci Setrika Reguler" initialRating={reviewedRating} />
                ) : (
                    <CourierCard initials="BS" name="Budi Santoso" vehicle="Motor · B 4421 KZA" onChat={() => {}} />
                )}
            </div>
        </div>
    );
}

export default function OrderDetailPage() {
    return (
        <Suspense fallback={null}>
            <OrderDetailInner />
        </Suspense>
    );
}
