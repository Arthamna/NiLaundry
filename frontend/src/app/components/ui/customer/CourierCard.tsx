'use client';

import React from 'react';

interface CourierCardProps {
    initials: string;
    name: string;
    vehicle: string;
    onChat?: () => void;
}

export default function CourierCard({ initials, name, vehicle, onChat }: CourierCardProps) {
    return (
        <div className="flex w-full items-center gap-[10.5px] rounded-[12.75px] border border-[#bdc9c6] bg-white p-[11.5px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#00bba7_0%,#00786f_100%)]">
                <span className="text-[13.68px] leading-[20.52px] font-semibold text-white">{initials}</span>
            </div>
            <div className="flex flex-1 flex-col gap-[6px]">
                <p className="text-[10.5px] leading-[14px] font-bold text-[#0f172b]">{name}</p>
                <p className="text-[10.5px] leading-[14px] font-normal text-[#62748e]">{vehicle}</p>
            </div>
            <button
                onClick={onChat}
                className="flex h-[40px] shrink-0 items-center justify-center rounded-full bg-[#009689] px-[20px] py-[5px] text-[11px] leading-[16.5px] font-semibold text-white"
            >
                Chat
            </button>
        </div>
    );
}
