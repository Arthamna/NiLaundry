'use client';

import React from 'react';
import Image from 'next/image';
import { Bell } from 'lucide-react';

interface DashboardHeaderProps {
    name: string;
    activeVouchers: number;
    /** @deprecated No longer rendered — kept for backward compatibility with existing callers. */
    avatarUrl?: string;
}

export default function DashboardHeader({ name, activeVouchers, avatarUrl }: DashboardHeaderProps) {
    const firstName = name.split(' ')[0];

    return (
        <header className="flex h-[66px] items-center justify-between">
            <div className="flex flex-col gap-1">
                <h1 className="text-[31px] leading-[38px] font-semibold tracking-[-0.6px] text-[#181c1c]">
                    Hello, {firstName}!
                </h1>
                <div className="flex items-center">
                    <span className="rounded-full bg-[#00776a] px-4 py-1 text-[13px] leading-4 font-semibold tracking-[0.6px] text-white">
                        {activeVouchers} Active Vouchers
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {/* <button
                    className="flex size-10 items-center justify-center rounded-full bg-[#ebefed] transition-colors hover:bg-[#dde3e1]"
                    aria-label="Notifications"
                >
                    <Bell size={20} className="text-[#3e4947]" />
                </button> */}
                <div className="flex items-center gap-2 rounded-full border border-[#bdc9c6] bg-white pl-[9px] pr-[17px] py-[5px]" aria-label="User Profile">
                    {avatarUrl ? (
                        <Image src={avatarUrl} width={32} height={32} alt={name} className="size-8 rounded-full object-cover" />
                    ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-[#80d5cb] text-sm font-bold text-[#005c55]">
                            {firstName[0]}
                        </div>
                    )}
                    <span className="text-[15px] leading-5 font-medium text-[#181c1c]">{name}</span>
                </div>
            </div>
        </header>
    );
}
