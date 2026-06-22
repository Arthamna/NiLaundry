'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Phone, Mail, MapPin, Star, Ticket } from 'lucide-react';

import {
    Customer,
    ORDER_HISTORY,
    VOUCHERS,
    REVIEWS,
    formatSpendK,
} from '@/components/ui/admin/customerData';

type Tab = 'orders' | 'vouchers' | 'reviews';

const TABS: { key: Tab; label: string }[] = [
    { key: 'orders', label: 'Order History' },
    { key: 'vouchers', label: 'Vouchers' },
    { key: 'reviews', label: 'Reviews' },
];

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
    Disetrika: { bg: '#faf5ff', fg: '#8200db' },
    Selesai: { bg: '#ecfdf5', fg: '#007a55' },
};

const PANEL_COL = 'text-[10px] leading-[15px] font-bold tracking-[0.5px] text-[#62748e] uppercase';

// Customer detail modal with Order History / Vouchers / Reviews tabs
// (Figma nodes 466:4504 / 466:4759 / 466:5014 → 357:3085).
export default function CustomerDetailModal({ customer }: { customer: Customer }) {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('orders');

    function close() {
        router.push('/admin/customers');
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Tutup"
                onClick={close}
                className="absolute inset-0 bg-[rgba(24,28,28,0.4)] backdrop-blur-[2px]"
            />

            {/* Dialog */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`Profil ${customer.name}`}
                className="relative z-10 flex max-h-[88vh] w-[540px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[16px] bg-white shadow-[0px_24px_80px_0px_rgba(0,0,0,0.22)]"
            >
                {/* Header */}
                <div
                    className="relative shrink-0 border-b border-[#e2e8f0] p-[18px]"
                    style={{ backgroundImage: 'linear-gradient(174.26deg, #009689 8.28%, #005f5a 91.72%)' }}
                >
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Tutup"
                        className="absolute top-[12px] right-[12px] flex size-[28px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.15)] text-white transition-colors hover:bg-[rgba(255,255,255,0.25)]"
                    >
                        <X size={14} />
                    </button>

                    {/* Identity */}
                    <div className="flex items-center gap-[10px]">
                        <span
                            className="flex size-[56px] shrink-0 items-center justify-center rounded-full text-[21px] font-semibold text-white"
                            style={{ backgroundImage: `linear-gradient(135deg, ${customer.gradFrom} 0%, ${customer.gradTo} 100%)` }}
                        >
                            {customer.initials}
                        </span>
                        <div className="flex min-w-0 flex-col gap-[2px]">
                            <p className="text-[10.5px] leading-[14px] text-[#cbfbf1]">Customer profile</p>
                            <p className="text-[18px] leading-[27px] font-bold text-white">{customer.name}</p>
                            <span className="flex w-fit items-center gap-[5px] rounded-full bg-[rgba(255,255,255,0.15)] px-[7px] py-[1.5px]">
                                <Star size={9} className="shrink-0 fill-white text-white" />
                                <span className="text-[11px] leading-[16px] text-white">{customer.memberLabel}</span>
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-[14px] grid grid-cols-3 gap-[7px]">
                        <HeaderStat value={String(customer.orders)} label="Orders" />
                        <HeaderStat value={formatSpendK(customer.totalSpend)} label="Total Spend" />
                        <HeaderStat value={`${customer.avgRating}★`} label="Avg rating" />
                    </div>
                </div>

                {/* Contact */}
                <div className="flex shrink-0 flex-col gap-[7px] border-b border-[#e2e8f0] px-[18px] pt-[14px] pb-[15px]">
                    <ContactRow icon={<Phone size={14} className="text-[#45556c]" />} text={customer.phone} />
                    <ContactRow icon={<Mail size={14} className="text-[#45556c]" />} text={customer.email} />
                    <ContactRow icon={<MapPin size={14} className="text-[#45556c]" />} text={customer.address} />
                </div>

                {/* Tab bar */}
                <div className="flex shrink-0 items-center border-b border-[#e2e8f0] px-[18px]">
                    {TABS.map((t) => {
                        const isActive = tab === t.key;
                        return (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setTab(t.key)}
                                className={`p-[10px] text-[11px] leading-[16.5px] ${
                                    isActive ? 'font-semibold text-[#0f172b]' : 'font-medium text-[#45556c]'
                                }`}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* Panel */}
                <div className="min-h-0 flex-1 overflow-y-auto px-[18px] py-[10px]">
                    {tab === 'orders' && <OrdersPanel />}
                    {tab === 'vouchers' && <VouchersPanel />}
                    {tab === 'reviews' && <ReviewsPanel />}
                </div>
            </div>
        </div>
    );
}

function HeaderStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center rounded-[9px] bg-[rgba(255,255,255,0.1)] p-[7px]">
            <p className="text-[16px] leading-[24px] font-bold text-white">{value}</p>
            <p className="text-[10px] leading-[15px] text-[#cbfbf1]">{label}</p>
        </div>
    );
}

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-[7px]">
            <span className="shrink-0">{icon}</span>
            <p className="text-[12.25px] leading-[17.5px] text-[#45556c]">{text}</p>
        </div>
    );
}

function OrdersPanel() {
    return (
        <div>
            {/* Column header */}
            <div className="grid grid-cols-[115px_115px_1fr_auto] border-b border-[#e2e8f0] pb-[6px]">
                <span className={PANEL_COL}>Order</span>
                <span className={PANEL_COL}>Date</span>
                <span className={PANEL_COL}>Status</span>
                <span className={`${PANEL_COL} text-right`}>Total</span>
            </div>
            <div className="pt-[2px]">
                {ORDER_HISTORY.map((o) => {
                    const s = STATUS_STYLE[o.status];
                    return (
                        <div
                            key={o.id}
                            className="grid grid-cols-[115px_115px_1fr_auto] items-center border-b border-[#f1f5f9] py-[9px]"
                        >
                            <span className="text-[10.5px] leading-[15.75px] font-medium text-[#0f172b]">{o.id}</span>
                            <span className="text-[10.5px] leading-[15.75px] text-[#62748e]">{o.date}</span>
                            <span>
                                <span
                                    className="inline-flex items-center gap-[5px] rounded-full px-[7px] py-[2px]"
                                    style={{ backgroundColor: s.bg }}
                                >
                                    <span className="size-[5px] rounded-full" style={{ backgroundColor: s.fg }} />
                                    <span className="text-[10.5px] leading-[15.75px]" style={{ color: s.fg }}>
                                        {o.status}
                                    </span>
                                </span>
                            </span>
                            <span className="text-right text-[10.5px] leading-[15.75px] text-[#0f172b]">{o.total}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function VouchersPanel() {
    return (
        <div className="flex flex-col gap-[8px] py-[4px]">
            {VOUCHERS.map((v) => (
                <div
                    key={v.code}
                    className={`flex items-center justify-between rounded-[10px] border px-[15px] py-[11px] ${
                        v.used ? 'border-[#e2e8f0] bg-[#f8fafc] opacity-60' : 'border-[#a7f3d0] bg-[#ecfdf5]'
                    }`}
                >
                    <div className="flex items-center gap-[10px]">
                        <span
                            className={`flex size-[32px] shrink-0 items-center justify-center rounded-[8px] ${
                                v.used ? 'bg-[#e2e8f0] text-[#94a3b8]' : 'bg-[#0f766e] text-white'
                            }`}
                        >
                            <Ticket size={14} />
                        </span>
                        <div className="flex flex-col">
                            <p className="text-[12px] leading-[18px] font-bold text-[#0f172b]">{v.code}</p>
                            <p className="text-[10.5px] leading-[15px] text-[#62748e]">{v.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-[2px]">
                        <p className={`text-[14px] leading-[21px] font-bold ${v.used ? 'text-[#94a3b8]' : 'text-[#0f766e]'}`}>
                            {v.value}
                        </p>
                        <p className="text-[9px] leading-[13.5px] text-[#94a3b8]">{v.expLabel}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ReviewsPanel() {
    return (
        <div className="flex flex-col gap-[8px] py-[4px]">
            {REVIEWS.map((r) => (
                <div key={r.orderId} className="flex flex-col gap-[6px] rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] px-[15px] py-[11px]">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10.5px] leading-[15.75px] text-[#62748e]">{r.orderId}</span>
                        <div className="flex items-center gap-[5px]">
                            <span className="flex items-center gap-[3px] rounded-full bg-[rgba(15,118,110,0.09)] px-[8px] py-[2px]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={9} className="fill-[#0f766e] text-[#0f766e]" />
                                ))}
                                <span className="pl-[2px] text-[11px] leading-[16.5px] font-bold text-[#0f766e]">
                                    {r.rating.toFixed(1)}
                                </span>
                            </span>
                            <span className="text-[10px] leading-[15px] text-[#94a3b8]">{r.date}</span>
                        </div>
                    </div>
                    <p className="text-[11.5px] leading-[18px] text-[#45556c]">{r.text}</p>
                </div>
            ))}
        </div>
    );
}
