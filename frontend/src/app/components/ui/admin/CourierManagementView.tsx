import React from 'react';
import Link from 'next/link';
import { Plus, Package, Truck } from 'lucide-react';

import CourierTable from '@/components/ui/admin/CourierTable';
import { COURIERS } from '@/components/ui/admin/courierData';

interface StatCardProps {
    label: string;
    value: string;
    delta: string;
    icon: React.ReactNode;
}

// Stat card (Figma node 120:6250 / 120:6234).
function StatCard({ label, value, delta, icon }: StatCardProps) {
    return (
        <div className="flex flex-col rounded-[12.75px] border border-[#e2e8f0] bg-white p-[18.5px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between">
                <span className="text-[10.5px] leading-[14px] font-medium text-[#62748e]">{label}</span>
                <span className="flex size-[28px] items-center justify-center rounded-[8.75px] bg-[#f0fdfa] text-[#009689]">
                    {icon}
                </span>
            </div>
            <span className="pt-[7px] text-[28px] leading-[42px] font-bold tracking-[-0.56px] text-[#0f172b]">
                {value}
            </span>
            <span className="pt-[3.5px] text-[10.5px] leading-[14px] font-semibold text-[#009966]">{delta}</span>
        </div>
    );
}

// Page body shared by the list / new / detail routes (Figma node 120:6045).
// The modals on /new and /[courier_id] render on top of this exact background.
export default function CourierManagementView() {
    return (
        <div className="flex w-full flex-col p-[40px]">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-x-[29px]">
                <StatCard label="Pickup Today" value="14" delta="▲ +3" icon={<Package size={16} />} />
                <StatCard label="Deliveries Today" value="42" delta="▲ +8" icon={<Truck size={16} />} />
            </div>

            {/* Heading row */}
            <div className="flex items-end justify-between pt-[20px]">
                <h1 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                    Courier Management
                </h1>
                <Link
                    href="/admin/couriers/new"
                    className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[16px] py-[9px] text-[14px] leading-[20px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                >
                    <Plus size={16} className="shrink-0" />
                    Tambah Courier
                </Link>
            </div>

            {/* Table */}
            <div className="pt-[14px]">
                <CourierTable couriers={COURIERS} />
            </div>
        </div>
    );
}
