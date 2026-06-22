import React from 'react';

interface AdminKpiCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

// Compact KPI tile from the admin dashboard (Figma node 120:4402).
export default function AdminKpiCard({ label, value, icon }: AdminKpiCardProps) {
    return (
        <div className="flex flex-col items-start rounded-[12.75px] border border-[#e2e8f0] bg-white p-[18.5px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            <div className="flex w-full items-start justify-between">
                <p className="text-[10.5px] leading-[14px] font-medium text-[#62748e]">{label}</p>
                <div className="flex size-[28px] items-center justify-center rounded-[8.75px] bg-[#f0fdfa] text-[#0f766e]">
                    {icon}
                </div>
            </div>
            <p className="pt-[7px] text-[28px] leading-[42px] font-bold tracking-[-0.56px] text-[#0f172b]">{value}</p>
        </div>
    );
}
