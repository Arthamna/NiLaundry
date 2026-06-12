'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import VoucherTabs from '@/components/ui/customer/VoucherTabs';
import VoucherCard from '@/components/ui/customer/VoucherCard';

interface Voucher {
    amount: string;
    code: string;
    description: string;
    expiry: string;
}

const TABS = ['Active', 'Used', 'Expired'];

const VOUCHERS: Record<string, Voucher[]> = {
    Active: [
        { amount: 'Rp 30.000', code: 'CUCI20', description: 'Diskon 20% · Cuci Setrika', expiry: '12 hari lagi' },
        { amount: 'Rp 30.000', code: 'CUCI20', description: 'Diskon 20% · Cuci Setrika', expiry: '12 hari lagi' },
        { amount: 'Rp 30.000', code: 'CUCI20', description: 'Diskon 20% · Cuci Setrika', expiry: '12 hari lagi' },
    ],
    Used: [],
    Expired: [],
};

export default function CustomerVouchersPage() {
    const [active, setActive] = useState('Active');
    const vouchers = VOUCHERS[active] ?? [];

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name="Sarah Jenkins" activeVouchers={3} membership="Gold Member" />

            <div className="flex w-full flex-col gap-[30px]">
                <VoucherTabs tabs={TABS} active={active} onChange={setActive} />

                <div className="flex w-full flex-col gap-[20px]">
                    {vouchers.map((v, i) => (
                        <VoucherCard
                            key={i}
                            amount={v.amount}
                            code={v.code}
                            description={v.description}
                            expiry={v.expiry}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
