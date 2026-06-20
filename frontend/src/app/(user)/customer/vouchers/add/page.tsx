import React from 'react';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import VouchersBoard from '@/components/ui/customer/VouchersBoard';
import RedeemCodeDialog from '@/components/ui/customer/RedeemCodeDialog';

export default function AddVoucherPage() {
    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name="Sarah Jenkins" activeVouchers={3} membership="Gold Member" />
            <VouchersBoard />
            <RedeemCodeDialog />
        </div>
    );
}
