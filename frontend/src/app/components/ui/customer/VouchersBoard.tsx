'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
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

export default function VouchersBoard() {
    const [active, setActive] = useState('Active');
    const vouchers = VOUCHERS[active] ?? [];

    return (
        <div className="flex w-full flex-col gap-[50px]">
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

            <Link
                href="/customer/vouchers/add"
                className="relative flex w-full items-center justify-center gap-[8px] rounded-[12px] border border-[#bdc9c6] bg-white py-[16px] text-[15px] leading-[20px] font-medium text-[#bdc9c6] transition-colors hover:border-[#009689] hover:text-[#009689]"
                aria-label="Add New Voucher"
            >
                <Plus size={20} />
                Add New Voucher
            </Link>
        </div>
    );
}
