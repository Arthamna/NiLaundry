import React from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export interface LedgerRow {
    id: string;
    invoiceId: string;
    customerName: string;
    customerPhone: string;
    date: string;
    method: string;
    amount: string;
}

export interface PaymentLedgerProps {
    rows: LedgerRow[];
    page?: number;
    pageSize?: number;
    totalEntries?: number;
    onPageChange?: (page: number) => void;
    searchTerm?: string;
    onSearchChange?: (q: string) => void;
}

export default function PaymentLedger({
    rows,
    page = 1,
    pageSize = 10,
    totalEntries,
    onPageChange,
    searchTerm,
    onSearchChange,
}: PaymentLedgerProps) {
    const knownTotal = totalEntries ?? rows.length;
    const showingFrom = knownTotal === 0 ? 0 : (page - 1) * pageSize + 1;
    const showingTo = Math.min(page * pageSize, knownTotal);
    const totalPages = Math.max(1, Math.ceil(knownTotal / pageSize));
    const pageButtons = buildPageButtons(page, totalPages);

    return (
        <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-[#f7faf8] p-px shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="border-b border-[#f1f5f9] bg-[#f1f4f3]">
                <div className="flex items-center justify-between px-4 pt-4 pb-[17px]">
                    <span className="text-[14px] leading-5 font-medium text-[#181c1c]">Payment Ledger</span>
                    <div className="flex w-[256px] items-center gap-[13px] overflow-clip rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                        <Search size={12} className="shrink-0 text-[#6b7280]" />
                        <input
                            type="text"
                            placeholder="Search customer..."
                            value={searchTerm ?? ''}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="min-w-0 flex-1 bg-transparent text-[14px] leading-5 text-[#181c1c] outline-none placeholder:text-[#6b7280]"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full overflow-auto">
                <div className="flex w-full justify-center border-b border-[#bdc9c6] bg-[#f1f4f3]">
                    <HeaderCell width="w-[144px]">Invoice ID</HeaderCell>
                    <HeaderCell width="w-[200px]">Customer</HeaderCell>
                    <HeaderCell width="w-[200px]">Date</HeaderCell>
                    <HeaderCell width="w-[200px]">Method</HeaderCell>
                    <HeaderCell width="w-[200px]" alignRight>Amount</HeaderCell>
                </div>

                <div className="flex w-full flex-col bg-white">
                    {rows.length === 0 && (
                        <div className="flex w-full justify-center py-10 text-[14px] text-[#3e4947]">
                            Tidak ada pembayaran.
                        </div>
                    )}
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

            <div className="border-t border-[#f1f5f9] bg-white">
                <div className="flex items-center justify-between px-2 pt-[9px] pb-2">
                    <span className="text-[14px] leading-5 text-[#3e4947]">
                        Showing {showingFrom} to {showingTo} of {knownTotal} entries
                    </span>
                    <div className="flex items-center justify-center gap-1">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => onPageChange?.(page - 1)}
                            className="flex items-center justify-center rounded-[4px] p-1 disabled:opacity-40"
                        >
                            <ChevronLeft size={12} className="text-[#3e4947]" />
                        </button>
                        {pageButtons.map((n) => (
                            <button
                                key={n}
                                type="button"
                                onClick={() => onPageChange?.(n)}
                                className={
                                    n === page
                                        ? 'rounded-[4px] bg-[#0f766e] px-2 pt-[7.5px] pb-[8.5px] text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#a3faef]'
                                        : 'rounded-[4px] px-2 pt-[7.5px] pb-[8.5px] text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947]'
                                }
                            >
                                {n}
                            </button>
                        ))}
                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => onPageChange?.(page + 1)}
                            className="flex items-center justify-center rounded-[4px] p-1 disabled:opacity-40"
                        >
                            <ChevronRight size={12} className="text-[#3e4947]" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function buildPageButtons(current: number, total: number): number[] {
    const out: number[] = [];
    const start = Math.max(1, Math.min(current - 2, total - 4));
    const end = Math.min(total, start + 4);
    for (let i = start; i <= end; i++) out.push(i);
    return out.length > 0 ? out : [1];
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
