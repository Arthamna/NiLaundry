import React from 'react';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import VouchersBoard from '@/components/ui/customer/VouchersBoard';

export default function CustomerVouchersPage() {
    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader />
            <VouchersBoard />
        </div>
    );
}
