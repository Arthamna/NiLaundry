'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import StaffTable from '@/components/ui/admin/StaffTable';
import { Staff } from '@/components/ui/admin/staffData';
import { superadminApi, getApiErrorMessage } from '@/lib/api';
import { initialsOf } from '@/components/ui/branch/format';

// Avatar palette assigned deterministically by row index (Figma rows cycle
// through these tints).
const AVATARS: { bg: string; text: string }[] = [
    { bg: '#6df5e1', text: '#006f64' },
    { bg: '#e0f2fe', text: '#0369a1' },
    { bg: '#fef3c6', text: '#b45309' },
    { bg: '#e5e9e7', text: '#3e4947' },
    { bg: '#ede9fe', text: '#6d28d9' },
    { bg: '#fce7f3', text: '#be185d' },
    { bg: '#d1fae5', text: '#065f46' },
];

function toStaff(p: superadminApi.SuperPegawai, i: number): Staff {
    const tone = AVATARS[i % AVATARS.length];
    return {
        id: String(p.id),
        name: p.nama,
        initials: initialsOf(p.nama),
        branch: p.cabangNama,
        email: p.email,
        phone: p.noTelp,
        address: p.alamat,
        avatarBg: tone.bg,
        avatarText: tone.text,
    };
}

// Page body shared by the list / new / detail routes (Figma node 364:4803).
// The modals on /new and /[staff_id] render on top of this exact background.
export default function StaffManagementView() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ac = new AbortController();
        superadminApi
            .listPegawai(ac.signal)
            .then((rows) => setStaff((rows ?? []).map(toStaff)))
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            })
            .finally(() => {
                if (!ac.signal.aborted) setLoading(false);
            });
        return () => ac.abort();
    }, []);

    return (
        <div className="flex w-full flex-col gap-[24px] p-[40px]">
            {/* Heading row */}
            <div className="flex items-end justify-between">
                <h1 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                    Staff Management
                </h1>
                <Link
                    href="/admin/staffs/new"
                    className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[16px] py-[9px] text-[14px] leading-[20px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                >
                    <Plus size={16} className="shrink-0" />
                    Add Staff
                </Link>
            </div>

            {error && (
                <p className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
                    {error}
                </p>
            )}

            {loading ? <p className="text-[13px] text-[#6e7977]">Loading…</p> : <StaffTable staff={staff} />}
        </div>
    );
}
