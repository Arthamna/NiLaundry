import React from 'react';
import { Ticket, TrendingUp } from 'lucide-react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import VoucherCard, { VoucherCardData } from '@/components/ui/admin/VoucherCard';

// Demo data mirrors the Figma design (node 120:7045) one-for-one.
const FILTER_TABS: { label: string; count: number }[] = [
    { label: 'All', count: 6 },
    { label: 'Active', count: 5 },
    { label: 'Expiring soon', count: 2 },
    { label: 'Used', count: 1 },
    { label: 'Expired', count: 1 },
];

const VOUCHERS: VoucherCardData[] = [
    { code: 'CUCI20', description: 'Diskon 20% Cuci Setrika', value: '20%', maxLabel: 'max Rp 30.000', quotaUsed: 58, quotaTotal: 100, expires: '30 Jun 2026', status: 'active' },
    { code: 'GRATIS-ONGKIR', description: 'Gratis penjemputan & antar', value: 'Free Ship', maxLabel: 'max Rp 10.000', quotaUsed: 12, quotaTotal: 50, expires: '10 Jun 2026', status: 'active' },
    { code: 'DRYCLEAN30', description: 'Diskon 30% Dry Clean', value: '30%', maxLabel: 'max Rp 45.000', quotaUsed: 8, quotaTotal: 30, expires: '28 Jun 2026', status: 'active' },
    { code: 'MEMBER50', description: 'Cashback Member Gold', value: 'Rp 50k', maxLabel: 'max Rp 50.000', quotaUsed: 2, quotaTotal: 20, expires: '07 Jul 2026', status: 'active' },
    { code: 'WEEKEND15', description: 'Weekend Special', value: '15%', maxLabel: 'max Rp 20.000', quotaUsed: 92, quotaTotal: 100, expires: '08 Jun 2026', status: 'active' },
    { code: 'LEBARAN', description: 'Hari Raya 30%', value: '30%', maxLabel: 'max Rp 60.000', quotaUsed: 200, quotaTotal: 200, expires: '20 Apr 2025', status: 'expired' },
];

interface StatCardProps {
    label: string;
    value: string;
    delta: string;
    icon: React.ReactNode;
}

function StatCard({ label, value, delta, icon }: StatCardProps) {
    return (
        <div className="flex flex-col items-start rounded-[12.75px] border border-[#e2e8f0] bg-white p-[18.5px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            <div className="flex w-full items-start justify-between">
                <p className="text-[10.5px] leading-[14px] font-medium text-[#62748e]">{label}</p>
                <div className="flex size-[28px] items-center justify-center rounded-[8.75px] bg-[#f0fdfa] text-[#0f766e]">
                    {icon}
                </div>
            </div>
            <p className="pt-[7px] text-[28px] leading-[42px] font-bold tracking-[-0.56px] text-[#0f172b]">{value}</p>
            <p className="pt-[3.5px] text-[10.5px] leading-[14px] font-semibold text-[#009966]">▲ {delta}</p>
        </div>
    );
}

export default function AdminVouchersPage() {
    return (
        <>
            <AdminTopBar title="Vouchers" role="Super Admin" />

            <div className="flex w-full flex-col p-[21px]">
                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-x-[16px]">
                    <StatCard
                        label="Active Vouchers"
                        value="5"
                        delta="+1 minggu ini"
                        icon={<Ticket size={16} />}
                    />
                    <StatCard
                        label="Customer Savings"
                        value="Rp 14,8jt"
                        delta="+12.4%"
                        icon={<TrendingUp size={16} />}
                    />
                </div>

                {/* Filter + grid card */}
                <div className="mt-[16px] w-full rounded-[12.75px] border border-[#e2e8f0] bg-white drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
                    {/* Filter header */}
                    <div className="flex items-center gap-[5.25px] border-b border-[#e2e8f0] px-[17.5px] pt-[10.5px] pb-[11.5px]">
                        {FILTER_TABS.map((tab, i) => {
                            const isActive = i === 0;
                            return (
                                <button
                                    key={tab.label}
                                    type="button"
                                    className={`flex items-center gap-[5.25px] rounded-full px-[10.5px] py-[3.5px] text-[10.5px] leading-[14px] font-medium ${
                                        isActive ? 'bg-[#009689] text-white' : 'bg-white text-[#314158]'
                                    }`}
                                >
                                    {tab.label}
                                    <span
                                        className={`flex h-[14px] min-w-[14px] items-center justify-center rounded-full px-[3px] text-[10.5px] leading-[14px] ${
                                            isActive ? 'bg-white/20 text-white' : 'bg-[#f1f5f9] text-[#45556c]'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                        <div className="ml-auto flex items-center gap-[7px]">
                            <button
                                type="button"
                                className="rounded-[6.75px] bg-white px-[10.5px] py-[5.25px] text-[10.5px] leading-[14px] font-medium text-[#314158] shadow-[0px_0px_0px_1px_#e2e8f0]"
                            >
                                Branch ▾
                            </button>
                            <button
                                type="button"
                                className="rounded-[6.75px] bg-white px-[10.5px] py-[5.25px] text-[10.5px] leading-[14px] font-medium text-[#314158] shadow-[0px_0px_0px_1px_#e2e8f0]"
                            >
                                Type ▾
                            </button>
                        </div>
                    </div>

                    {/* Voucher grid */}
                    <div className="grid grid-cols-3 gap-[14px] p-[16px]">
                        {VOUCHERS.map((voucher) => (
                            <VoucherCard key={voucher.code} voucher={voucher} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
