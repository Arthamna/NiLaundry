import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

import { Customer, formatRupiah } from '@/components/ui/admin/customerData';

interface CustomerTableProps {
    customers: Customer[];
}

// Column proportions derived from the Figma absolute offsets
// (customer 0–366, orders →497, spend →703, last order →849, rating →1080).
const GRID = 'grid grid-cols-[minmax(0,366fr)_131fr_206fr_146fr_231fr]';
const HEAD = 'text-[11px] leading-[16.5px] font-bold tracking-[0.5px] text-[#62748e] uppercase';

// Customers table card (Figma node 357:3389).
export default function CustomerTable({ customers }: CustomerTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
            {/* Column headers */}
            <div className={`${GRID} items-center border-b border-[#e2e8f0] bg-[#f8fafc]`}>
                <span className={`${HEAD} px-[16px] py-[12px]`}>Customer</span>
                <span className={`${HEAD} py-[12px] text-right`}>Orders</span>
                <span className={`${HEAD} py-[12px] text-right`}>Total Spend</span>
                <span className={`${HEAD} py-[12px] text-right`}>Last Order</span>
                <span className={`${HEAD} py-[12px] pr-[16px] text-right`}>Avg Rating</span>
            </div>

            {/* Rows */}
            {customers.map((c) => (
                <Link
                    key={c.id}
                    href={`/admin/customers/${c.id}`}
                    className={`${GRID} items-center border-b border-[#f1f5f9] transition-colors last:border-b-0 hover:bg-[#f8fafc]`}
                >
                    {/* Customer */}
                    <div className="flex items-center gap-[12px] px-[16px] py-[14px]">
                        <span
                            className="flex size-[36px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                            style={{ backgroundImage: `linear-gradient(135deg, ${c.gradFrom} 0%, ${c.gradTo} 100%)` }}
                        >
                            {c.initials}
                        </span>
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-[14px] leading-[20px] font-semibold text-[#0f172b]">{c.name}</span>
                            <span className="truncate text-[12px] leading-[18px] text-[#62748e]">{c.phone}</span>
                        </div>
                    </div>

                    {/* Orders */}
                    <span className="py-[14px] text-right text-[14px] leading-[21px] font-medium text-[#0f172b]">
                        {c.orders}
                    </span>

                    {/* Total Spend */}
                    <span className="py-[14px] text-right text-[14px] leading-[21px] font-medium text-[#0f172b]">
                        {formatRupiah(c.totalSpend)}
                    </span>

                    {/* Last Order */}
                    <span className="py-[14px] text-right text-[14px] leading-[21px] text-[#62748e]">{c.lastOrder}</span>

                    {/* Avg Rating */}
                    <span className="flex items-center justify-end gap-[4px] py-[14px] pr-[16px]">
                        <Star size={13} className="fill-[#f59e0b] text-[#f59e0b]" />
                        <span className="text-[14px] leading-[21px] font-medium text-[#0f172b]">{c.avgRating}</span>
                    </span>
                </Link>
            ))}
        </div>
    );
}
