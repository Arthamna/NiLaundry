import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import StaffTable from '@/components/ui/admin/StaffTable';
import { STAFF } from '@/components/ui/admin/staffData';

// Page body shared by the list / new / detail routes (Figma node 364:4803).
// The modals on /new and /[staff_id] render on top of this exact background.
export default function StaffManagementView() {
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
                    Tambah Staff
                </Link>
            </div>

            <StaffTable staff={STAFF} />
        </div>
    );
}
