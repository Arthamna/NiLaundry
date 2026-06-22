import React from 'react';
import StatusBadge, { OrderStatus } from '@/components/ui/branch/StatusBadge';
import { AVATAR_TONES, AvatarTone } from '@/components/ui/branch/avatarTones';

export interface OrderRow {
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

const COL = {
    orderId: 'basis-0 grow min-w-[140px]',
    customer: 'basis-0 grow-[2] min-w-[200px]',
    est: 'basis-0 grow min-w-[140px]',
    status: 'basis-0 grow min-w-[120px]',
};

export default function RecentOrdersTable({ rows }: { rows: OrderRow[] }) {
    return (
        <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex w-full items-center justify-between border-b border-[#e0e3e1] bg-white px-6 py-5">
                <h3 className="text-[20px] leading-7 font-semibold text-[#181c1c]">Recent Orders</h3>
                <button
                    type="button"
                    className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#005c55] hover:underline"
                    onClick={() => {window.location.href = '/branch/orders'}}>
                    View All
                </button>
            </div>

            <div className="w-full overflow-auto">
                <div className="flex w-full border-b border-[#bdc9c6] bg-[#f1f4f3]">
                    <HeaderCell className={COL.orderId}>Order ID</HeaderCell>
                    <HeaderCell className={COL.customer}>Customer</HeaderCell>
                    <HeaderCell className={COL.est}>Est. Finish</HeaderCell>
                    <HeaderCell className={COL.status}>Status</HeaderCell>
                </div>

                <div className="flex w-full flex-col">
                    {rows.length === 0 && (
                        <div className="flex w-full justify-center py-10 text-[14px] text-[#3e4947]">
                            Belum ada pesanan.
                        </div>
                    )}
                    {rows.map((row) => (
                        <div
                            key={row.id}
                            className="flex w-full items-center border-b border-[#e0e3e1] last:border-b-0"
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
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HeaderCell({ className, children }: { className: string; children: React.ReactNode }) {
    return (
        <div className={`flex items-center px-6 py-3 ${className}`}>
            <span className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947] uppercase">
                {children}
            </span>
        </div>
    );
}
