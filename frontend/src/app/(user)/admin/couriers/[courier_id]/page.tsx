import React from 'react';
import { notFound } from 'next/navigation';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import CourierManagementView from '@/components/ui/admin/CourierManagementView';
import EditCourierModal from '@/components/ui/admin/EditCourierModal';

interface PageProps {
    params: Promise<{ courier_id: string }>;
}

// The courier detail / edit modal renders on top of the courier list background.
export default async function CourierDetailPage({ params }: PageProps) {
    const { courier_id } = await params;
    const courierId = Number(courier_id);
    if (!Number.isInteger(courierId) || courierId <= 0) {
        notFound();
    }

    return (
        <>
            <AdminTopBar title="Couriers" role="Super Admin" />
            <CourierManagementView />
            <EditCourierModal courierId={courierId} />
        </>
    );
}
