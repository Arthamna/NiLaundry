'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown } from 'lucide-react';

import { Courier, AVATAR_GRADIENT } from '@/components/ui/admin/courierData';
import TablePagination, { usePagination } from '@/components/ui/admin/TablePagination';

interface CourierTableProps {
    couriers: Courier[];
}

type SortKey = 'name' | 'vehicleType' | 'plate';

// Four equal-width columns spread across the row (the backend exposes no
// pickup/delivery counters per courier, so those Figma columns are dropped).
const COL = 'flex min-w-0 flex-1 items-center px-[16px]';
const HEAD =
    'font-semibold uppercase tracking-[0.55px] text-[#62748e] text-[11px] leading-[15.714px] whitespace-nowrap';
const CELL = 'text-[#62748e] text-[12.25px] leading-[17.5px]';

// "Couriers" table card (Figma node 120:6356).
export default function CourierTable({ couriers }: CourierTableProps) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);

    function toggleSort(key: SortKey) {
        setSort((cur) => (cur?.key === key ? { key, dir: cur.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
    }

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = couriers.filter(
            (c) => !q || [c.name, c.vehicleType, c.plate, c.phone].some((v) => v.toLowerCase().includes(q)),
        );
        if (sort) list = [...list].sort((a, b) => a[sort.key].localeCompare(b[sort.key]) * sort.dir);
        return list;
    }, [couriers, query, sort]);

    const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(rows);

    const SortHead = ({ label, sortKey }: { label: string; sortKey: SortKey }) => (
        <button
            type="button"
            onClick={() => toggleSort(sortKey)}
            className={`${COL} ${HEAD} gap-[6px] text-left transition-colors hover:text-[#0f172b]`}
        >
            {label}
            <ArrowUpDown size={11} className={sort?.key === sortKey ? 'text-[#0f172b]' : 'text-[#90a1b9]'} />
        </button>
    );

    return (
        <div className="w-full overflow-hidden rounded-[12.75px] border border-[#e2e8f0] bg-white drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            {/* Card header: title + search */}
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-[17.5px] pt-[14px] pb-[15px]">
                <h2 className="text-[15px] leading-[22.5px] font-semibold text-[#0f172b]">Couriers</h2>
                <div className="flex w-[256px] items-center gap-[13px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                    <Search size={12} className="shrink-0 text-[#6b7280]" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search couriers"
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172b] placeholder:text-[#6b7280] outline-none"
                    />
                </div>
            </div>

            {/* Column headers */}
            <div className="flex items-center border-b border-[#e2e8f0] px-[18px] py-[8px]">
                <SortHead label="Courier Name" sortKey="name" />
                <SortHead label="Vehicle" sortKey="vehicleType" />
                <SortHead label="Plate" sortKey="plate" />
                <span className={`${COL} ${HEAD}`}>Phone Number</span>
            </div>

            {/* Rows */}
            {rows.length === 0 ? (
                <p className="px-[18px] py-[16px] text-[12.25px] text-[#62748e]">No couriers found.</p>
            ) : (
                pageItems.map((c) => (
                    <Link
                        key={c.id}
                        href={`/admin/couriers/${c.id}`}
                        className="flex items-center border-b border-[#f1f5f9] px-[18px] py-[11px] transition-colors hover:bg-[#f7faf8]"
                    >
                        {/* Courier Name */}
                        <div className={`${COL} gap-[8.75px]`}>
                            <span
                                className="flex size-[32px] shrink-0 items-center justify-center rounded-full text-[12.16px] font-semibold text-white"
                                style={{ backgroundImage: AVATAR_GRADIENT }}
                            >
                                {c.initials}
                            </span>
                            <span className="truncate text-[12.25px] leading-[17.5px] font-medium text-[#0f172b]">
                                {c.name}
                            </span>
                        </div>

                        {/* Vehicle type */}
                        <div className={COL}>
                            <span className={`truncate ${CELL}`}>{c.vehicleType}</span>
                        </div>

                        {/* Plate */}
                        <div className={COL}>
                            <span className={`truncate ${CELL}`}>{c.plate}</span>
                        </div>

                        {/* Phone Number */}
                        <div className={COL}>
                            <span className="truncate text-[14px] leading-[17.5px] text-[#62748e]">{c.phone}</span>
                        </div>
                    </Link>
                ))
            )}

            <TablePagination
                page={page}
                pageCount={pageCount}
                total={total}
                pageSize={pageSize}
                onPage={setPage}
                label="couriers"
            />
        </div>
    );
}
