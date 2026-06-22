'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Phone, ArrowUpDown } from 'lucide-react';

import { Branch } from '@/components/ui/admin/branchData';
import TablePagination, { usePagination } from '@/components/ui/admin/TablePagination';

interface BranchTableProps {
    branches: Branch[];
}

type SortKey = 'code' | 'name';

// Five flex columns, mirroring the Figma "Branch List" table (node 422:5563).
const COL = 'min-w-0 flex-1';
const HEAD_CELL = 'px-[16px] pt-[12px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-[#3e4947]';

// "Branch List" table card (Figma node 422:5562).
export default function BranchTable({ branches }: BranchTableProps) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);

    function toggleSort(key: SortKey) {
        setSort((cur) => (cur?.key === key ? { key, dir: cur.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
    }

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = branches.filter(
            (b) =>
                !q || [b.code, b.name, b.address, b.phone, b.hours].some((v) => v.toLowerCase().includes(q)),
        );
        if (sort) list = [...list].sort((a, b) => a[sort.key].localeCompare(b[sort.key]) * sort.dir);
        return list;
    }, [branches, query, sort]);

    const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(rows);

    const SortHead = ({ label, sortKey }: { label: string; sortKey: SortKey }) => (
        <button
            type="button"
            onClick={() => toggleSort(sortKey)}
            className={`${COL} ${HEAD_CELL} flex items-center gap-[6px] text-left transition-colors hover:text-[#181c1c]`}
        >
            {label}
            <ArrowUpDown size={12} className={sort?.key === sortKey ? 'text-[#181c1c]' : 'text-[#90a1b9]'} />
        </button>
    );

    return (
        <div className="w-full overflow-hidden rounded-[12px] border border-[#e0e3e1] bg-white">
            {/* Card header: title + search */}
            <div className="flex h-[76px] items-center justify-between border-b border-[#e0e3e1] px-[24px] pt-[24px] pb-[16px]">
                <h2 className="text-[20px] leading-[28px] font-semibold text-[#181c1c]">Branch List</h2>
                <div className="flex w-[256px] items-center gap-[13px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                    <Search size={12} className="shrink-0 text-[#6b7280]" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search branches"
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#6b7280] outline-none"
                    />
                </div>
            </div>

            {/* Column headers */}
            <div className="flex h-[40px] items-start border-b border-[#bdc9c6] bg-[#f1f4f3]">
                <SortHead label="Branch ID" sortKey="code" />
                <SortHead label="Branch Name" sortKey="name" />
                <span className={`${COL} ${HEAD_CELL}`}>Address</span>
                <span className={`${COL} ${HEAD_CELL}`}>Phone Number</span>
                <span className={`${COL} ${HEAD_CELL}`}>Operating Hours</span>
            </div>

            {/* Rows */}
            {rows.length === 0 ? (
                <p className="px-[24px] py-[20px] text-[13px] text-[#6e7977]">No branches found.</p>
            ) : (
                pageItems.map((b, i) => (
                    <Link
                        key={b.id}
                        href={`/admin/branches/${b.id}`}
                        className={`flex items-center transition-colors hover:bg-[#f7faf8] ${
                            i < pageItems.length - 1 ? 'border-b border-[#e0e3e1]' : ''
                        }`}
                    >
                        {/* Branch ID */}
                        <div className={`${COL} px-[16px] py-[16px]`}>
                            <span className="text-[14px] leading-[20px] font-medium text-[#181c1c]">{b.code}</span>
                        </div>

                        {/* Branch Name */}
                        <div className={`${COL} px-[16px] py-[16px]`}>
                            <span className="text-[14px] leading-[20px] text-[#3e4947]">{b.name}</span>
                        </div>

                        {/* Address */}
                        <div className={`${COL} px-[16px] py-[16px]`}>
                            <span className="truncate text-[14px] leading-[20px] text-[#3e4947]">{b.address}</span>
                        </div>

                        {/* Phone Number */}
                        <div className={`${COL} flex items-center gap-[6px] px-[16px] py-[16px]`}>
                            <Phone size={12} className="shrink-0 text-[#3e4947]" />
                            <span className="truncate text-[14px] leading-[20px] text-[#3e4947]">{b.phone}</span>
                        </div>

                        {/* Operating Hours */}
                        <div className={`${COL} px-[16px] py-[16px]`}>
                            <span className="text-[14px] leading-[20px] text-[#3e4947]">{b.hours}</span>
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
                label="branches"
            />
        </div>
    );
}
