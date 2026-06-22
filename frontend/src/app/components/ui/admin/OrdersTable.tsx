import React from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

import { Order, STATUS_STYLES, ORDER_AVATAR_BG, ORDER_AVATAR_TEXT } from '@/components/ui/admin/orderData';

interface OrdersTableProps {
    orders: Order[];
}

// Shared grid template keeps header and body columns aligned (Figma node 488:8448).
const GRID = 'grid grid-cols-[1fr_0.8fr_1.5fr_1fr_0.9fr] items-center gap-[12px]';
const HEAD = 'flex items-center gap-[6px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-[#3e4947]';

// "Orders" table card (Figma node 488:8443).
export default function OrdersTable({ orders }: OrdersTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-[12px] border border-[#bdc9c6] bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            {/* Card header: branch filter + search */}
            <div className="flex items-center justify-between px-[17px] pt-[17px] pb-[16px]">
                <button
                    type="button"
                    className="flex items-center gap-[8px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[13px] py-[9px] text-[14px] leading-[20px] text-[#181c1c]"
                >
                    <SlidersHorizontal size={14} className="shrink-0 text-[#6b7280]" />
                    All Branches
                    <ChevronDown size={14} className="shrink-0 text-[#6b7280]" />
                </button>
                <div className="flex w-[256px] items-center gap-[10px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                    <Search size={12} className="shrink-0 text-[#6b7280]" />
                    <input
                        type="text"
                        placeholder="Search Customer"
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#6b7280] outline-none"
                    />
                </div>
            </div>

            {/* Column headers */}
            <div className={`${GRID} border-y border-[#f1f4f3] bg-[#f7faf8] px-[18px] py-[10px]`}>
                <span className={HEAD}>
                    Order ID <ArrowUpDown size={12} className="text-[#6e7977]" />
                </span>
                <span className={HEAD}>
                    Branch <ArrowUpDown size={12} className="text-[#6e7977]" />
                </span>
                <span className={HEAD}>
                    Customer <ArrowUpDown size={12} className="text-[#6e7977]" />
                </span>
                <span className={HEAD}>
                    Est. Finish <ArrowUpDown size={12} className="text-[#6e7977]" />
                </span>
                <span className={HEAD}>Status</span>
            </div>

            {/* Rows */}
            {orders.map((order) => {
                const pill = STATUS_STYLES[order.status];
                return (
                    <div
                        key={order.id}
                        className={`${GRID} border-b border-[#f1f4f3] px-[18px] py-[16px] transition-colors hover:bg-[#f7faf8]`}
                    >
                        {/* Order ID */}
                        <span className="text-[14px] leading-[20px] font-medium text-[#181c1c]">{order.code}</span>

                        {/* Branch */}
                        <span className="text-[14px] leading-[20px] text-[#3e4947]">{order.branch}</span>

                        {/* Customer */}
                        <div className="flex items-center gap-[10px]">
                            <span
                                className="flex size-[32px] shrink-0 items-center justify-center rounded-full text-[12px] font-semibold tracking-[0.6px]"
                                style={{ backgroundColor: ORDER_AVATAR_BG, color: ORDER_AVATAR_TEXT }}
                            >
                                {order.customerInitials}
                            </span>
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-[14px] leading-[20px] font-medium text-[#181c1c]">
                                    {order.customerName}
                                </span>
                                <span className="truncate text-[12px] leading-[20px] text-[#3e4947]">
                                    {order.customerPhone}
                                </span>
                            </div>
                        </div>

                        {/* Est. Finish */}
                        <span
                            className={`text-[14px] leading-[20px] ${
                                order.overdue ? 'font-medium text-[#ba1a1a]' : 'text-[#3e4947]'
                            }`}
                        >
                            {order.overdue || order.estFinish}
                        </span>

                        {/* Status */}
                        <div>
                            <span
                                className="inline-flex items-center rounded-full border px-[9px] py-[3px] text-[12px] leading-[16px] font-medium"
                                style={{ backgroundColor: pill.bg, borderColor: pill.border, color: pill.text }}
                            >
                                {order.status}
                            </span>
                        </div>
                    </div>
                );
            })}

            {/* Pagination */}
            <div className="flex items-center justify-between px-[18px] py-[14px]">
                <span className="text-[13px] leading-[20px] text-[#6e7977]">Showing 1 to 10 of 45 entries</span>
                <div className="flex items-center gap-[6px]">
                    <button
                        type="button"
                        className="flex size-[28px] items-center justify-center rounded-[6px] border border-[#e0e3e1] text-[#6e7977] transition-colors hover:bg-[#f7faf8]"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    {[1, 2, 3, 4, 5].map((page) => (
                        <button
                            key={page}
                            type="button"
                            className={`flex size-[28px] items-center justify-center rounded-[6px] border text-[13px] transition-colors ${
                                page === 1
                                    ? 'border-[#005c55] bg-[#005c55] text-white'
                                    : 'border-[#e0e3e1] text-[#3e4947] hover:bg-[#f7faf8]'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="flex size-[28px] items-center justify-center rounded-[6px] border border-[#e0e3e1] text-[#6e7977] transition-colors hover:bg-[#f7faf8]"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
