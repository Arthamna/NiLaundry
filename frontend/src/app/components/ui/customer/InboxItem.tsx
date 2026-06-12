'use client';

import React from 'react';

interface InboxItemProps {
    icon: string;
    title: string;
    subtitle: string;
    time: string;
    unread?: boolean;
    last?: boolean;
}

export default function InboxItem({ icon, title, subtitle, time, unread = false, last = false }: InboxItemProps) {
    return (
        <div
            className={`w-full ${unread ? 'bg-[rgba(240,253,250,0.3)]' : ''} ${
                last ? '' : 'border-b-[1.631px] border-[#f1f5f9]'
            }`}
        >
            <div className={`flex items-start gap-[17.121px] pr-[22px] ${last ? 'py-[16px]' : 'pt-[16px] pb-[17.631px]'}`}>
                <div className="flex size-[51.362px] shrink-0 items-center justify-center rounded-full bg-[#cbfbf1]">
                    <span className="text-[22.828px] leading-[34.242px] text-[#00786f]">{icon}</span>
                </div>
                <div className="flex min-w-px flex-[290_0_0] flex-col items-start">
                    <div className="flex w-full items-center justify-between">
                        <p className={`text-[17.121px] leading-[22.828px] text-[#0f172b] ${unread ? 'font-bold' : 'font-medium'}`}>
                            {title}
                        </p>
                        {unread && <span className="size-[8.56px] shrink-0 rounded-full bg-[#009689]" />}
                    </div>
                    <p className="text-[17.121px] leading-[22.828px] font-normal text-[#62748e]">{subtitle}</p>
                    <p className="text-[16.306px] leading-[21.741px] font-normal text-[#90a1b9]">{time}</p>
                </div>
            </div>
        </div>
    );
}
