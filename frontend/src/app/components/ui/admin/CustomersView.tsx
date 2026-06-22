import React from 'react';
import { Search } from 'lucide-react';

import CustomerTable from '@/components/ui/admin/CustomerTable';
import { CUSTOMERS } from '@/components/ui/admin/customerData';

interface KpiCardProps {
    label: string;
    value: string;
}

function KpiCard({ label, value }: KpiCardProps) {
    return (
        <div className="rounded-[12px] border border-[#e2e8f0] bg-white p-[24px]">
            <p className="text-[13px] leading-[18px] text-[#6e7977]">{label}</p>
            <p className="pt-[4px] text-[32px] leading-[40px] font-bold tracking-[-0.72px] text-[#181c1c]">{value}</p>
        </div>
    );
}

// Customers page body shared by the list / detail routes (Figma node 357:3352).
export default function CustomersView() {
    return (
        <div className="flex w-full max-w-[1440px] flex-col gap-[24px] px-[40px] pt-[40px] pb-[96px]">
            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-x-[16px]">
                <KpiCard label="Total Customers" value="6" />
                <KpiCard label="Active (30d)" value="6" />
                <KpiCard label="AVG RATING" value="4.7" />
                <KpiCard label="Avg Spend / Cust" value="Rp 2375k" />
            </div>

            {/* Search */}
            <div className="relative h-[41px] w-full max-w-[440px]">
                <Search size={15} className="pointer-events-none absolute top-[13px] left-[14px] text-[#6e7977]" />
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama atau nomor HP..."
                    className="h-[41px] w-full rounded-[8px] border border-[#e0e3e1] bg-white py-[10px] pr-[15px] pl-[41px] text-[14px] text-[#181c1c] placeholder:text-[#6e7977] outline-none focus:border-[#005c55]"
                />
            </div>

            {/* Table */}
            <CustomerTable customers={CUSTOMERS} />
        </div>
    );
}
