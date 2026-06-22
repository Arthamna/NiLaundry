import React from 'react';
import Link from 'next/link';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
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

export interface OrdersTableProps {
    rows: OrdersRow[];
    page?: number;
    pageSize?: number;
    totalEntries?: number;
    onPageChange?: (page: number) => void;
}

export default function OrdersTable({
    rows,
    page = 1,
    pageSize = 10,
    totalEntries,
    onPageChange,
}: OrdersTableProps) {
    const knownTotal = totalEntries ?? rows.length;
    const showingFrom = knownTotal === 0 ? 0 : (page - 1) * pageSize + 1;
    const showingTo = Math.min(page * pageSize, knownTotal);
    const totalPages = Math.max(1, Math.ceil(knownTotal / pageSize));
    const pageButtons = buildPageButtons(page, totalPages);

    return (
        <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white p-px shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="w-full overflow-auto">
                <div className="flex w-full justify-center border-b border-[#bdc9c6] bg-[#f1f4f3]">
                    <HeaderCell width="w-[256px]" sortable>Order ID</HeaderCell>
                    <HeaderCell width="w-[256px]" sortable>Customer</HeaderCell>
                    <HeaderCell width="w-[200px]" sortable>Est. Finish</HeaderCell>
                    <HeaderCell width="w-[144px]">Status</HeaderCell>
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
                            className="flex w-full justify-center border-b border-[#e0e3e1] transition-colors hover:bg-[#f7faf8]"
                        >
                            <div className="flex w-[256px] flex-col justify-center px-4 pt-3 pb-[13px]">
                                <span className="text-[14px] leading-5 font-medium text-[#181c1c]">
                                    {row.orderId}
                                </span>
                            </div>
                            <div className="flex w-[256px] items-center gap-2 pl-4">
                                <div
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] leading-4 font-semibold tracking-[0.6px] ${AVATAR_TONES[row.avatarTone]}`}
                                >
                                    {row.initials}
                                </div>
                                <div>
                                    <p className="text-[14px] leading-5 font-medium text-[#181c1c]">
                                        {row.customerName}
                                    </p>
                                    <p className="text-[12px] leading-5 text-[#3e4947]">{row.customerPhone}</p>
                                </div>
                            </div>
                            <div className="flex w-[200px] flex-col px-4 pt-[22px] pb-[23px]">
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
                            <div className="flex w-[144px] items-start px-4 py-[21.5px]">
                                <StatusBadge status={row.status} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="w-full border-t border-[#bdc9c6] bg-white">
                <div className="flex items-center justify-between px-4 pt-[9px] pb-2">
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
    sortable = false,
    children,
}: {
    width: string;
    sortable?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className={`flex ${width} items-center justify-between px-4 py-3`}>
            <span className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947]">{children}</span>
            {sortable && <ArrowUpDown size={14} className="shrink-0 text-[#94a3b8]" />}
        </div>
    );
}
