'use client';

import React from 'react';

export type OrderStatusKey = 'disetrika' | 'selesai';

const STATUS: Record<OrderStatusKey, { label: string; badge: string; dot: string; text: string }> = {
    disetrika: { label: 'Disetrika', badge: 'bg-[#faf5ff]', dot: 'bg-[#ad46ff]', text: 'text-[#8200db]' },
    selesai: { label: 'Selesai', badge: 'bg-[#46ecd5]', dot: 'bg-[#007a55]', text: 'text-[#007a55]' },
};

export interface OrderStep {
    label: string;
    done: boolean;
}

interface OrderCardProps {
    orderId: string;
    service: string;
    status: OrderStatusKey;
    eta: string;
    steps?: OrderStep[];
}

export default function OrderCard({ orderId, service, status, eta, steps }: OrderCardProps) {
    const s = STATUS[status];

    return (
        <div className="flex w-full flex-col rounded-[8.75px] border border-[#bdc9c6] p-[11.5px]">
            <div className="flex items-center justify-between">
                <div className="flex w-[120.297px] flex-col">
                    <p className="text-[10.5px] leading-[14px] font-normal text-[#6e7977]">{orderId}</p>
                    <p className="text-[12.25px] leading-[17.5px] font-semibold text-[#0f172b]">{service}</p>
                </div>
                <div className={`flex items-center gap-[5.25px] rounded-full px-[7px] py-[1.75px] ${s.badge}`}>
                    <span className={`size-[5.25px] rounded-full ${s.dot}`} />
                    <p className={`text-[10.5px] leading-[14px] font-normal ${s.text}`}>{s.label}</p>
                </div>
            </div>

            {steps && (
                <div className="flex items-center gap-[10px] pt-[10.5px]">
                    {steps.map((step, i) => (
                        <div key={i} className="flex min-w-px flex-1 flex-col items-start">
                            <div className={`h-[3.5px] w-full rounded-full ${step.done ? 'bg-[#00bba7]' : 'bg-[#bdc9c6]'}`} />
                            <p className="pt-[3.5px] text-[9px] leading-[13.5px] font-normal text-[#6e7977]">{step.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <p className="pt-[7px] text-[11px] leading-[16.5px] font-normal text-[#6e7977]">{eta}</p>
        </div>
    );
}
