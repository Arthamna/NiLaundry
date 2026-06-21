import React from 'react';
import StatusBadge, { OrderStatus } from '@/components/ui/branch/StatusBadge';

export interface OrderRow {
    id: string;
    orderId: string;
    customerName: string;
    customerPhone: string;
    initials: string;
    avatarTone: 'mint' | 'gray';
    estFinish: string;
    isOverdue: boolean;
    status: OrderStatus;
}

const AVATAR_TONES = {
    mint: 'bg-[#6df5e1] text-[#006f64]',
    gray: 'bg-[#e5e9e7] border border-[#bdc9c6] text-[#3e4947]',
} as const;

export default function RecentOrdersTable({ rows }: { rows: OrderRow[] }) {
    return (
        <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white p-px shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            {/* Card header */}
            <div className="flex w-full items-center justify-between border-b border-[#e0e3e1] bg-white px-6 pt-6 pb-[25px]">
                <h3 className="text-[20px] leading-7 font-semibold text-[#181c1c]">Recent Orders</h3>
                <button
                    type="button"
                    className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#005c55]"
                >
                    View All
                </button>
            </div>

            {/* Table */}
            <div className="w-full overflow-auto">
                {/* Header row */}
                <div className="flex w-full justify-center border-b border-[#bdc9c6] bg-[#f1f4f3]">
                    <HeaderCell width="w-[256px]">Order ID</HeaderCell>
                    <HeaderCell width="w-[256px]">Customer</HeaderCell>
                    <HeaderCell width="w-[200px]">Est. Finish</HeaderCell>
                    <HeaderCell width="w-[144px]">Status</HeaderCell>
                </div>

                {/* Body */}
                <div className="flex w-full flex-col">
                    {rows.map((row) => (
                        <div key={row.id} className="flex w-full justify-center border-b border-[#e0e3e1]">
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
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HeaderCell({ width, children }: { width: string; children: React.ReactNode }) {
    return (
        <div className={`flex ${width} flex-col px-4 py-3`}>
            <span className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947]">{children}</span>
        </div>
    );
}
