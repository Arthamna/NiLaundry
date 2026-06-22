'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Star, ArrowUpDown } from 'lucide-react';

import { Customer, formatRupiah } from '@/components/ui/admin/customerData';
import TablePagination, { usePagination } from '@/components/ui/admin/TablePagination';

interface CustomerTableProps {
    customers: Customer[];
}

type SortKey = 'name' | 'orders' | 'totalSpend' | 'avgRating';

// Column proportions derived from the Figma absolute offsets
// (customer 0–366, orders →497, spend →703, last order →849, rating →1080).
const GRID =
    'grid grid-cols-[minmax(0,366fr)_minmax(0,131fr)_minmax(0,206fr)_minmax(0,146fr)_minmax(0,231fr)]';
const HEAD = 'text-[11px] leading-[16.5px] font-bold tracking-[0.5px] text-[#62748e] uppercase';

// Customers table card (Figma node 357:3389).
export default function CustomerTable({ customers }: CustomerTableProps) {
    const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);

    function toggleSort(key: SortKey) {
        setSort((cur) => (cur?.key === key ? { key, dir: cur.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
    }

    const rows = useMemo(() => {
        if (!sort) return customers;
        return [...customers].sort((a, b) => {
            if (sort.key === 'name') return a.name.localeCompare(b.name) * sort.dir;
            return ((a[sort.key] as number) - (b[sort.key] as number)) * sort.dir;
        });
    }, [customers, sort]);

    const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(rows);

    const SortHead = ({ label, sortKey, align }: { label: string; sortKey: SortKey; align: 'left' | 'right' }) => (
        <button
            type="button"
            onClick={() => toggleSort(sortKey)}
            className={`${HEAD} flex items-center gap-[5px] py-[12px] transition-colors hover:text-[#0f172b] ${
                align === 'right' ? 'justify-end pr-[24px]' : 'px-[24px]'
            }`}
        >
            {label}
            <ArrowUpDown size={11} className={sort?.key === sortKey ? 'text-[#0f172b]' : 'text-[#90a1b9]'} />
        </button>
    );

    return (
        <div className="w-full overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
            {/* Column headers */}
            <div className={`${GRID} items-center border-b border-[#e2e8f0] bg-[#f8fafc]`}>
                <SortHead label="Customer" sortKey="name" align="left" />
                <SortHead label="Orders" sortKey="orders" align="right" />
                <SortHead label="Total Spend" sortKey="totalSpend" align="right" />
                <span className={`${HEAD} py-[12px] text-right`}>Last Order</span>
                <SortHead label="Avg Rating" sortKey="avgRating" align="right" />
            </div>

            {/* Rows */}
            {rows.length === 0 ? (
                <p className="px-[16px] py-[20px] text-[13px] text-[#62748e]">No customers found.</p>
            ) : (
                pageItems.map((c) => (
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
                ))
            )}

            <TablePagination
                page={page}
                pageCount={pageCount}
                total={total}
                pageSize={pageSize}
                onPage={setPage}
                label="customers"
            />
        </div>
    );
}
