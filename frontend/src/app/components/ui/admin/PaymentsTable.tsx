'use client';

import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

import { Payment } from '@/components/ui/admin/paymentData';
import { formatPaymentMethod, paymentMethodColor } from '@/components/ui/branch/format';
import TablePagination, { usePagination } from '@/components/ui/admin/TablePagination';

interface PaymentsTableProps {
    payments: Payment[];
}

type SortKey = 'invoice' | 'customerName' | 'date' | 'method' | 'amount';

// Shared grid template keeps header and body columns aligned (Figma node 496:9233).
const GRID = 'grid grid-cols-[1fr_1.3fr_1fr_1fr_1fr] items-center gap-[12px]';
const HEAD =
    'flex items-center gap-[6px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] uppercase text-[#3e4947]';

function amountValue(a: string): number {
    return Number(a.replace(/[^\d]/g, '')) || 0;
}

// "Payments" table card (Figma node 496:9227).
export default function PaymentsTable({ payments }: PaymentsTableProps) {
    const [query, setQuery] = useState('');
    const [method, setMethod] = useState('all');
    const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);

    const methods = useMemo(() => Array.from(new Set(payments.map((p) => p.method))).sort(), [payments]);

    function toggleSort(key: SortKey) {
        setSort((cur) => (cur?.key === key ? { key, dir: cur.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
    }

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = payments.filter((p) => {
            if (method !== 'all' && p.method !== method) return false;
            return !q || [p.invoice, p.customerName, p.customerPhone, p.method].some((v) => v.toLowerCase().includes(q));
        });
        if (sort) {
            list = [...list].sort((a, b) => {
                if (sort.key === 'amount') return (amountValue(a.amount) - amountValue(b.amount)) * sort.dir;
                return a[sort.key].localeCompare(b[sort.key]) * sort.dir;
            });
        }
        return list;
    }, [payments, query, method, sort]);

    const { page, setPage, pageCount, pageItems, total, pageSize } = usePagination(rows);

    const SortHead = ({ label, sortKey, alignRight }: { label: string; sortKey: SortKey; alignRight?: boolean }) => (
        <button
            type="button"
            onClick={() => toggleSort(sortKey)}
            className={`${HEAD} transition-colors hover:text-[#181c1c] ${alignRight ? 'justify-end' : ''}`}
        >
            {label}
            <ArrowUpDown size={12} className={sort?.key === sortKey ? 'text-[#181c1c]' : 'text-[#90a1b9]'} />
        </button>
    );

    return (
        <div className="w-full overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            {/* Card header: method filter + search */}
            <div className="flex items-center justify-between px-[17px] pt-[17px] pb-[16px]">
                <div className="relative flex items-center">
                    <SlidersHorizontal size={14} className="pointer-events-none absolute left-[13px] text-[#6b7280]" />
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="h-[40px] appearance-none rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] pr-[34px] pl-[35px] text-[14px] leading-[20px] text-[#181c1c] outline-none"
                    >
                        <option value="all">All Payment Methods</option>
                        {methods.map((m) => (
                            <option key={m} value={m}>
                                {formatPaymentMethod(m)}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-[12px] text-[#6b7280]" />
                </div>
                <div className="flex w-[256px] items-center gap-[10px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                    <Search size={12} className="shrink-0 text-[#6b7280]" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search invoice or customer..."
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#6b7280] outline-none"
                    />
                </div>
            </div>

            {/* Column headers */}
            <div className={`${GRID} border-y border-[#f1f5f9] bg-[#f7faf8] px-[18px] py-[12px]`}>
                <SortHead label="Invoice ID" sortKey="invoice" />
                <SortHead label="Customer" sortKey="customerName" />
                <SortHead label="Date" sortKey="date" />
                <SortHead label="Method" sortKey="method" />
                <SortHead label="Amount" sortKey="amount" alignRight />
            </div>

            {/* Rows */}
            {rows.length === 0 ? (
                <p className="px-[18px] py-[18px] text-[14px] text-[#6e7977]">No payments found.</p>
            ) : (
                pageItems.map((payment) => (
                    <div
                        key={payment.id}
                        className={`${GRID} border-b border-[#f1f5f9] px-[18px] py-[18px] transition-colors hover:bg-[#f7faf8]`}
                    >
                        <span className="font-mono text-[14px] leading-[20px] text-[#6b7280]">{payment.invoice}</span>
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-[14px] leading-[20px] font-medium text-[#181c1c]">
                                {payment.customerName}
                            </span>
                            <span className="truncate text-[12px] leading-[18px] text-[#6b7280]">
                                {payment.customerPhone}
                            </span>
                        </div>
                        <span className="text-[14px] leading-[20px] text-[#45556c]">{payment.date}</span>
                        <span>
                            <span
                                className="inline-flex items-center gap-[6px] rounded-full border border-[#e2e8f0] bg-[#f7faf8] py-[3px] pr-[10px] pl-[8px] text-[13px] leading-[18px] font-medium text-[#334155]"
                            >
                                <span
                                    className="size-[7px] shrink-0 rounded-full"
                                    style={{ backgroundColor: paymentMethodColor(payment.method) }}
                                />
                                {formatPaymentMethod(payment.method)}
                            </span>
                        </span>
                        <span className="text-right text-[14px] leading-[20px] font-medium text-[#181c1c]">
                            {payment.amount}
                        </span>
                    </div>
                ))
            )}

            <TablePagination
                page={page}
                pageCount={pageCount}
                total={total}
                pageSize={pageSize}
                onPage={setPage}
                label="payments"
            />
        </div>
    );
}
