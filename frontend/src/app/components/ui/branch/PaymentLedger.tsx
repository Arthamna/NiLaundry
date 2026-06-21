import React from 'react';
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, ListFilter, Search } from 'lucide-react';

export interface LedgerRow {
    id: string;
    invoiceId: string;
    customerName: string;
    customerPhone: string;
    date: string;
    method: string;
    amount: string;
}

export default function PaymentLedger({ rows }: { rows: LedgerRow[] }) {
    return (
        <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-[#f7faf8] p-px shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            {/* Filter bar */}
            <div className="border-b border-[#f1f5f9] bg-[#f1f4f3]">
                <div className="flex items-center justify-between px-4 pt-4 pb-[17px]">
                    <button
                        type="button"
                        className="flex min-w-[200px] items-center justify-between gap-2 rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] p-[9px]"
                    >
                        <ListFilter size={12} className="shrink-0 text-[#181c1c]" />
                        <span className="text-[14px] leading-5 text-[#181c1c]">All Payment Methods</span>
                        <ChevronDown size={12} className="shrink-0 text-[#181c1c]" />
                    </button>
                    <div className="flex w-[256px] items-center gap-[13px] overflow-clip rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                        <Search size={12} className="shrink-0 text-[#6b7280]" />
                        <input
                            type="text"
                            placeholder="Search Invoice ID..."
                            className="min-w-0 flex-1 bg-transparent text-[14px] leading-5 text-[#181c1c] outline-none placeholder:text-[#6b7280]"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-auto">
                {/* Header */}
                <div className="flex w-full justify-center border-b border-[#bdc9c6] bg-[#f1f4f3]">
                    <HeaderCell width="w-[144px]">Invoice ID</HeaderCell>
                    <HeaderCell width="w-[200px]">Customer</HeaderCell>
                    <HeaderCell width="w-[200px]">Date</HeaderCell>
                    <HeaderCell width="w-[200px]">Method</HeaderCell>
                    <HeaderCell width="w-[200px]" alignRight>
                        Amount
                    </HeaderCell>
                </div>

                {/* Body */}
                <div className="flex w-full flex-col bg-white">
                    {rows.map((row) => (
                        <div key={row.id} className="flex w-full justify-center border-b border-[#e0e3e1]">
                            <div className="flex w-[144px] flex-col justify-center px-4 py-[16.5px]">
                                <span className="font-mono text-[14px] leading-5 text-[#6e7977]">
                                    {row.invoiceId}
                                </span>
                            </div>
                            <div className="flex w-[200px] flex-col px-4 py-[18.5px]">
                                <p className="text-[14px] leading-5 font-medium text-[#181c1c]">
                                    {row.customerName}
                                </p>
                                <p className="text-[12px] leading-4 text-[#6e7977]">{row.customerPhone}</p>
                            </div>
                            <div className="flex w-[200px] flex-col px-4 pt-[26px] pb-[27px]">
                                <span className="text-[14px] leading-5 text-[#3e4947]">{row.date}</span>
                            </div>
                            <div className="flex w-[200px] items-center pl-4">
                                <span className="text-[14px] leading-5 text-[#181c1c]">{row.method}</span>
                            </div>
                            <div className="flex w-[200px] flex-col items-end justify-center pt-[26px] pr-4 pb-[27px] pl-[32px]">
                                <span className="text-right text-[14px] leading-5 font-medium text-[#181c1c]">
                                    {row.amount}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="border-t border-[#f1f5f9] bg-white">
                <div className="flex items-center justify-between px-2 pt-[9px] pb-2">
                    <span className="text-[14px] leading-5 text-[#3e4947]">Showing 1 to 5 of 452 entries</span>
                    <div className="flex items-center justify-center gap-1">
                        <button type="button" className="flex items-center justify-center rounded-[4px] p-1">
                            <ChevronLeft size={12} className="text-[#3e4947]" />
                        </button>
                        <button
                            type="button"
                            className="rounded-[4px] bg-[#0f766e] px-2 pt-[7.5px] pb-[8.5px] text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#a3faef]"
                        >
                            1
                        </button>
                        {[2, 3, 4, 5].map((n) => (
                            <button
                                key={n}
                                type="button"
                                className="rounded-[4px] px-2 pt-[7.5px] pb-[8.5px] text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947]"
                            >
                                {n}
                            </button>
                        ))}
                        <button type="button" className="flex items-center justify-center rounded-[4px] p-1">
                            <ChevronRight size={12} className="text-[#3e4947]" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function HeaderCell({
    width,
    alignRight = false,
    children,
}: {
    width: string;
    alignRight?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className={`flex ${width} items-center justify-between px-4 py-[15px]`}>
            <span
                className={`text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947] uppercase ${
                    alignRight ? 'text-right' : ''
                }`}
            >
                {children}
            </span>
            <ArrowUpDown size={14} className="shrink-0 text-[#94a3b8]" />
        </div>
    );
}
