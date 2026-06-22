'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Max rows shown per page across every admin table / review list.
export const PAGE_SIZE = 10;

interface Pagination<T> {
    page: number;
    setPage: (p: number) => void;
    pageCount: number;
    pageItems: T[];
    total: number;
    pageSize: number;
}

// Slices a list into fixed-size pages and clamps the page when the list shrinks
// (e.g. after filtering/searching). Shared by all admin tables.
export function usePagination<T>(items: T[], pageSize = PAGE_SIZE): Pagination<T> {
    const [page, setPage] = useState(1);
    const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

    useEffect(() => {
        if (page > pageCount) setPage(1);
    }, [page, pageCount]);

    const safePage = Math.min(page, pageCount);
    const pageItems = useMemo(
        () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
        [items, safePage, pageSize],
    );

    return { page: safePage, setPage, pageCount, pageItems, total: items.length, pageSize };
}

// Builds a compact page-number window with ellipses, e.g. 1 … 4 5 6 … 12.
function pageWindow(page: number, pageCount: number): (number | 'gap')[] {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const out: (number | 'gap')[] = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(pageCount - 1, page + 1);
    if (start > 2) out.push('gap');
    for (let p = start; p <= end; p++) out.push(p);
    if (end < pageCount - 1) out.push('gap');
    out.push(pageCount);
    return out;
}

interface TablePaginationProps {
    page: number;
    pageCount: number;
    total: number;
    pageSize: number;
    onPage: (p: number) => void;
    /** Noun shown in the count, e.g. "orders", "reviews". */
    label?: string;
}

// Footer with "Showing X–Y of Z" plus prev / numbered / next controls.
export default function TablePagination({
    page,
    pageCount,
    total,
    pageSize,
    onPage,
    label = 'entries',
}: TablePaginationProps) {
    if (total === 0) return null;
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);
    const btn =
        'flex h-[30px] min-w-[30px] items-center justify-center rounded-[8px] border border-[#e2e8f0] px-[8px] text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

    return (
        <div className="flex flex-wrap items-center justify-between gap-[12px] px-[18px] py-[12px]">
            <span className="text-[13px] leading-[20px] text-[#64748b]">
                Showing {from}–{to} of {total} {label}
            </span>

            {pageCount > 1 && (
                <div className="flex items-center gap-[4px]">
                    <button
                        type="button"
                        onClick={() => onPage(page - 1)}
                        disabled={page <= 1}
                        aria-label="Previous page"
                        className={`${btn} text-[#3e4947] hover:bg-[#f1f5f9]`}
                    >
                        <ChevronLeft size={15} />
                    </button>

                    {pageWindow(page, pageCount).map((p, i) =>
                        p === 'gap' ? (
                            <span key={`gap-${i}`} className="px-[4px] text-[13px] text-[#94a3b8]">
                                …
                            </span>
                        ) : (
                            <button
                                key={p}
                                type="button"
                                onClick={() => onPage(p)}
                                aria-current={p === page}
                                className={`${btn} ${
                                    p === page
                                        ? 'border-[#005c55] bg-[#005c55] text-white'
                                        : 'text-[#3e4947] hover:bg-[#f1f5f9]'
                                }`}
                            >
                                {p}
                            </button>
                        ),
                    )}

                    <button
                        type="button"
                        onClick={() => onPage(page + 1)}
                        disabled={page >= pageCount}
                        aria-label="Next page"
                        className={`${btn} text-[#3e4947] hover:bg-[#f1f5f9]`}
                    >
                        <ChevronRight size={15} />
                    </button>
                </div>
            )}
        </div>
    );
}
