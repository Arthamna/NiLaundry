import React from 'react';
import Link from 'next/link';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge, { OrderStatus } from '@/components/ui/branch/StatusBadge';

export type AvatarTone = 'mint' | 'teal' | 'gray';

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

const AVATAR_TONES: Record<AvatarTone, string> = {
    mint: 'bg-[#6df5e1] text-[#006f64]',
    teal: 'bg-[#00776a] text-[#84ffeb]',
    gray: 'bg-[#e5e9e7] border border-[#bdc9c6] text-[#3e4947]',
};

export default function OrdersTable({ rows }: { rows: OrdersRow[] }) {
    return (
        <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white p-px shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            {/* Table */}
            <div className="w-full overflow-auto">
                {/* Header */}
                <div className="flex w-full justify-center border-b border-[#bdc9c6] bg-[#f1f4f3]">
                    <HeaderCell width="w-[256px]" sortable>
                        Order ID
                    </HeaderCell>
                    <HeaderCell width="w-[256px]" sortable>
                        Customer
                    </HeaderCell>
                    <HeaderCell width="w-[200px]" sortable>
                        Est. Finish
                    </HeaderCell>
                    <HeaderCell width="w-[144px]">Status</HeaderCell>
                </div>

                {/* Body */}
                <div className="flex w-full flex-col">
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

            {/* Pagination */}
            <div className="w-full border-t border-[#bdc9c6] bg-white">
                <div className="flex items-center justify-between px-4 pt-[9px] pb-2">
                    <span className="text-[14px] leading-5 text-[#3e4947]">Showing 1 to 10 of 45 entries</span>
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
