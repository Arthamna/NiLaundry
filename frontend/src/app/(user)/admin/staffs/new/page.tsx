import React from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import StaffManagementView from '@/components/ui/admin/StaffManagementView';
import AddStaffModal from '@/components/ui/admin/AddStaffModal';

// The "Tambah Staff Baru" modal renders on top of the staff list background.
export default function AddStaffPage() {
    return (
        <>
            <AdminTopBar title="Staff" role="Super Admin" />
            <StaffManagementView />
            <AddStaffModal />
        </>
    );
}
