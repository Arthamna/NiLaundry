import React from 'react';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import OrdersStatCards from '@/components/ui/branch/OrdersStatCards';
import OrdersTable, { OrdersRow } from '@/components/ui/branch/OrdersTable';

const FILTERS = ['All', 'Pickup', 'Processing', 'Delivery', 'Completed'];

const ORDERS: OrdersRow[] = [
    {
        id: '1',
        orderId: '#ORD-9082',
        customerName: 'Anita Smith',
        customerPhone: '+62 812 3456',
        initials: 'AS',
        avatarTone: 'mint',
        estFinish: 'Today, 14:00',
        isOverdue: false,
        status: 'Delivery',
    },
    {
        id: '2',
        orderId: '#ORD-9081',
        customerName: 'Budi Kurniawan',
        customerPhone: '+62 819 8765',
        initials: 'BK',
        avatarTone: 'teal',
        estFinish: 'Tomorrow, 10:00',
        isOverdue: false,
        status: 'Completed',
    },
    {
        id: '3',
        orderId: '#ORD-9080',
        customerName: 'Citra Dewi',
        customerPhone: '+62 856 1122',
        initials: 'CD',
        avatarTone: 'gray',
        estFinish: 'Overdue (2h)',
        isOverdue: true,
        status: 'Processing',
    },
    {
        id: '4',
        orderId: '#ORD-9082',
        customerName: 'Anita Smith',
        customerPhone: '+62 812 3456',
        initials: 'AS',
        avatarTone: 'mint',
        estFinish: 'Today, 14:00',
        isOverdue: false,
        status: 'Pickup',
    },
    {
        id: '5',
        orderId: '#ORD-9081',
        customerName: 'Budi Kurniawan',
        customerPhone: '+62 819 8765',
        initials: 'BK',
        avatarTone: 'teal',
        estFinish: 'Tomorrow, 10:00',
        isOverdue: false,
        status: 'Completed',
    },
    {
        id: '6',
        orderId: '#ORD-9082',
        customerName: 'Anita Smith',
        customerPhone: '+62 812 3456',
        initials: 'AS',
        avatarTone: 'mint',
        estFinish: 'Today, 14:00',
        isOverdue: false,
        status: 'Delivery',
    },
    {
        id: '7',
        orderId: '#ORD-9080',
        customerName: 'Citra Dewi',
        customerPhone: '+62 856 1122',
        initials: 'CD',
        avatarTone: 'gray',
        estFinish: 'Overdue (2h)',
        isOverdue: true,
        status: 'Processing',
    },
    {
        id: '8',
        orderId: '#ORD-9082',
        customerName: 'Anita Smith',
        customerPhone: '+62 812 3456',
        initials: 'AS',
        avatarTone: 'mint',
        estFinish: 'Today, 14:00',
        isOverdue: false,
        status: 'Pickup',
    },
    {
        id: '9',
        orderId: '#ORD-9082',
        customerName: 'Anita Smith',
        customerPhone: '+62 812 3456',
        initials: 'AS',
        avatarTone: 'mint',
        estFinish: 'Today, 14:00',
        isOverdue: false,
        status: 'Delivery',
    },
    {
        id: '10',
        orderId: '#ORD-9080',
        customerName: 'Citra Dewi',
        customerPhone: '+62 856 1122',
        initials: 'CD',
        avatarTone: 'gray',
        estFinish: 'Overdue (2h)',
        isOverdue: true,
        status: 'Processing',
    },
];

export default function BranchOrdersPage() {
    return (
        <>
            <BranchTopBar title="Orders" branchName="Keputih Branch" />

            <div className="flex w-full flex-col gap-8 px-10 pt-10 pb-10">
                <OrdersStatCards />

                {/* Status filter chips */}
                <div className="flex items-start gap-5">
                    {FILTERS.map((label, i) => {
                        const isActive = i === 0;
                        return (
                            <button
                                key={label}
                                type="button"
                                className={`flex items-center rounded-full border text-[12px] leading-4 font-medium ${
                                    isActive
                                        ? 'border-[#005c55] bg-[#6df5e1] px-[13px] py-[3px] text-[#006f64]'
                                        : 'border-[#bdc9c6] bg-[#e5e9e7] px-[9px] py-[3px] text-[#181c1c]'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                <OrdersTable rows={ORDERS} />
            </div>
        </>
    );
}
