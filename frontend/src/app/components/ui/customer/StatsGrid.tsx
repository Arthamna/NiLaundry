'use client';

import React from 'react';
import { Truck, CheckCircle2, PiggyBank } from 'lucide-react';

interface StatsGridProps {
    activeOrders: number;
    completedOrders: number;
    totalSaved: string;
}

const cardClass =
    'flex h-[108px] items-center justify-between rounded-[12px] border border-[#bdc9c6] bg-white p-[25px]';
const labelClass = 'text-[13px] leading-4 font-semibold uppercase tracking-[0.6px] text-[#6e7977]';
const valueClass = 'text-[31px] leading-[38px] font-semibold tracking-[-0.6px]';

export default function StatsGrid({ activeOrders, completedOrders, totalSaved }: StatsGridProps) {
    return (
        <div className="grid grid-cols-3 gap-6">
            <div className={cardClass}>
                <div className="flex flex-col gap-1">
                    <p className={labelClass}>Active Orders</p>
                    <h2 className={`${valueClass} text-[#005c55]`}>{String(activeOrders).padStart(2, '0')}</h2>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-[rgba(15,118,110,0.1)] text-[#0f766e]">
                    <Truck size={22} />
                </div>
            </div>

            <div className={cardClass}>
                <div className="flex flex-col gap-1">
                    <p className={labelClass}>Completed Orders</p>
                    <h2 className={`${valueClass} text-[#005c55]`}>{completedOrders}</h2>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-[rgba(109,245,225,0.1)] text-[#006b5f]">
                    <CheckCircle2 size={20} />
                </div>
            </div>

            <div className={cardClass}>
                <div className="flex flex-col gap-1">
                    <p className={labelClass}>Total Saved</p>
                    <h2 className={`${valueClass} text-[#005c52]`}>{totalSaved}</h2>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-[rgba(0,119,106,0.1)] text-[#00776a]">
                    <PiggyBank size={20} />
                </div>
            </div>
        </div>
    );
}
