import React from 'react';

import { BranchService } from '@/components/ui/admin/branchData';

interface BranchServicesTableProps {
    branchName: string;
    services: BranchService[];
    onRowClick: (service: BranchService) => void;
}

const COL = 'min-w-0 flex-1';
const HEAD_CELL = 'px-[16px] pt-[12px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-[#3e4947]';

// "<Branch> Services" table card (Figma node 466:7108).
export default function BranchServicesTable({ branchName, services, onRowClick }: BranchServicesTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-[12px] border border-[#e0e3e1] bg-white">
            {/* Card header */}
            <div className="flex h-[76px] items-center border-b border-[#e0e3e1] px-[24px] pt-[24px] pb-[16px]">
                <h2 className="text-[20px] leading-[28px] font-semibold text-[#181c1c]">{branchName} Services</h2>
            </div>

            {/* Column headers */}
            <div className="flex h-[40px] items-start border-b border-[#bdc9c6] bg-[#f1f4f3]">
                <span className={`${COL} ${HEAD_CELL}`}>ID Layanan</span>
                <span className={`${COL} ${HEAD_CELL}`}>Nama Layanan</span>
                <span className={`${COL} ${HEAD_CELL}`}>Satuan</span>
                <span className={`${COL} ${HEAD_CELL}`}>Harga per Satuan</span>
                <span className={`${COL} ${HEAD_CELL}`}>deskripsi</span>
            </div>

            {/* Rows */}
            {services.map((s, i) => (
                <button
                    key={s.id}
                    type="button"
                    onClick={() => onRowClick(s)}
                    className={`flex w-full items-center text-left transition-colors hover:bg-[#f7faf8] ${
                        i < services.length - 1 ? 'border-b border-[#e0e3e1]' : ''
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
        </div>
    );
}
