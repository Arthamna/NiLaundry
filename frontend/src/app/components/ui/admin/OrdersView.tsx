'use client';

import React, { useState } from 'react';

import OrdersTable from '@/components/ui/admin/OrdersTable';
import { ORDERS, ORDER_STATS, STATUS_FILTERS, OrderStat } from '@/components/ui/admin/orderData';

type Filter = (typeof STATUS_FILTERS)[number];

// Summary card (Figma node 488:8413): plain label + large number, no icon.
function StatCard({ stat }: { stat: OrderStat }) {
    return (
        <div className="flex flex-col gap-[4px] rounded-[12px] border border-[#bdc9c6] bg-white p-[17px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <span className="text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-[#3e4947]">
                {stat.label}
            </span>
            <span className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                {stat.value}
            </span>
        </div>
    );
}

// Page body for /admin/orders (Figma node 120:4975).
export default function OrdersView() {
    const [filter, setFilter] = useState<Filter>('All');

    const orders = filter === 'All' ? ORDERS : ORDERS.filter((order) => order.status === filter);

    return (
        <div className="flex w-full flex-col gap-[20px] p-[40px]">
            {/* Stat cards */}
            <div className="grid grid-cols-5 gap-[20px]">
                {ORDER_STATS.map((stat) => (
                    <StatCard key={stat.label} stat={stat} />
                ))}
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap items-center gap-[8px]">
                {STATUS_FILTERS.map((value) => {
                    const isActive = filter === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setFilter(value)}
                            className={`rounded-full border text-[12px] leading-[16px] font-medium transition-colors ${
                                isActive
                                    ? 'border-[#005c55] bg-[#6df5e1] px-[13px] py-[3px] text-[#006f64]'
                                    : 'border-[#bdc9c6] bg-[#e5e9e7] px-[9px] py-[3px] text-[#181c1c] hover:bg-[#dde3e0]'
                            }`}
                        >
                            {value}
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <OrdersTable orders={orders} />
        </div>
    );
}
