import React from 'react';
import { notFound } from 'next/navigation';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import VoucherForm from '@/components/ui/admin/VoucherForm';

interface PageProps {
    params: Promise<{ voucher_id: string }>;
}

export default async function VoucherDetailPage({ params }: PageProps) {
    const { voucher_id } = await params;
    const voucherId = Number(voucher_id);
    if (!Number.isInteger(voucherId) || voucherId <= 0) {
        notFound();
    }

    return (
        <>
            <AdminTopBar title="Vouchers" role="Super Admin" />
            <VoucherForm voucherId={voucherId} />
        </>
    );
}
