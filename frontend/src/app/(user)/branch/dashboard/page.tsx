import React from 'react';
import { Calendar, ClipboardList, Wallet } from 'lucide-react';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import KpiCard from '@/components/ui/branch/KpiCard';
import RecentOrdersTable, { OrderRow } from '@/components/ui/branch/RecentOrdersTable';
import RecentPaymentsTable, { PaymentRow } from '@/components/ui/branch/RecentPaymentsTable';

const ORDERS: OrderRow[] = [
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
        id: '3',
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
        id: '4',
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
        id: '5',
        orderId: '#ORD-9082',
        customerName: 'Anita Smith',
        customerPhone: '+62 812 3456',
        initials: 'AS',
        avatarTone: 'mint',
        estFinish: 'Today, 14:00',
        isOverdue: false,
        status: 'Pickup',
    },
];

const PAYMENTS: PaymentRow[] = [
    {
        id: '1',
        invoiceId: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '24 Oct, 14:30',
        method: 'QRIS',
        amount: 'Rp 45.000',
    },
    {
        id: '2',
        invoiceId: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '24 Oct, 09:45',
        method: 'BANK',
        amount: 'Rp 120.000',
    },
    {
        id: '3',
        invoiceId: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '23 Oct, 16:20',
        method: 'GOPAY',
        amount: 'Rp 85.000',
    },
    {
        id: '4',
        invoiceId: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '23 Oct, 10:05',
        method: 'OVO',
        amount: 'Rp 60.000',
    },
];

export default function BranchDashboardPage() {
    return (
        <>
            <BranchTopBar title="Dashboard" branchName="Keputih Branch" />

            <div className="flex w-full max-w-[1440px] flex-col gap-6 px-10 pt-10 pb-24">
                {/* Page header */}
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
                            Oct 24, 2023
                        </span>
                    </div>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-2 gap-6">
                    <KpiCard label="Todays Order" value="42" icon={<ClipboardList size={24} />} />
                    <KpiCard label="Todays Revenue" value="Rp1.000.000" icon={<Wallet size={24} />} />
                </div>

                {/* Tables */}
                <RecentOrdersTable rows={ORDERS} />
                <RecentPaymentsTable rows={PAYMENTS} />
            </div>
        </>
    );
}
