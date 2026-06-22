'use client';

import React, { useEffect, useState } from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import TopServicesChart, { TopServiceBar } from '@/components/ui/admin/TopServicesChart';
import ServiceRankingTable, { ServiceRankRow } from '@/components/ui/admin/ServiceRankingTable';
import { superadminApi, getApiErrorMessage } from '@/lib/api';
import { formatIDRShort } from '@/components/ui/branch/format';

export default function AdminServicesPage() {
    const [services, setServices] = useState<superadminApi.SuperStatistikLayanan[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ac = new AbortController();
        superadminApi
            .listServiceStats(ac.signal)
            .then((rows) => setServices(rows ?? []))
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            })
            .finally(() => {
                if (!ac.signal.aborted) setLoading(false);
            });
        return () => ac.abort();
    }, []);

    const bars: TopServiceBar[] = services.map((s) => ({
        label: s.namaLayanan,
        orders: s.totalPesanan,
    }));

    const ranking: ServiceRankRow[] = services.map((s, i) => ({
        rank: i + 1,
        service: s.namaLayanan,
        orders: String(s.totalPesanan),
        revenue: formatIDRShort(s.totalRevenue),
    }));

    return (
        <>
            <AdminTopBar title="Services" role="Super Admin" />

            <div className="flex w-full flex-col gap-[14px] p-[40px]">
                {error && (
                    <p className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
                        {error}
                    </p>
                )}
                {loading ? (
                    <p className="text-[13px] text-[#6e7977]">Loading…</p>
                ) : (
                    <>
                        <TopServicesChart bars={bars} />
                        <ServiceRankingTable rows={ranking} />
                    </>
                )}
            </div>
        </>
    );
}
