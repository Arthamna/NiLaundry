import React from 'react';
import { notFound } from 'next/navigation';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import BranchDetailView from '@/components/ui/admin/BranchDetailView';
import { findBranch } from '@/components/ui/admin/branchData';

interface PageProps {
    params: Promise<{ branch_id: string }>;
}

export default async function BranchDetailPage({ params }: PageProps) {
    const { branch_id } = await params;
    const branch = findBranch(branch_id);

    if (!branch) {
        notFound();
    }

    return (
        <>
            <AdminTopBar title="Branches" role="Super Admin" />
            <BranchDetailView branch={branch} />
        </>
    );
}
