import React from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import CustomersView from '@/components/ui/admin/CustomersView';

export default function AdminCustomersPage() {
    return (
        <>
            <AdminTopBar title="Customers" role="Super Admin" />
            <CustomersView />
        </>
    );
}
