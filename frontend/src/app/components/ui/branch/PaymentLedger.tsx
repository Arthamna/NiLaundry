import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export interface LedgerRow {
    id: string;
    invoiceId: string;
    customerName: string;
    customerPhone: string;
    date: string;
    method: string;
    amount: string;
}

export type SortDir = 'asc' | 'desc';

export interface PaymentLedgerProps {
    rows: LedgerRow[];
    page?: number;
    pageSize?: number;
    totalEntries?: number;
    onPageChange?: (page: number) => void;
    searchTerm?: string;
    onSearchChange?: (q: string) => void;
    sortKey?: string;
    sortDir?: SortDir;
    onSort?: (key: string) => void;
}

const COL = {
    invoice: 'basis-0 grow min-w-[130px]',
    customer: 'basis-0 grow-[2] min-w-[180px]',
    date: 'basis-0 grow min-w-[140px]',
    method: 'basis-0 grow min-w-[120px]',
    amount: 'basis-0 grow min-w-[120px]',
};

export default function PaymentLedger({
    rows,
    page = 1,
    pageSize = 10,
    totalEntries,
    onPageChange,
    searchTerm,
    onSearchChange,
    sortKey,
    sortDir,
    onSort,
}: PaymentLedgerProps) {
    const knownTotal = totalEntries ?? rows.length;
    const showingFrom = knownTotal === 0 ? 0 : (page - 1) * pageSize + 1;
    const showingTo = Math.min(page * pageSize, knownTotal);
    const totalPages = Math.max(1, Math.ceil(knownTotal / pageSize));
    const pageButtons = buildPageButtons(page, totalPages);

    return (
        <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-[#e0e3e1] bg-white px-6 py-4">
                <span className="text-[16px] leading-6 font-semibold text-[#181c1c]">Payment Ledger</span>
                <div className="flex w-[256px] items-center gap-[13px] overflow-clip rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-4 py-[9px]">
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

            <div className="w-full overflow-auto">
                <div className="flex w-full border-b border-[#bdc9c6] bg-[#f1f4f3]">
                    <HeaderCell className={COL.invoice} sortKey="invoice" active={sortKey} dir={sortDir} onSort={onSort}>
                        Invoice ID
                    </HeaderCell>
                    <HeaderCell className={COL.customer} sortKey="customer" active={sortKey} dir={sortDir} onSort={onSort}>
                        Customer
                    </HeaderCell>
                    <HeaderCell className={COL.date} sortKey="date" active={sortKey} dir={sortDir} onSort={onSort}>
                        Date
                    </HeaderCell>
                    <HeaderCell className={COL.method} sortKey="method" active={sortKey} dir={sortDir} onSort={onSort}>
                        Method
                    </HeaderCell>
                    <HeaderCell
                        className={COL.amount}
                        sortKey="amount"
                        active={sortKey}
                        dir={sortDir}
                        onSort={onSort}
                        alignRight
                    >
                        Amount
                    </HeaderCell>
                </div>

                <div className="flex w-full flex-col">
                    {rows.length === 0 && (
                        <div className="flex w-full justify-center py-10 text-[14px] text-[#3e4947]">
                            Tidak ada pembayaran.
                        </div>
                    )}
                    {rows.map((row) => (
                        <div
                            key={row.id}
                            className="flex w-full items-center border-b border-[#e0e3e1] last:border-b-0 hover:bg-[#f7faf8]"
                        >
                            <div className={`flex items-center px-6 py-4 ${COL.invoice}`}>
                                <span className="font-mono text-[14px] leading-5 text-[#6e7977]">
                                    {row.invoiceId}
                                </span>
                            </div>
                            <div className={`flex flex-col justify-center px-6 py-4 ${COL.customer}`}>
                                <p className="truncate text-[14px] leading-5 font-medium text-[#181c1c]">
                                    {row.customerName}
                                </p>
                                <p className="truncate text-[12px] leading-4 text-[#6e7977]">
                                    {row.customerPhone}
                                </p>
                            </div>
                            <div className={`flex items-center px-6 py-4 ${COL.date}`}>
                                <span className="text-[14px] leading-5 text-[#3e4947]">{row.date}</span>
                            </div>
                            <div className={`flex items-center px-6 py-4 ${COL.method}`}>
                                <span className="text-[14px] leading-5 text-[#181c1c]">{row.method}</span>
                            </div>
                            <div className={`flex items-center justify-end px-6 py-4 ${COL.amount}`}>
                                <span className="text-right text-[14px] leading-5 font-semibold text-[#181c1c]">
                                    {row.amount}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#bdc9c6] bg-white px-6 py-3">
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
                                    ? 'rounded-[4px] bg-[#0f766e] px-2 py-[7px] text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#a3faef]'
                                    : 'rounded-[4px] px-2 py-[7px] text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947] hover:bg-[#f1f4f3]'
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
    className,
    sortKey,
    active,
    dir,
    onSort,
    alignRight = false,
    children,
}: {
    className: string;
    sortKey?: string;
    active?: string;
    dir?: SortDir;
    onSort?: (key: string) => void;
    alignRight?: boolean;
    children: React.ReactNode;
}) {
    const sortable = Boolean(sortKey && onSort);
    const isActive = sortable && active === sortKey;
    const Icon = !isActive ? ArrowUpDown : dir === 'asc' ? ArrowUp : ArrowDown;
    const label = (
        <span className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947] uppercase">
            {children}
        </span>
    );

    if (!sortable) {
        return (
            <div className={`flex items-center px-6 py-3 ${alignRight ? 'justify-end' : ''} ${className}`}>
                {label}
            </div>
        );
    }
    return (
        <button
            type="button"
            onClick={() => onSort?.(sortKey as string)}
            className={`flex items-center gap-1.5 px-6 py-3 text-left transition-colors hover:bg-[#e9edec] ${
                alignRight ? 'justify-end' : ''
            } ${className}`}
        >
            {label}
            <Icon size={14} className={`shrink-0 ${isActive ? 'text-[#0f766e]' : 'text-[#94a3b8]'}`} />
        </button>
    );
}
