import React from 'react';
import Link from 'next/link';
import { Search, Phone } from 'lucide-react';

import { Branch } from '@/components/ui/admin/branchData';

interface BranchTableProps {
    branches: Branch[];
}

// Five flex columns, mirroring the Figma "Daftar Cabang" table (node 422:5563).
const COL = 'min-w-0 flex-1';
const HEAD_CELL = 'px-[16px] pt-[12px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-[#3e4947]';

// "Daftar Cabang" table card (Figma node 422:5562).
export default function BranchTable({ branches }: BranchTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-[12px] border border-[#e0e3e1] bg-white">
            {/* Card header: title + search */}
            <div className="flex h-[76px] items-center justify-between border-b border-[#e0e3e1] px-[24px] pt-[24px] pb-[16px]">
                <h2 className="text-[20px] leading-[28px] font-semibold text-[#181c1c]">Daftar Cabang</h2>
                <div className="flex w-[256px] items-center gap-[13px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                    <Search size={12} className="shrink-0 text-[#6b7280]" />
                    <input
                        type="text"
                        placeholder="Cari Staff"
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#6b7280] outline-none"
                    />
                </div>
            </div>

            {/* Column headers */}
            <div className="flex h-[40px] items-start border-b border-[#bdc9c6] bg-[#f1f4f3]">
                <span className={`${COL} ${HEAD_CELL}`}>ID Cabang</span>
                <span className={`${COL} ${HEAD_CELL}`}>Nama Cabang</span>
                <span className={`${COL} ${HEAD_CELL}`}>Alamat</span>
                <span className={`${COL} ${HEAD_CELL}`}>Nomor Telepon</span>
                <span className={`${COL} ${HEAD_CELL}`}>Jam Operasional</span>
            </div>

            {/* Rows */}
            {branches.map((b, i) => (
                <Link
                    key={b.id}
                    href={`/admin/branches/${b.id}`}
                    className={`flex items-center transition-colors hover:bg-[#f7faf8] ${
                        i < branches.length - 1 ? 'border-b border-[#e0e3e1]' : ''
                    }`}
                >
                    {/* ID Cabang */}
                    <div className={`${COL} px-[16px] py-[16px]`}>
                        <span className="text-[14px] leading-[20px] font-medium text-[#181c1c]">{b.code}</span>
                    </div>

                    {/* Nama Cabang */}
                    <div className={`${COL} px-[16px] py-[16px]`}>
                        <span className="text-[14px] leading-[20px] text-[#3e4947]">{b.name}</span>
                    </div>

                    {/* Alamat */}
                    <div className={`${COL} px-[16px] py-[16px]`}>
                        <span className="truncate text-[14px] leading-[20px] text-[#3e4947]">{b.address}</span>
                    </div>

                    {/* Nomor Telepon */}
                    <div className={`${COL} flex items-center gap-[6px] px-[16px] py-[16px]`}>
                        <Phone size={12} className="shrink-0 text-[#3e4947]" />
                        <span className="truncate text-[14px] leading-[20px] text-[#3e4947]">{b.phone}</span>
                    </div>

                    {/* Jam Operasional */}
                    <div className={`${COL} px-[16px] py-[16px]`}>
                        <span className="text-[14px] leading-[20px] text-[#3e4947]">{b.hours}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
