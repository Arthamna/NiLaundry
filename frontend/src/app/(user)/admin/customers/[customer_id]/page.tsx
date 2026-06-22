import React from 'react';
import { notFound } from 'next/navigation';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import CustomersView from '@/components/ui/admin/CustomersView';
import CustomerDetailModal from '@/components/ui/admin/CustomerDetailModal';

interface PageProps {
    params: Promise<{ customer_id: string }>;
}

// The customer detail modal renders on top of the customers list background.
export default async function CustomerDetailPage({ params }: PageProps) {
    const { customer_id } = await params;
    const customerId = Number(customer_id);
    if (!Number.isInteger(customerId) || customerId <= 0) {
        notFound();
    }

    return (
        <>
            <AdminTopBar title="Customers" role="Super Admin" />
            <CustomersView />
            <CustomerDetailModal customerId={customerId} />
        </>
    );
}
