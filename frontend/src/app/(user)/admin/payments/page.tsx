import React from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import PaymentsView from '@/components/ui/admin/PaymentsView';

export default function AdminPaymentsPage() {
    return (
        <>
            <AdminTopBar title="Payments" role="Super Admin" />
            <PaymentsView />
        </>
    );
}
