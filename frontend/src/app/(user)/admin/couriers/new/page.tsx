import React from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import CourierManagementView from '@/components/ui/admin/CourierManagementView';
import AddCourierModal from '@/components/ui/admin/AddCourierModal';

// The "Tambah Courier Baru" modal renders on top of the courier list background.
export default function AddCourierPage() {
    return (
        <>
            <AdminTopBar title="Couriers" role="Super Admin" />
            <CourierManagementView />
            <AddCourierModal />
        </>
    );
}
