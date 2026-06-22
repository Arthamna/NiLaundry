import React from 'react';
import Link from 'next/link';

export type LiveOrderStatus = 'pickup' | 'processing' | 'delivery' | 'completed';

export interface LiveOrderRow {
    orderId: string;
    customer: string;
    branch: string;
    status: LiveOrderStatus;
    deadline: string;
    isOverdue?: boolean;
    total: string;
}

interface LiveOrdersTableProps {
    rows: LiveOrderRow[];
}

// Exact Figma badge fills for the admin Live Orders table (node 267:3968+).
const STATUS_LABEL: Record<LiveOrderStatus, string> = {
    pickup: 'Pickup',
    processing: 'Processing',
    delivery: 'Delivery',
    completed: 'Completed',
};

const STATUS_STYLES: Record<LiveOrderStatus, string> = {
    delivery: 'bg-[#eff6ff] border-[#bfdbfe] text-[#1d4ed8]',
    completed: 'bg-[#9cf2e8] border-[#80d5cb] text-[#0f766e]',
    processing: 'bg-[#fef3c6] border-[#fee685] text-[#f59e0b]',
    pickup: 'bg-[#ffccd3] border-[#f991aa] text-[#f41313]',
};

// Shared column widths keep the header and body cells aligned (Figma node 267:3664+).
const COLS = {
    order: 'w-[100px]',
    customer: 'w-[144px]',
    branch: 'w-[80px]',
    status: 'w-[104px]',
    deadline: 'w-[144px]',
    total: 'w-[144px]',
};

const HEAD_CELL =
    'flex items-center px-[16px] text-[11px] leading-[15.714px] font-semibold uppercase tracking-[0.55px] text-[#62748e]';

function StatusBadge({ status }: { status: LiveOrderStatus }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-[9px] py-[3px] text-[12px] leading-4 font-medium ${STATUS_STYLES[status]}`}
        >
            {STATUS_LABEL[status]}
        </span>
    );
}

export default function LiveOrdersTable({ rows }: LiveOrdersTableProps) {
    return (
        <div className="flex w-[740px] shrink-0 flex-col rounded-[12.75px] border border-[#e2e8f0] bg-white p-px drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            {/* Header */}
            <div className="flex w-full items-start justify-between border-b border-[#e2e8f0] px-[17.5px] pt-[14px] pb-[15px]">
                <div className="flex flex-col">
                    <h3 className="text-[15px] leading-[22.5px] font-semibold text-[#0f172b]">Live Orders</h3>
                    <p className="pt-[1.75px] text-[10.5px] leading-[14px] text-[#62748e]">
                        Active orders
                    </p>
                </div>
                <Link
                    href="/admin/orders"
                    className="shrink-0 text-[10.5px] leading-[14px] font-medium text-[#00786f] hover:underline"
                >
                    View all
                </Link>
            </div>

            {/* Table */}
            <div className="flex w-full flex-col">
                {/* Column headers */}
                <div className="flex h-[32px] w-full items-center justify-between border-b border-[#e2e8f0]">
                    <div className={`${HEAD_CELL} ${COLS.order} h-full`}>Order</div>
                    <div className={`${HEAD_CELL} ${COLS.customer} h-full`}>Customer</div>
                    <div className={`${HEAD_CELL} ${COLS.branch} h-full`}>Branch</div>
                    <div className={`${HEAD_CELL} ${COLS.status} h-full`}>Status</div>
                    <div className={`${HEAD_CELL} ${COLS.deadline} h-full`}>Deadline</div>
                    <div className={`${HEAD_CELL} ${COLS.total} h-full justify-end text-right`}>Total</div>
                </div>

                {/* Rows */}
                {rows.map((row, i) => (
                    <div
                        key={`${row.orderId}-${i}`}
                        className="flex w-full items-center justify-between border-b border-[#e0e3e1]"
                    >
                        <div className={`${COLS.order} px-[16px] py-[16px]`}>
                            <p className="text-[14px] leading-[20px] font-medium whitespace-nowrap text-[#181c1c]">
                                {row.orderId}
                            </p>
                        </div>
                        <div className={`${COLS.customer} px-[16px] py-[16px]`}>
                            <p className="text-[14px] leading-[20px] font-medium whitespace-nowrap text-[#181c1c]">
                                {row.customer}
                            </p>
                        </div>
                        <div className={`${COLS.branch} px-[16px] py-[16px]`}>
                            <p className="text-[14px] leading-[20px] text-[#3e4947]">{row.branch}</p>
                        </div>
                        <div className={`${COLS.status} px-[16px] py-[16px]`}>
                            <StatusBadge status={row.status} />
                        </div>
                        <div className={`${COLS.deadline} px-[16px] py-[16px]`}>
                            <p
                                className={`text-[14px] leading-[20px] ${
                                    row.isOverdue ? 'font-medium text-[#ba1a1a]' : 'text-[#3e4947]'
                                }`}
                            >
                                {row.deadline}
                            </p>
                        </div>
                        <div className={`${COLS.total} flex justify-end px-[16px] py-[16px]`}>
                            <p className="text-[12.25px] leading-[17.5px] font-semibold text-[#0f172b]">{row.total}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
