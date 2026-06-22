'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Ticket, TrendingUp, Plus } from 'lucide-react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import VoucherCard, { VoucherCardData } from '@/components/ui/admin/VoucherCard';
import { superadminApi, getApiErrorMessage } from '@/lib/api';
import { formatIDR, formatIDRShort, formatDateLong } from '@/components/ui/branch/format';

type FilterKey = 'all' | 'active' | 'expiring' | 'used' | 'expired';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Map a backend voucher into the card shape. The backend has no free-text
// description or max-discount cap, so we derive description from the real
// minimum-purchase value and leave the max label empty (no fabrication).
function toCard(v: superadminApi.SuperVoucher, now: number): VoucherCardData {
    const expiresAt = new Date(v.berlakuHingga).getTime();
    const isPercent = /persen|percent|%/i.test(v.tipeDiskon);
    const fullyUsed = v.kuota > 0 && v.terpakai >= v.kuota;
    const expired = expiresAt < now || fullyUsed;
    return {
        id: v.id,
        code: v.kode,
        description:
            v.minPembelian > 0 ? `Min. purchase ${formatIDR(v.minPembelian)}` : 'No minimum purchase',
        value: isPercent ? `${v.nilaiDiskon}%` : formatIDRShort(v.nilaiDiskon),
        maxLabel: '',
        quotaUsed: v.terpakai,
        quotaTotal: v.kuota,
        expires: formatDateLong(v.berlakuHingga),
        status: expired ? 'expired' : 'active',
    };
}

interface StatCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <div className="flex flex-col items-start rounded-[12.75px] border border-[#e2e8f0] bg-white p-[18.5px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            <div className="flex w-full items-start justify-between">
                <p className="text-[10.5px] leading-[14px] font-medium text-[#62748e]">{label}</p>
                <div className="flex size-[28px] items-center justify-center rounded-[8.75px] bg-[#f0fdfa] text-[#0f766e]">
                    {icon}
                </div>
            </div>
            <p className="pt-[7px] text-[28px] leading-[42px] font-bold tracking-[-0.56px] text-[#0f172b]">
                {value}
            </p>
        </div>
    );
}

export default function AdminVouchersPage() {
    const [vouchers, setVouchers] = useState<superadminApi.SuperVoucher[]>([]);
    const [stat, setStat] = useState<superadminApi.SuperVoucherStat | null>(null);
    const [filter, setFilter] = useState<FilterKey>('all');
    const [now, setNow] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ac = new AbortController();
        setNow(Date.now());
        Promise.all([
            superadminApi.listVouchers(ac.signal),
            superadminApi.getVouchersStatistik(ac.signal),
        ])
            .then(([v, s]) => {
                setVouchers(v ?? []);
                setStat(s);
            })
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            })
            .finally(() => {
                if (!ac.signal.aborted) setLoading(false);
            });
        return () => ac.abort();
    }, []);

    const classified = useMemo(() => {
        if (now === 0) return [];
        return vouchers.map((v) => {
            const expiresAt = new Date(v.berlakuHingga).getTime();
            const fullyUsed = v.kuota > 0 && v.terpakai >= v.kuota;
            const isExpired = expiresAt < now;
            const isExpiring = !isExpired && expiresAt - now <= SEVEN_DAYS_MS;
            const isActive = !isExpired && !fullyUsed;
            return { v, fullyUsed, isExpired, isExpiring, isActive };
        });
    }, [vouchers, now]);

    const counts = {
        all: classified.length,
        active: classified.filter((c) => c.isActive).length,
        expiring: classified.filter((c) => c.isExpiring).length,
        used: classified.filter((c) => c.fullyUsed).length,
        expired: classified.filter((c) => c.isExpired).length,
    };

    const filterTabs: { key: FilterKey; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'expiring', label: 'Expiring soon' },
        { key: 'used', label: 'Used' },
        { key: 'expired', label: 'Expired' },
    ];

    const visible = classified
        .filter((c) => {
            switch (filter) {
                case 'active':
                    return c.isActive;
                case 'expiring':
                    return c.isExpiring;
                case 'used':
                    return c.fullyUsed;
                case 'expired':
                    return c.isExpired;
                default:
                    return true;
            }
        })
        .map((c) => toCard(c.v, now));

    return (
        <>
            <AdminTopBar title="Vouchers" role="Super Admin" />

            <div className="flex w-full flex-col p-[21px]">
                {error && (
                    <p className="mb-[16px] rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
                        {error}
                    </p>
                )}

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-x-[16px]">
                    <StatCard
                        label="Active Vouchers This Week"
                        value={String(stat?.activeVoucherWeek ?? 0)}
                        icon={<Ticket size={16} />}
                    />
                    <StatCard
                        label="Customer Savings"
                        value={stat ? formatIDRShort(stat.totalCustomerSave) : 'Rp 0'}
                        icon={<TrendingUp size={16} />}
                    />
                </div>

                {/* Filter + grid card */}
                <div className="mt-[16px] w-full rounded-[12.75px] border border-[#e2e8f0] bg-white drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
                    {/* Filter header */}
                    <div className="flex items-center justify-between gap-[10px] border-b border-[#e2e8f0] px-[17.5px] pt-[10.5px] pb-[11.5px]">
                      <div className="flex flex-wrap items-center gap-[5.25px]">
                        {filterTabs.map((tab) => {
                            const isActive = filter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setFilter(tab.key)}
                                    className={`flex items-center gap-[5.25px] rounded-full px-[10.5px] py-[3.5px] text-[10.5px] leading-[14px] font-medium transition-colors ${
                                        isActive ? 'bg-[#009689] text-white' : 'bg-white text-[#314158] hover:bg-[#f1f5f9]'
                                    }`}
                                >
                                    {tab.label}
                                    <span
                                        className={`flex h-[14px] min-w-[14px] items-center justify-center rounded-full px-[3px] text-[10.5px] leading-[14px] ${
                                            isActive ? 'bg-white/20 text-white' : 'bg-[#f1f5f9] text-[#45556c]'
                                        }`}
                                    >
                                        {counts[tab.key]}
                                    </span>
                                </button>
                            );
                        })}
                      </div>

                        <Link
                            href="/admin/vouchers/new"
                            className="flex shrink-0 items-center gap-[6px] rounded-[8px] bg-[#005c55] px-[14px] py-[7px] text-[12px] leading-[16px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                        >
                            <Plus size={14} />
                            Add New Voucher
                        </Link>
                    </div>

                    {/* Voucher grid */}
                    {loading ? (
                        <p className="p-[16px] text-[13px] text-[#6e7977]">Loading…</p>
                    ) : visible.length === 0 ? (
                        <p className="p-[16px] text-[13px] text-[#6e7977]">No vouchers in this category.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-[14px] p-[16px]">
                            {visible.map((voucher) => (
                                <VoucherCard key={voucher.id} voucher={voucher} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
