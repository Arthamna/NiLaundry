'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Phone, Mail, MapPin } from 'lucide-react';

import { superadminApi, getApiErrorMessage } from '@/lib/api';
import {
    formatIDR,
    formatIDRShort,
    formatDateShort,
    initialsOf,
    mapOrderStatus,
} from '@/components/ui/branch/format';
import { STATUS_LABEL, type OrderStatus } from '@/components/ui/branch/StatusBadge';

const PANEL_COL = 'text-[10px] leading-[15px] font-bold tracking-[0.5px] text-[#62748e] uppercase';

const STATUS_DOT: Record<OrderStatus, { bg: string; fg: string }> = {
    pickup: { bg: '#ffccd3', fg: '#f41313' },
    processing: { bg: '#fef3c6', fg: '#b45309' },
    delivery: { bg: '#eff6ff', fg: '#1d4ed8' },
    completed: { bg: '#ecfdf5', fg: '#007a55' },
    cancelled: { bg: '#f3f4f6', fg: '#6b7280' },
};

// Customer detail modal showing profile + real order history (Figma 357:3085).
// Per-customer vouchers/reviews have no superadmin endpoint, so those tabs are
// omitted rather than filled with placeholder data.
export default function CustomerDetailModal({ customerId }: { customerId: number }) {
    const router = useRouter();
    const [detail, setDetail] = useState<superadminApi.SuperCustomerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ac = new AbortController();
        superadminApi
            .getCustomer(customerId, ac.signal)
            .then((d) => setDetail(d))
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            })
            .finally(() => {
                if (!ac.signal.aborted) setLoading(false);
            });
        return () => ac.abort();
    }, [customerId]);

    function close() {
        router.push('/admin/customers');
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="absolute inset-0 bg-[rgba(24,28,28,0.4)] backdrop-blur-[2px]"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Customer profile"
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
                        aria-label="Close"
                        className="absolute top-[12px] right-[12px] flex size-[28px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.15)] text-white transition-colors hover:bg-[rgba(255,255,255,0.25)]"
                    >
                        <X size={14} />
                    </button>

                    <div className="flex items-center gap-[10px]">
                        <span className="flex size-[56px] shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.18)] text-[21px] font-semibold text-white">
                            {detail ? initialsOf(detail.nama) : '…'}
                        </span>
                        <div className="flex min-w-0 flex-col gap-[2px]">
                            <p className="text-[10.5px] leading-[14px] text-[#cbfbf1]">Customer profile</p>
                            <p className="text-[18px] leading-[27px] font-bold text-white">{detail?.nama ?? '—'}</p>
                        </div>
                    </div>

                    <div className="mt-[14px] grid grid-cols-3 gap-[7px]">
                        <HeaderStat value={String(detail?.totalOrder ?? 0)} label="Orders" />
                        <HeaderStat value={detail ? formatIDRShort(detail.totalSpend) : 'Rp 0'} label="Total Spend" />
                        <HeaderStat value={`${(detail?.avgRating ?? 0).toFixed(1)}★`} label="Avg rating" />
                    </div>
                </div>

                {/* Contact */}
                <div className="flex shrink-0 flex-col gap-[7px] border-b border-[#e2e8f0] px-[18px] pt-[14px] pb-[15px]">
                    <ContactRow icon={<Phone size={14} className="text-[#45556c]" />} text={detail?.noTelp ?? '-'} />
                    <ContactRow icon={<Mail size={14} className="text-[#45556c]" />} text={detail?.email ?? '-'} />
                    <ContactRow icon={<MapPin size={14} className="text-[#45556c]" />} text={detail?.alamat ?? '-'} />
                </div>

                {/* Order history */}
                <div className="min-h-0 flex-1 overflow-y-auto px-[18px] py-[12px]">
                    <p className="pb-[8px] text-[13px] font-semibold text-[#0f172b]">Order History</p>
                    {loading ? (
                        <p className="text-[12px] text-[#62748e]">Loading…</p>
                    ) : error ? (
                        <p className="text-[12px] text-[#b91c1c]">{error}</p>
                    ) : !detail || detail.orderHistory.length === 0 ? (
                        <p className="text-[12px] text-[#62748e]">No orders yet.</p>
                    ) : (
                        <div>
                            <div className="grid grid-cols-[100px_110px_1fr_auto] border-b border-[#e2e8f0] pb-[6px]">
                                <span className={PANEL_COL}>Order</span>
                                <span className={PANEL_COL}>Est. Finish</span>
                                <span className={PANEL_COL}>Status</span>
                                <span className={`${PANEL_COL} text-right`}>Total</span>
                            </div>
                            <div className="pt-[2px]">
                                {detail.orderHistory.map((o) => {
                                    const status = mapOrderStatus(o.status);
                                    const dot = STATUS_DOT[status];
                                    return (
                                        <div
                                            key={o.id}
                                            className="grid grid-cols-[100px_110px_1fr_auto] items-center border-b border-[#f1f5f9] py-[9px]"
                                        >
                                            <span className="text-[10.5px] leading-[15.75px] font-medium text-[#0f172b]">
                                                {`#ORD-${String(o.id).padStart(4, '0')}`}
                                            </span>
                                            <span className="text-[10.5px] leading-[15.75px] text-[#62748e]">
                                                {formatDateShort(o.estimasiSelesai)}
                                            </span>
                                            <span>
                                                <span
                                                    className="inline-flex items-center gap-[5px] rounded-full px-[7px] py-[2px]"
                                                    style={{ backgroundColor: dot.bg }}
                                                >
                                                    <span className="size-[5px] rounded-full" style={{ backgroundColor: dot.fg }} />
                                                    <span className="text-[10.5px] leading-[15.75px]" style={{ color: dot.fg }}>
                                                        {STATUS_LABEL[status]}
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="text-right text-[10.5px] leading-[15.75px] text-[#0f172b]">
                                                {formatIDR(o.totalHarga)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
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
