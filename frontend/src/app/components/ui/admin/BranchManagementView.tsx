'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import BranchTable from '@/components/ui/admin/BranchTable';
import { Branch } from '@/components/ui/admin/branchData';
import { superadminApi, getApiErrorMessage } from '@/lib/api';

function toBranch(c: superadminApi.SuperCabang): Branch {
    return {
        id: String(c.id),
        code: `#BR-${String(c.id).padStart(4, '0')}`,
        name: c.nama,
        address: c.alamat,
        phone: c.noTelp,
        hours: `${c.jamBuka} - ${c.jamTutup}`,
    };
}

// Page body shared by the list / new routes (Figma node 422:5533).
// The "Add New Branch" modal on /new renders on top of this exact background.
export default function BranchManagementView() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ac = new AbortController();
        superadminApi
            .listCabang(ac.signal)
            .then((rows) => setBranches((rows ?? []).map(toBranch)))
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
                    Branch Management
                </h1>
                <Link
                    href="/admin/branches/new"
                    className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[16px] py-[9px] text-[14px] leading-[20px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                >
                    <Plus size={16} className="shrink-0" />
                    Add Branch
                </Link>
            </div>

            {error && (
                <p className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
                    {error}
                </p>
            )}

            {loading ? (
                <p className="text-[13px] text-[#6e7977]">Loading…</p>
            ) : (
                <BranchTable branches={branches} />
            )}
        </div>
    );
}
