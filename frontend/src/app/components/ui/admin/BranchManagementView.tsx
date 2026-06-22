import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import BranchTable from '@/components/ui/admin/BranchTable';
import { BRANCHES } from '@/components/ui/admin/branchData';

// Page body shared by the list / new routes (Figma node 422:5533).
// The "Tambah Branch Baru" modal on /new renders on top of this exact background.
export default function BranchManagementView() {
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
                    Tambah Branch
                </Link>
            </div>

            <BranchTable branches={BRANCHES} />
        </div>
    );
}
