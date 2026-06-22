import React from 'react';
import Link from 'next/link';
import { Search, Phone } from 'lucide-react';

import { Staff } from '@/components/ui/admin/staffData';

interface StaffTableProps {
    staff: Staff[];
    /** Card title; defaults to the standalone-page label. */
    title?: string;
}

// Five equal-width columns, mirroring the Figma flex-[202…_0_0] cells.
const COL = 'min-w-0 flex-1';
const HEAD_CELL = 'px-[16px] pt-[12px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-[#3e4947]';

// "Daftar Staff" table card (Figma node 364:4816).
export default function StaffTable({ staff, title = 'Daftar Staff' }: StaffTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-[12px] border border-[#bdc9c6] bg-white">
            {/* Card header: title + search */}
            <div className="flex h-[76px] items-center justify-between border-b border-[#e0e3e1] px-[24px] pt-[24px] pb-[16px]">
                <h2 className="text-[20px] leading-[28px] font-semibold text-[#181c1c]">{title}</h2>
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
                <span className={`${COL} ${HEAD_CELL}`}>Nama Staff</span>
                <span className={`${COL} ${HEAD_CELL}`}>Branch</span>
                <span className={`${COL} ${HEAD_CELL}`}>Email</span>
                <span className={`${COL} ${HEAD_CELL}`}>Nomor Telepon</span>
                <span className={`${COL} ${HEAD_CELL}`}>Alamat</span>
            </div>

            {/* Rows */}
            {staff.map((s, i) => (
                <Link
                    key={s.id}
                    href={`/admin/staffs/${s.id}`}
                    className={`flex items-center transition-colors hover:bg-[#f7faf8] ${
                        i < staff.length - 1 ? 'border-b border-[#e0e3e1]' : ''
                    }`}
                >
                    {/* Nama Staff */}
                    <div className={`${COL} flex items-center gap-[10px] px-[16px] py-[14px]`}>
                        <span
                            className="flex size-[36px] shrink-0 items-center justify-center rounded-full text-[12px] font-semibold tracking-[0.6px]"
                            style={{ backgroundColor: s.avatarBg, color: s.avatarText }}
                        >
                            {s.initials}
                        </span>
                        <span className="truncate text-[14px] leading-[20px] font-medium text-[#181c1c]">{s.name}</span>
                    </div>

                    {/* Branch */}
                    <div className={`${COL} px-[16px] py-[14px]`}>
                        <span className="text-[14px] leading-[20px] text-[#3e4947]">{s.branch}</span>
                    </div>

                    {/* Email */}
                    <div className={`${COL} px-[16px] py-[14px]`}>
                        <span className="truncate text-[14px] leading-[20px] text-[#3e4947]">{s.email}</span>
                    </div>

                    {/* Nomor Telepon */}
                    <div className={`${COL} flex items-center gap-[6px] px-[16px] py-[14px]`}>
                        <Phone size={12} className="shrink-0 text-[#3e4947]" />
                        <span className="truncate text-[13px] leading-[20px] text-[#3e4947]">{s.phone}</span>
                    </div>

                    {/* Alamat */}
                    <div className={`${COL} px-[16px] py-[14px]`}>
                        <span className="truncate text-[13px] leading-[20px] text-[#3e4947]">{s.address}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
