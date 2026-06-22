import React from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import OrdersView from '@/components/ui/admin/OrdersView';

export default function AdminOrdersPage() {
    return (
        <>
            <AdminTopBar title="Orders" role="Super Admin" />
            <OrdersView />
        </>
    );
}
