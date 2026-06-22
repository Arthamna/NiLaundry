'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CalendarClock, ChevronDown, CircleDot, Save, User, X } from 'lucide-react';
import { STATUS_LABEL, type OrderStatus } from '@/components/ui/branch/StatusBadge';

export interface DrawerItem {
    service: string;
    weightQty: string;
}

export interface DrawerPegawai {
    id: number;
    nama: string;
}

export interface OrderStatusDrawerProps {
    orderId: string;
    statusLabel: string;
    currentStatus: string;
    estCompletion: string;
    totalItem: number;
    items: DrawerItem[];
    closeHref: string;

    /** Pegawai assigned to this order; their id is auto-filled. */
    pegawai: DrawerPegawai | null;
    /** Statuses the admin can transition to. */
    statusOptions: OrderStatus[];

    onSubmit: (input: { pegawaiId: number; status: OrderStatus }) => Promise<void>;
    isSubmitting?: boolean;
    error?: string | null;
}

export default function OrderStatusDrawer({
    orderId,
    statusLabel,
    currentStatus,
    estCompletion,
    totalItem,
    items,
    closeHref,
    pegawai,
    statusOptions,
    onSubmit,
    isSubmitting,
    error,
}: OrderStatusDrawerProps) {
    const [nextStatus, setNextStatus] = useState<OrderStatus | ''>('');

    const canSubmit = pegawai !== null && nextStatus !== '' && !isSubmitting;

    async function handleSubmit() {
        if (!pegawai || nextStatus === '') return;
        await onSubmit({ pegawaiId: pegawai.id, status: nextStatus });
    }

    return (
        <aside className="fixed top-0 right-0 z-40 flex h-full w-[400px] max-w-[400px] flex-col border-l border-[#bdc9c6] bg-white shadow-[-10px_0px_15px_-3px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="w-full border-b border-[#bdc9c6] bg-[#f7faf8]">
                <div className="flex items-center justify-between px-6 pt-4 pb-[17px]">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[20px] leading-7 font-semibold text-[#181c1c]">Order #{orderId}</h2>
                            <span className="rounded-[4px] border border-[#bae6fd] bg-[#e0f2fe] px-[9px] py-[3px] text-[12px] leading-4 font-medium text-[#0369a1]">
                                {statusLabel}
                            </span>
                        </div>
                        <p className="text-[14px] leading-5 text-[#3e4947]">Update operational status</p>
                    </div>
                    <Link
                        href={closeHref}
                        aria-label="Close"
                        className="flex items-center justify-center rounded-full p-1 text-[#3e4947] transition-colors hover:bg-black/5"
                    >
                        <X size={14} />
                    </Link>
                </div>
            </div>

            {/* Scrollable content */}
            <div className="flex flex-1 flex-col gap-8 overflow-auto bg-[#f7faf8] p-6">
                <div className="flex w-full flex-col gap-6">
                    {/* Employee Verification — id only, no PIN */}
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex flex-col gap-0.5">
                            <p className="text-[14px] leading-5 font-medium text-[#181c1c]">Employee Verification</p>
                            <p className="text-[12px] leading-4 text-[#3e4947]">
                                The order is verified against this employee&apos;s ID and branch assignment.
                            </p>
                        </div>
                        <div className="flex w-full flex-col gap-1.5">
                            <label className="text-[13px] leading-[18px] font-medium text-[#181c1c]">
                                Employee ID / Name
                            </label>
                            <div className="relative flex h-[42px] w-full items-center rounded-[6px] border border-[#bdc9c6] bg-white pr-3 pl-10">
                                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#6e7977]">
                                    <User size={16} />
                                </span>
                                <span className="text-[14px] text-[#181c1c]">
                                    {pegawai ? `#${pegawai.id} — ${pegawai.nama}` : 'No employee assigned'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Current Status */}
                    <div className="flex w-full flex-col gap-1">
                        <span className="text-[14px] leading-5 font-medium text-[#181c1c]">Current Status</span>
                        <div className="flex w-full items-center gap-2.5 rounded-[8px] border border-[#bdc9c6] bg-white px-[17px] py-[13px]">
                            <CircleDot size={16} className="shrink-0 text-[#0369a1]" />
                            <span className="rounded-full border border-[#bae6fd] bg-[#e0f2fe] px-[13px] py-[5px] text-[13px] leading-[19.5px] font-medium text-[#0369a1]">
                                {currentStatus}
                            </span>
                            <span className="ml-auto text-[12px] leading-4 text-[#3e4947]">Active status</span>
                        </div>
                    </div>

                    {/* Update Status */}
                    <div className="flex w-full flex-col gap-1">
                        <label className="text-[14px] leading-5 font-medium text-[#181c1c]">Update Status</label>
                        <div className="relative">
                            <select
                                value={nextStatus}
                                onChange={(e) => setNextStatus(e.target.value as OrderStatus | '')}
                                className="flex w-full appearance-none items-center justify-between rounded-[6px] border border-[#bdc9c6] bg-white px-[17px] py-[13px] pr-10 text-[14px] leading-5 text-[#181c1c] outline-none"
                            >
                                <option value="">Select next status...</option>
                                {statusOptions.map((s) => (
                                    <option key={s} value={s}>
                                        {STATUS_LABEL[s]}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={18}
                                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#3e4947]"
                            />
                        </div>
                    </div>

                    {/* Est. Completion Time */}
                    <div className="flex w-full flex-col gap-1">
                        <span className="text-[14px] leading-5 font-medium text-[#181c1c]">Est. Completion Time</span>
                        <div className="flex w-full items-center justify-between rounded-[6px] border border-[#bdc9c6] bg-white px-[17px] py-[13px]">
                            <span className="text-[14px] leading-5 text-[#181c1c]">{estCompletion}</span>
                            <CalendarClock size={20} className="shrink-0 text-[#0f766e]" />
                        </div>
                    </div>
                </div>

                {/* Item Details */}
                <div className="flex w-full flex-col gap-2">
                    <span className="text-[14px] leading-5 font-medium text-[#181c1c]">Item Details</span>
                    <div className="flex w-full flex-col gap-2 rounded-[8px] border border-[#bdc9c6] bg-white p-[17px]">
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] leading-5 text-[#3e4947]">Total Item</span>
                            <span className="text-[14px] leading-5 font-medium text-[#181c1c]">{totalItem}</span>
                        </div>
                        {items.map((item, i) => (
                            <React.Fragment key={i}>
                                <div className="h-0 w-full border-b border-[rgba(189,201,198,0.5)]" />
                                <div className="flex items-center justify-between">
                                    <span className="text-[14px] leading-5 text-[#3e4947]">Service</span>
                                    <span className="text-[14px] leading-5 font-medium text-[#181c1c]">
                                        {item.service}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[14px] leading-5 text-[#3e4947]">Weight/Qty</span>
                                    <span className="text-[14px] leading-5 font-medium text-[#181c1c]">
                                        {item.weightQty}
                                    </span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {error && (
                    <p role="alert" className="text-[13px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="w-full border-t border-[#bdc9c6] bg-[#f7faf8]">
                <div className="flex items-center justify-end gap-3 px-6 py-4">
                    <Link
                        href={closeHref}
                        className="rounded-[8px] border border-transparent px-4 py-2 text-[14px] leading-5 font-medium text-[#3e4947] transition-colors hover:text-[#181c1c]"
                    >
                        Cancel
                    </Link>
                    <button
                        type="button"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                        className="flex items-center gap-2 rounded-[8px] bg-[#005c55] px-4 py-2 text-[14px] leading-5 font-medium text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#004b45] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={14} />
                        {isSubmitting ? 'Saving…' : 'Save Status'}
                    </button>
                </div>
            </div>
        </aside>
    );
}
