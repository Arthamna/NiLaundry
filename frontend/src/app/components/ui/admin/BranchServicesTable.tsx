'use client';

import React from 'react';

import { BranchService } from '@/components/ui/admin/branchData';
import TablePagination, { usePagination } from '@/components/ui/admin/TablePagination';

interface BranchServicesTableProps {
    branchName: string;
    services: BranchService[];
    onRowClick: (service: BranchService) => void;
}

const COL = 'min-w-0 flex-1';
const HEAD_CELL = 'px-[16px] pt-[12px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-[#3e4947]';

// "<Branch> Services" table card (Figma node 466:7108).
export default function BranchServicesTable({ branchName, services, onRowClick }: BranchServicesTableProps) {
    const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(services);
    return (
        <div className="w-full overflow-hidden rounded-[12px] border border-[#e0e3e1] bg-white">
            {/* Card header */}
            <div className="flex h-[76px] items-center border-b border-[#e0e3e1] px-[24px] pt-[24px] pb-[16px]">
                <h2 className="text-[20px] leading-[28px] font-semibold text-[#181c1c]">{branchName} Services</h2>
            </div>

            {/* Column headers */}
            <div className="flex h-[40px] items-start border-b border-[#bdc9c6] bg-[#f1f4f3]">
                <span className={`${COL} ${HEAD_CELL}`}>Service ID</span>
                <span className={`${COL} ${HEAD_CELL}`}>Service Name</span>
                <span className={`${COL} ${HEAD_CELL}`}>Unit</span>
                <span className={`${COL} ${HEAD_CELL}`}>Price per Unit</span>
                <span className={`${COL} ${HEAD_CELL}`}>Description</span>
            </div>

            {/* Rows */}
            {pageItems.map((s, i) => (
                <button
                    key={s.id}
                    type="button"
                    onClick={() => onRowClick(s)}
                    className={`flex w-full items-center text-left transition-colors hover:bg-[#f7faf8] ${
                        i < pageItems.length - 1 ? 'border-b border-[#e0e3e1]' : ''
                    }`}
                >
                    <div className={`${COL} px-[16px] py-[16px]`}>
                        <span className="text-[14px] leading-[20px] font-medium text-[#181c1c]">{s.code}</span>
                    </div>
                    <div className={`${COL} px-[16px] py-[16px]`}>
                        <span className="text-[14px] leading-[20px] text-[#3e4947]">{s.name}</span>
                    </div>
                    <div className={`${COL} px-[16px] py-[16px]`}>
                        <span className="text-[14px] leading-[20px] text-[#3e4947]">{s.unit}</span>
                    </div>
                    <div className={`${COL} px-[16px] py-[16px]`}>
                        <span className="text-[14px] leading-[20px] text-[#3e4947]">{s.price}</span>
                    </div>
                    <div className={`${COL} px-[16px] py-[16px]`}>
                        <span className="truncate text-[14px] leading-[20px] text-[#3e4947]">{s.description}</span>
                    </div>
                </button>
            ))}

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
