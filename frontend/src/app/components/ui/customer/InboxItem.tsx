'use client';

import React from 'react';

interface InboxItemProps {
    icon: string;
    title: string;
    subtitle: string;
    /** @deprecated notifikasi has no timestamp column; not rendered. */
    time?: string;
    /** @deprecated notifikasi has no read-state column; not rendered. */
    unread?: boolean;
    last?: boolean;
}

export default function InboxItem({ icon, title, subtitle, last = false }: InboxItemProps) {
    return (
        <div className={`w-full ${last ? '' : 'border-b-[1.631px] border-[#f1f5f9]'}`}>
            <div className={`flex items-start gap-[17.121px] pr-[22px] ${last ? 'py-[16px]' : 'pt-[16px] pb-[17.631px]'}`}>
                <div className="flex size-[51.362px] shrink-0 items-center justify-center rounded-full bg-[#cbfbf1]">
                    <span className="text-[22.828px] leading-[34.242px] text-[#00786f]">{icon}</span>
                </div>
                <div className="flex min-w-px flex-[290_0_0] flex-col items-start">
                    <p className="text-[17.121px] leading-[22.828px] font-medium text-[#0f172b]">{title}</p>
                    <p className="text-[17.121px] leading-[22.828px] font-normal text-[#62748e]">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}
