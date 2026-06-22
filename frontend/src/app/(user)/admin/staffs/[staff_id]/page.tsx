import React from 'react';
import { notFound } from 'next/navigation';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import StaffManagementView from '@/components/ui/admin/StaffManagementView';
import EditStaffModal from '@/components/ui/admin/EditStaffModal';

interface PageProps {
    params: Promise<{ staff_id: string }>;
}

// The staff detail / edit modal renders on top of the staff list background.
export default async function StaffDetailPage({ params }: PageProps) {
    const { staff_id } = await params;
    const staffId = Number(staff_id);
    if (!Number.isInteger(staffId) || staffId <= 0) {
        notFound();
    }

    return (
        <>
            <AdminTopBar title="Staff" role="Super Admin" />
            <StaffManagementView />
            <EditStaffModal staffId={staffId} />
        </>
    );
}
