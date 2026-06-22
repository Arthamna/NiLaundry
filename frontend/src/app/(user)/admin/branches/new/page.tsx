import React from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import BranchManagementView from '@/components/ui/admin/BranchManagementView';
import AddBranchModal from '@/components/ui/admin/AddBranchModal';

// The "Tambah Branch Baru" modal renders on top of the branch list background.
export default function AddBranchPage() {
    return (
        <>
            <AdminTopBar title="Branches" role="Super Admin" />
            <BranchManagementView />
            <AddBranchModal />
        </>
    );
}
