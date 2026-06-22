import React from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge, { OrderStatus } from '@/components/ui/branch/StatusBadge';
import { AVATAR_TONES, AvatarTone } from '@/components/ui/branch/avatarTones';

export interface OrdersRow {
    id: string;
    orderId: string;
    customerName: string;
    customerPhone: string;
    initials: string;
    avatarTone: AvatarTone;
    estFinish: string;
    isOverdue: boolean;
    status: OrderStatus;
}

export type SortDir = 'asc' | 'desc';

export interface OrdersTableProps {
    rows: OrdersRow[];
    page?: number;
    pageSize?: number;
    totalEntries?: number;
    onPageChange?: (page: number) => void;
    /** Active sort column key, e.g. 'id' | 'est'. */
    sortKey?: string;
    sortDir?: SortDir;
    /** Fired when a sortable header is clicked. Parent toggles + refetches. */
    onSort?: (key: string) => void;
}

// Shared column flex classes keep header + body cells perfectly aligned.
const COL = {
    orderId: 'basis-0 grow min-w-[140px]',
    customer: 'basis-0 grow-[2] min-w-[200px]',
    est: 'basis-0 grow min-w-[140px]',
    status: 'basis-0 grow min-w-[120px]',
};

export default function OrdersTable({
    rows,
    page = 1,
    pageSize = 10,
    totalEntries,
    onPageChange,
    sortKey,
    sortDir,
    onSort,
}: OrdersTableProps) {
    const knownTotal = totalEntries ?? rows.length;
    const showingFrom = knownTotal === 0 ? 0 : (page - 1) * pageSize + 1;
    const showingTo = Math.min(page * pageSize, knownTotal);
    const totalPages = Math.max(1, Math.ceil(knownTotal / pageSize));
    const pageButtons = buildPageButtons(page, totalPages);

    return (
        <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="w-full overflow-auto">
                <div className="flex w-full border-b border-[#bdc9c6] bg-[#f1f4f3]">
                    <HeaderCell className={COL.orderId} sortKey="id" active={sortKey} dir={sortDir} onSort={onSort}>
                        Order ID
                    </HeaderCell>
                    <HeaderCell className={COL.customer}>Customer</HeaderCell>
                    <HeaderCell className={COL.est} sortKey="est" active={sortKey} dir={sortDir} onSort={onSort}>
                        Est. Finish
                    </HeaderCell>
                    <HeaderCell className={COL.status}>Status</HeaderCell>
                </div>

                <div className="flex w-full flex-col">
                    {rows.length === 0 && (
                        <div className="flex w-full justify-center border-b border-[#e0e3e1] py-10 text-[14px] text-[#3e4947]">
                            Tidak ada pesanan untuk filter ini.
                        </div>
                    )}
                    {rows.map((row) => (
                        <Link
                            key={row.id}
                            href={`/branch/orders/${row.id}`}
                            className="flex w-full items-center border-b border-[#e0e3e1] transition-colors last:border-b-0 hover:bg-[#f7faf8]"
                        >
                            <div className={`flex items-center px-6 py-4 ${COL.orderId}`}>
                                <span className="text-[14px] leading-5 font-medium text-[#181c1c]">
                                    {row.orderId}
                                </span>
                            </div>
                            <div className={`flex items-center gap-3 px-6 py-4 ${COL.customer}`}>
                                <div
                                    className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] leading-4 font-semibold tracking-[0.6px] ${AVATAR_TONES[row.avatarTone]}`}
                                >
                                    {row.initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-[14px] leading-5 font-medium text-[#181c1c]">
                                        {row.customerName}
                                    </p>
                                    <p className="truncate text-[12px] leading-5 text-[#3e4947]">
                                        {row.customerPhone}
                                    </p>
                                </div>
                            </div>
                            <div className={`flex items-center px-6 py-4 ${COL.est}`}>
                                <span
                                    className={
                                        row.isOverdue
                                            ? 'text-[14px] leading-5 font-medium text-[#ba1a1a]'
                                            : 'text-[14px] leading-5 text-[#3e4947]'
                                    }
                                >
                                    {row.estFinish}
                                </span>
                            </div>
                            <div className={`flex items-center px-6 py-4 ${COL.status}`}>
                                <StatusBadge status={row.status} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex w-full items-center justify-between border-t border-[#bdc9c6] bg-white px-6 py-3">
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
    children,
}: {
    className: string;
    sortKey?: string;
    active?: string;
    dir?: SortDir;
    onSort?: (key: string) => void;
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
        return <div className={`flex items-center px-6 py-3 ${className}`}>{label}</div>;
    }
    return (
        <button
            type="button"
            onClick={() => onSort?.(sortKey as string)}
            className={`flex items-center gap-1.5 px-6 py-3 text-left transition-colors hover:bg-[#e9edec] ${className}`}
        >
            {label}
            <Icon size={14} className={`shrink-0 ${isActive ? 'text-[#0f766e]' : 'text-[#94a3b8]'}`} />
        </button>
    );
}
