import React from 'react';
import { notFound } from 'next/navigation';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import BranchDetailView from '@/components/ui/admin/BranchDetailView';

interface PageProps {
    params: Promise<{ branch_id: string }>;
}

export default async function BranchDetailPage({ params }: PageProps) {
    const { branch_id } = await params;
    const branchId = Number(branch_id);
    if (!Number.isInteger(branchId) || branchId <= 0) {
        notFound();
    }

    return (
        <>
            <AdminTopBar title="Branches" role="Super Admin" />
            <BranchDetailView branchId={branchId} />
        </>
    );
}
