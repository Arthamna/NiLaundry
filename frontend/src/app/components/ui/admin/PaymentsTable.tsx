import React from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

import { Payment } from '@/components/ui/admin/paymentData';

interface PaymentsTableProps {
    payments: Payment[];
}

// Shared grid template keeps header and body columns aligned (Figma node 496:9233).
const GRID = 'grid grid-cols-[1fr_1.3fr_1fr_1fr_1fr] items-center gap-[12px]';
const HEAD = 'flex items-center gap-[6px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] uppercase text-[#3e4947]';

// "Payments" table card (Figma node 496:9227).
export default function PaymentsTable({ payments }: PaymentsTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            {/* Card header: method filter + search */}
            <div className="flex items-center justify-between px-[17px] pt-[17px] pb-[16px]">
                <button
                    type="button"
                    className="flex items-center gap-[8px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[13px] py-[9px] text-[14px] leading-[20px] text-[#181c1c]"
                >
                    <SlidersHorizontal size={14} className="shrink-0 text-[#6b7280]" />
                    All Payment Methods
                    <ChevronDown size={14} className="shrink-0 text-[#6b7280]" />
                </button>
                <div className="flex w-[256px] items-center gap-[10px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                    <Search size={12} className="shrink-0 text-[#6b7280]" />
                    <input
                        type="text"
                        placeholder="Search Invoice ID..."
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#6b7280] outline-none"
                    />
                </div>
            </div>

            {/* Column headers */}
            <div className={`${GRID} border-y border-[#f1f5f9] bg-[#f7faf8] px-[18px] py-[12px]`}>
                <span className={HEAD}>
                    Invoice ID <ArrowUpDown size={12} className="text-[#90a1b9]" />
                </span>
                <span className={HEAD}>
                    Customer <ArrowUpDown size={12} className="text-[#90a1b9]" />
                </span>
                <span className={HEAD}>
                    Date <ArrowUpDown size={12} className="text-[#90a1b9]" />
                </span>
                <span className={HEAD}>
                    Method <ArrowUpDown size={12} className="text-[#90a1b9]" />
                </span>
                <span className={`${HEAD} justify-end`}>
                    Amount <ArrowUpDown size={12} className="text-[#90a1b9]" />
                </span>
            </div>

            {/* Rows */}
            {payments.map((payment) => (
                <div
                    key={payment.id}
                    className={`${GRID} border-b border-[#f1f5f9] px-[18px] py-[18px] transition-colors hover:bg-[#f7faf8]`}
                >
                    {/* Invoice ID */}
                    <span className="font-mono text-[14px] leading-[20px] text-[#6b7280]">{payment.invoice}</span>

                    {/* Customer */}
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[14px] leading-[20px] font-medium text-[#181c1c]">
                            {payment.customerName}
                        </span>
                        <span className="truncate text-[12px] leading-[18px] text-[#6b7280]">
                            {payment.customerPhone}
                        </span>
                    </div>

                    {/* Date */}
                    <span className="text-[14px] leading-[20px] text-[#45556c]">{payment.date}</span>

                    {/* Method */}
                    <span className="text-[14px] leading-[20px] text-[#45556c]">{payment.method}</span>

                    {/* Amount */}
                    <span className="text-right text-[14px] leading-[20px] font-medium text-[#181c1c]">
                        {payment.amount}
                    </span>
                </div>
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-between px-[18px] py-[14px]">
                <span className="text-[13px] leading-[20px] text-[#64748b]">Showing 1 to 5 of 452 entries</span>
                <div className="flex items-center gap-[6px]">
                    <button
                        type="button"
                        className="flex size-[28px] items-center justify-center rounded-[6px] border border-[#e2e8f0] text-[#64748b] transition-colors hover:bg-[#f7faf8]"
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
                                    : 'border-[#e2e8f0] text-[#45556c] hover:bg-[#f7faf8]'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="flex size-[28px] items-center justify-center rounded-[6px] border border-[#e2e8f0] text-[#64748b] transition-colors hover:bg-[#f7faf8]"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
