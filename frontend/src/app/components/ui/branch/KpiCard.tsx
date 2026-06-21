import React from 'react';

interface KpiCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

export default function KpiCard({ label, value, icon }: KpiCardProps) {
    return (
        <div className="flex flex-col gap-2 overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
                <span className="text-[14px] leading-5 font-medium text-[#3e4947]">{label}</span>
                <span className="text-[#005c55]">{icon}</span>
            </div>
            <div className="pt-2">
                <p className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">{value}</p>
            </div>
        </div>
    );
}
