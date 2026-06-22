import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { Courier, AVATAR_GRADIENT, vehicleLabel } from '@/components/ui/admin/courierData';

interface CourierTableProps {
    couriers: Courier[];
}

// Fixed 200px columns spread with justify-between, mirroring the Figma table
// rows (node 120:6365 — five w-[200px] cells inside an px-[18px] row).
const COL = 'flex w-[200px] shrink-0 items-center px-[16px]';
const HEAD =
    'font-semibold uppercase tracking-[0.55px] text-[#62748e] text-[11px] leading-[15.714px] whitespace-nowrap';
const CELL = 'text-[#62748e] text-[12.25px] leading-[17.5px]';

// "Couriers" table card (Figma node 120:6356).
export default function CourierTable({ couriers }: CourierTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-[12.75px] border border-[#e2e8f0] bg-white drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            {/* Card header: title + search */}
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-[17.5px] pt-[14px] pb-[15px]">
                <h2 className="text-[15px] leading-[22.5px] font-semibold text-[#0f172b]">Couriers</h2>
                <div className="flex w-[256px] items-center gap-[13px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                    <Search size={12} className="shrink-0 text-[#6b7280]" />
                    <input
                        type="text"
                        placeholder="Cari Couriers"
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172b] placeholder:text-[#6b7280] outline-none"
                    />
                </div>
            </div>

            {/* Column headers */}
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-[18px] py-[8px]">
                <span className={`${COL} ${HEAD}`}>Nama Kurir</span>
                <span className={`${COL} ${HEAD}`}>Kendaraan</span>
                <span className={`${COL} ${HEAD}`}>Nomor Telepon</span>
                <span className={`${COL} ${HEAD}`}>Pickups</span>
                <span className={`${COL} ${HEAD}`}>Deliveries</span>
            </div>

            {/* Rows */}
            {couriers.map((c) => (
                <Link
                    key={c.id}
                    href={`/admin/couriers/${c.id}`}
                    className="flex items-center justify-between border-b border-[#f1f5f9] px-[18px] py-[11px] transition-colors hover:bg-[#f7faf8]"
                >
                    {/* Nama Kurir */}
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

                    {/* Kendaraan */}
                    <div className={COL}>
                        <span className={`truncate ${CELL}`}>{vehicleLabel(c)}</span>
                    </div>

                    {/* Nomor Telepon */}
                    <div className={COL}>
                        <span className="truncate text-[14px] leading-[17.5px] text-[#62748e]">{c.phone}</span>
                    </div>

                    {/* Pickups */}
                    <div className={COL}>
                        <span className="text-[12.25px] leading-[17.5px] text-[#0f172b]">{c.pickups}</span>
                    </div>

                    {/* Deliveries */}
                    <div className={COL}>
                        <span className="text-[12.25px] leading-[17.5px] text-[#0f172b]">{c.deliveries}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
