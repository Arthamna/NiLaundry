import React from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import BranchManagementView from '@/components/ui/admin/BranchManagementView';

export default function AdminBranchesPage() {
    return (
        <>
            <AdminTopBar title="Branches" role="Super Admin" />
            <BranchManagementView />
        </>
    );
}
