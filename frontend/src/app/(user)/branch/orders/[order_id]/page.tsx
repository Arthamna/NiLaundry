'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import OrdersStatCards from '@/components/ui/branch/OrdersStatCards';
import OrdersTable, { OrdersRow } from '@/components/ui/branch/OrdersTable';
import OrderStatusDrawer from '@/components/ui/branch/OrderStatusDrawer';

const FILTERS = ['All', 'Pickup', 'Processing', 'Ready', 'Completed'];

// Faded backdrop rows (dimmed behind the drawer scrim).
const ORDERS: OrdersRow[] = [
    { id: '1', orderId: '#ORD-9082', customerName: 'Anita Smith', customerPhone: '+62 812 3456', initials: 'AS', avatarTone: 'mint', estFinish: 'Today, 14:00', isOverdue: false, status: 'Delivery' },
    { id: '2', orderId: '#ORD-9081', customerName: 'Budi Kurniawan', customerPhone: '+62 819 8765', initials: 'BK', avatarTone: 'teal', estFinish: 'Tomorrow, 10:00', isOverdue: false, status: 'Completed' },
    { id: '3', orderId: '#ORD-9080', customerName: 'Citra Dewi', customerPhone: '+62 856 1122', initials: 'CD', avatarTone: 'gray', estFinish: 'Overdue (2h)', isOverdue: true, status: 'Processing' },
    { id: '4', orderId: '#ORD-9082', customerName: 'Anita Smith', customerPhone: '+62 812 3456', initials: 'AS', avatarTone: 'mint', estFinish: 'Today, 14:00', isOverdue: false, status: 'Pickup' },
];

const ITEMS = [
    { service: 'Wash & Fold', weightQty: '5 kg' },
    { service: 'Wash & Fold', weightQty: '5 kg' },
    { service: 'Wash & Fold', weightQty: '5 kg' },
];

function OrderDetailInner() {
    const params = useParams<{ order_id: string }>();
    const orderId = params?.order_id ?? 'NL-9082';

    return (
        <>
            {/* Orders page behind the drawer */}
            <BranchTopBar title="Orders" branchName="Keputih Branch" />
            <div className="flex w-full flex-col gap-8 px-10 pt-10 pb-10">
                <OrdersStatCards />
                <div className="flex items-start gap-5">
                    {FILTERS.map((label, i) => (
                        <span
                            key={label}
                            className={`flex items-center rounded-full border text-[12px] leading-4 font-medium ${
                                i === 0
                                    ? 'border-[#005c55] bg-[#6df5e1] px-[13px] py-[3px] text-[#006f64]'
                                    : 'border-[#bdc9c6] bg-[#e5e9e7] px-[9px] py-[3px] text-[#181c1c]'
                            }`}
                        >
                            {label}
                        </span>
                    ))}
                </div>
                <OrdersTable rows={ORDERS} />
            </div>

            {/* Scrim over the main content area (sidebar stays visible) */}
            <Link
                href="/branch/orders"
                aria-label="Close order detail"
                className="fixed inset-y-0 right-0 left-20 z-30 bg-white/60 backdrop-blur-[2px]"
            />

            {/* Right-side status drawer */}
            <OrderStatusDrawer
                orderId={orderId}
                statusLabel="Dicuci"
                currentStatus="Dicuci (Processing)"
                estCompletion="20-06-2026  04:30 PM"
                totalItem={3}
                items={ITEMS}
                closeHref="/branch/orders"
            />
        </>
    );
}

export default function BranchOrderDetailPage() {
    return (
        <Suspense fallback={null}>
            <OrderDetailInner />
        </Suspense>
    );
}
