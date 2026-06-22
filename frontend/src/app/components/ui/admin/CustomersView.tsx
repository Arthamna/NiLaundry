'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import CustomerTable from '@/components/ui/admin/CustomerTable';
import { Customer } from '@/components/ui/admin/customerData';
import { superadminApi, getApiErrorMessage } from '@/lib/api';
import { initialsOf, formatDateLong, formatIDRShort } from '@/components/ui/branch/format';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Avatar gradient palette assigned deterministically by row index.
const GRADIENTS: { from: string; to: string }[] = [
    { from: '#00bba7', to: '#00786f' },
    { from: '#3b82f6', to: '#1d4ed8' },
    { from: '#f59e0b', to: '#d97706' },
    { from: '#64748b', to: '#475569' },
    { from: '#8b5cf6', to: '#6d28d9' },
    { from: '#10b981', to: '#059669' },
];

function toCustomer(c: superadminApi.SuperCustomer, i: number): Customer {
    const grad = GRADIENTS[i % GRADIENTS.length];
    return {
        id: String(c.id),
        name: c.nama,
        initials: initialsOf(c.nama),
        phone: c.noTelp,
        email: c.email,
        address: c.alamat,
        memberLabel: '',
        orders: c.totalOrder,
        totalSpend: c.totalSpend,
        lastOrder: c.lastOrder ? formatDateLong(c.lastOrder) : '-',
        avgRating: Number(c.avgRating.toFixed(1)),
        gradFrom: grad.from,
        gradTo: grad.to,
    };
}

interface KpiCardProps {
    label: string;
    value: string;
}

function KpiCard({ label, value }: KpiCardProps) {
    return (
        <div className="rounded-[12px] border border-[#e2e8f0] bg-white p-[24px]">
            <p className="text-[13px] leading-[18px] text-[#6e7977]">{label}</p>
            <p className="pt-[4px] text-[32px] leading-[40px] font-bold tracking-[-0.72px] text-[#181c1c]">{value}</p>
        </div>
    );
}

// Customers page body shared by the list / detail routes (Figma node 357:3352).
export default function CustomersView() {
    const [raw, setRaw] = useState<superadminApi.SuperCustomer[]>([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Debounced server search on name / phone.
    useEffect(() => {
        const ac = new AbortController();
        const id = setTimeout(() => {
            setLoading(true);
            superadminApi
                .listCustomers({ search: search.trim() || undefined, limit: 50 }, ac.signal)
                .then((rows) => setRaw(rows ?? []))
                .catch((err) => {
                    if (!ac.signal.aborted) setError(getApiErrorMessage(err));
                })
                .finally(() => {
                    if (!ac.signal.aborted) setLoading(false);
                });
        }, 300);
        return () => {
            clearTimeout(id);
            ac.abort();
        };
    }, [search]);

    const customers = useMemo(() => raw.map(toCustomer), [raw]);

    const kpis = useMemo(() => {
        if (raw.length === 0) {
            return { total: '0', active: '0', rating: '-', avgSpend: 'Rp 0' };
        }
        const now = Date.now();
        const active = raw.filter(
            (c) => c.lastOrder && now - new Date(c.lastOrder).getTime() <= THIRTY_DAYS_MS,
        ).length;
        const avgRating = raw.reduce((s, c) => s + c.avgRating, 0) / raw.length;
        const avgSpend = raw.reduce((s, c) => s + c.totalSpend, 0) / raw.length;
        return {
            total: String(raw.length),
            active: String(active),
            rating: avgRating.toFixed(1),
            avgSpend: formatIDRShort(avgSpend),
        };
    }, [raw]);

    return (
        <div className="flex w-full max-w-[1440px] flex-col gap-[24px] px-[40px] pt-[40px] pb-[96px]">
            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-x-[16px]">
                <KpiCard label="Total Customers" value={kpis.total} />
                <KpiCard label="Active (30d)" value={kpis.active} />
                <KpiCard label="Avg Rating" value={kpis.rating} />
                <KpiCard label="Avg Spend / Customer" value={kpis.avgSpend} />
            </div>

            {/* Search */}
            <div className="relative h-[41px] w-full max-w-[440px]">
                <Search size={15} className="pointer-events-none absolute top-[13px] left-[14px] text-[#6e7977]" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or phone number..."
                    className="h-[41px] w-full rounded-[8px] border border-[#e0e3e1] bg-white py-[10px] pr-[15px] pl-[41px] text-[14px] text-[#181c1c] placeholder:text-[#6e7977] outline-none focus:border-[#005c55]"
                />
            </div>

            {error && (
                <p className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
                    {error}
                </p>
            )}

            {/* Table */}
            {loading ? (
                <p className="text-[13px] text-[#6e7977]">Loading…</p>
            ) : (
                <CustomerTable customers={customers} />
            )}
        </div>
    );
}
