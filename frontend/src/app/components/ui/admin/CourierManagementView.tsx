'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import CourierTable from '@/components/ui/admin/CourierTable';
import { Courier } from '@/components/ui/admin/courierData';
import { superadminApi, getApiErrorMessage } from '@/lib/api';
import { initialsOf } from '@/components/ui/branch/format';

function toCourier(k: superadminApi.SuperKurir): Courier {
    return {
        id: String(k.id),
        name: k.nama,
        initials: initialsOf(k.nama),
        plate: k.noPlat,
        vehicleType: k.jenisKendaraan,
        phone: k.noTelp,
        pickups: 0,
        deliveries: 0,
    };
}

// Page body shared by the list / new / detail routes (Figma node 120:6045).
// The modals on /new and /[courier_id] render on top of this exact background.
export default function CourierManagementView() {
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ac = new AbortController();
        superadminApi
            .listKurir(ac.signal)
            .then((rows) => setCouriers((rows ?? []).map(toCourier)))
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            })
            .finally(() => {
                if (!ac.signal.aborted) setLoading(false);
            });
        return () => ac.abort();
    }, []);

    return (
        <div className="flex w-full flex-col p-[40px]">
            {/* Heading row */}
            <div className="flex items-end justify-between">
                <h1 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                    Courier Management
                </h1>
                <Link
                    href="/admin/couriers/new"
                    className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[16px] py-[9px] text-[14px] leading-[20px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                >
                    <Plus size={16} className="shrink-0" />
                    Add Courier
                </Link>
            </div>

            {error && (
                <p className="mt-[20px] rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
                    {error}
                </p>
            )}

            {/* Table */}
            <div className="pt-[14px]">
                {loading ? (
                    <p className="text-[13px] text-[#6e7977]">Loading…</p>
                ) : (
                    <CourierTable couriers={couriers} />
                )}
            </div>
        </div>
    );
}
