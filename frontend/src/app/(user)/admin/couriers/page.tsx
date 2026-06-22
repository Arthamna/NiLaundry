import React from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import CourierManagementView from '@/components/ui/admin/CourierManagementView';

export default function AdminCouriersPage() {
    return (
        <>
            <AdminTopBar title="Couriers" role="Super Admin" />
            <CourierManagementView />
        </>
    );
}
