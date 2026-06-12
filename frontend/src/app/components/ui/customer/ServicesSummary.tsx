'use client';

import React from 'react';

export interface ServiceLine {
    label: string;
    value: string;
}

interface ServicesSummaryProps {
    items: ServiceLine[];
    voucher?: ServiceLine;
    total: ServiceLine;
}

export default function ServicesSummary({ items, voucher, total }: ServicesSummaryProps) {
    return (
        <div className="flex w-full flex-col rounded-[12.75px] border border-[#bdc9c6] bg-white py-[11px] pl-[26px] pr-[31px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            <p className="text-[10.5px] leading-[14px] font-bold text-[#0f172b]">Services</p>

            <div className="flex flex-col pt-[7px]">
                {items.map((it, i) => (
                    <div key={i} className={`flex items-start justify-between ${i === 0 ? '' : 'pt-[3.5px]'}`}>
                        <p className="text-[10.5px] leading-[14px] font-normal text-[#0f172b]">{it.label}</p>
                        <p className="text-[10.5px] leading-[14px] font-normal text-[#0f172b]">{it.value}</p>
                    </div>
                ))}

                {voucher && (
                    <div className="pt-[3.5px]">
                        <div className="flex items-start justify-between border-t border-[#f1f5f9] pt-[4.5px]">
                            <p className="text-[10.5px] leading-[14px] font-normal text-[#00786f]">{voucher.label}</p>
                            <p className="text-[10.5px] leading-[14px] font-normal text-[#00786f]">{voucher.value}</p>
                        </div>
                    </div>
                )}

                <div className="pt-[3.5px]">
                    <div className="flex items-start justify-between border-t border-[#bdc9c6] pt-[4.5px]">
                        <p className="text-[10.5px] leading-[14px] font-bold text-[#0f172b]">{total.label}</p>
                        <p className="text-[10.5px] leading-[14px] font-bold text-[#0f172b]">{total.value}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
