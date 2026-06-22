'use client';

import React from 'react';

import TablePagination, { usePagination } from '@/components/ui/admin/TablePagination';

export interface ServiceRankRow {
    rank: number;
    service: string;
    orders: string;
    revenue: string;
}

interface ServiceRankingTableProps {
    rows: ServiceRankRow[];
}

// Column widths derived from the Figma absolute offsets (node 120:8208+):
// # @17.5, Service @42.92, Orders @385.91, Revenue @523.89.
const COL_RANK = 'w-[25.42px]';
const COL_SERVICE = 'w-[342.99px]';
const COL_ORDERS = 'w-[137.98px]';

// Service Ranking table card (Figma node 120:8200).
export default function ServiceRankingTable({ rows }: ServiceRankingTableProps) {
    const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(rows);
    return (
        <div className="flex w-full flex-col rounded-[12.75px] border border-[#e2e8f0] bg-white p-px drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            {/* Header */}
            <div className="flex w-full items-start justify-between border-b border-[#e2e8f0] px-[17.5px] pt-[14px] pb-[15px]">
                <div className="flex flex-col">
                    <h3 className="text-[15px] leading-[22.5px] font-semibold text-[#0f172b]">Service Ranking</h3>
                    <p className="pt-[1.75px] text-[10.5px] leading-[14px] text-[#62748e]">Performance per service</p>
                </div>
            </div>

            {/* Table */}
            <div className="flex w-full flex-col">
                {/* Column headers */}
                <div className="flex w-full items-center border-b border-[#e2e8f0] px-[17.5px] py-[7.75px] text-[11px] leading-[15.714px] font-semibold tracking-[0.55px] text-[#62748e] uppercase">
                    <span className={COL_RANK}>#</span>
                    <span className={COL_SERVICE}>Service</span>
                    <span className={COL_ORDERS}>Orders</span>
                    <span className="flex-1">Revenue</span>
                </div>

                {/* Rows */}
                {pageItems.map((row, i) => (
                    <div
                        key={row.rank}
                        className={`flex w-full items-center px-[17.5px] py-[11px] text-[12.25px] leading-[17.5px] ${
                            i < pageItems.length - 1 ? 'border-b border-[#f1f5f9]' : ''
                        }`}
                    >
                        <span className={`${COL_RANK} text-[#62748e]`}>{row.rank}</span>
                        <span className={`${COL_SERVICE} font-medium text-[#0f172b]`}>{row.service}</span>
                        <span className={`${COL_ORDERS} text-[#0f172b]`}>{row.orders}</span>
                        <span className="flex-1 text-[#0f172b]">{row.revenue}</span>
                    </div>
                ))}
            </div>

            <TablePagination
                page={page}
                pageCount={pageCount}
                total={total}
                pageSize={pageSize}
                onPage={setPage}
                label="services"
            />
        </div>
    );
}
