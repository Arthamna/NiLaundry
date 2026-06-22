import React from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import VoucherForm from '@/components/ui/admin/VoucherForm';

export default function AddVoucherPage() {
    return (
        <>
            <AdminTopBar title="Vouchers" role="Super Admin" />
            <VoucherForm />
        </>
    );
}
