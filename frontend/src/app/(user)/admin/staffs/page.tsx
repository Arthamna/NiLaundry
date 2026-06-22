import React from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import StaffManagementView from '@/components/ui/admin/StaffManagementView';

export default function AdminStaffsPage() {
    return (
        <>
            <AdminTopBar title="Staff" role="Super Admin" />
            <StaffManagementView />
        </>
    );
}
