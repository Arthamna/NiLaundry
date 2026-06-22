'use client';

import React, { useMemo, useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

import { Order, STATUS_STYLES, ORDER_AVATAR_BG, ORDER_AVATAR_TEXT } from '@/components/ui/admin/orderData';
import TablePagination, { usePagination } from '@/components/ui/admin/TablePagination';

interface OrdersTableProps {
    orders: Order[];
}

type SortKey = 'code' | 'branch' | 'customerName' | 'status';

// Shared grid template keeps header and body columns aligned (Figma node 488:8448).
const GRID = 'grid grid-cols-[1fr_0.8fr_1.5fr_1fr_0.9fr] items-center gap-[12px]';
const HEAD = 'flex items-center gap-[6px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-[#3e4947]';

// "Orders" table card (Figma node 488:8443).
export default function OrdersTable({ orders }: OrdersTableProps) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);

    function toggleSort(key: SortKey) {
        setSort((cur) => (cur?.key === key ? { key, dir: cur.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
    }

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = orders.filter(
            (o) =>
                !q ||
                [o.code, o.branch, o.customerName, o.customerPhone].some((v) => v.toLowerCase().includes(q)),
        );
        if (sort) list = [...list].sort((a, b) => a[sort.key].localeCompare(b[sort.key]) * sort.dir);
        return list;
    }, [orders, query, sort]);

    const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(rows);

    const SortHead = ({ label, sortKey }: { label: string; sortKey: SortKey }) => (
        <button type="button" onClick={() => toggleSort(sortKey)} className={`${HEAD} transition-colors hover:text-[#181c1c]`}>
            {label}
            <ArrowUpDown size={12} className={sort?.key === sortKey ? 'text-[#181c1c]' : 'text-[#6e7977]'} />
        </button>
    );

    return (
        <div className="w-full overflow-hidden rounded-[12px] border border-[#bdc9c6] bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            {/* Card header: search */}
            <div className="flex items-center justify-end px-[17px] pt-[17px] pb-[16px]">
                <div className="flex w-[256px] items-center gap-[10px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                    <Search size={12} className="shrink-0 text-[#6b7280]" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search customer or order"
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#6b7280] outline-none"
                    />
                </div>
            </div>

            {/* Column headers */}
            <div className={`${GRID} border-y border-[#f1f4f3] bg-[#f7faf8] px-[18px] py-[10px]`}>
                <SortHead label="Order ID" sortKey="code" />
                <SortHead label="Branch" sortKey="branch" />
                <SortHead label="Customer" sortKey="customerName" />
                <span className={HEAD}>Est. Finish</span>
                <SortHead label="Status" sortKey="status" />
            </div>

            {/* Rows */}
            {rows.length === 0 ? (
                <p className="px-[18px] py-[18px] text-[14px] text-[#6e7977]">No orders found.</p>
            ) : (
                pageItems.map((order) => {
                    const pill = STATUS_STYLES[order.status];
                    return (
                        <div
                            key={order.id}
                            className={`${GRID} border-b border-[#f1f4f3] px-[18px] py-[16px] transition-colors hover:bg-[#f7faf8]`}
                        >
                            <span className="text-[14px] leading-[20px] font-medium text-[#181c1c]">{order.code}</span>
                            <span className="text-[14px] leading-[20px] text-[#3e4947]">{order.branch}</span>
                            <div className="flex items-center gap-[10px]">
                                <span
                                    className="flex size-[32px] shrink-0 items-center justify-center rounded-full text-[12px] font-semibold tracking-[0.6px]"
                                    style={{ backgroundColor: ORDER_AVATAR_BG, color: ORDER_AVATAR_TEXT }}
                                >
                                    {order.customerInitials}
                                </span>
                                <div className="flex min-w-0 flex-col">
                                    <span className="truncate text-[14px] leading-[20px] font-medium text-[#181c1c]">
                                        {order.customerName}
                                    </span>
                                    <span className="truncate text-[12px] leading-[20px] text-[#3e4947]">
                                        {order.customerPhone}
                                    </span>
                                </div>
                            </div>
                            <span
                                className={`text-[14px] leading-[20px] ${
                                    order.overdue ? 'font-medium text-[#ba1a1a]' : 'text-[#3e4947]'
                                }`}
                            >
                                {order.overdue || order.estFinish}
                            </span>
                            <div>
                                <span
                                    className="inline-flex items-center rounded-full border px-[9px] py-[3px] text-[12px] leading-[16px] font-medium"
                                    style={{ backgroundColor: pill.bg, borderColor: pill.border, color: pill.text }}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    );
                })
            )}

            <TablePagination
                page={page}
                pageCount={pageCount}
                total={total}
                pageSize={pageSize}
                onPage={setPage}
                label="orders"
            />
        </div>
    );
}
