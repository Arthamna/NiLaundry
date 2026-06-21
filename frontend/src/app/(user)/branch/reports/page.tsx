import React from 'react';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import ReportSummaryCards from '@/components/ui/branch/ReportSummaryCards';
import PaymentLedger, { LedgerRow } from '@/components/ui/branch/PaymentLedger';

const LEDGER: LedgerRow[] = [
    {
        id: '1',
        invoiceId: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '24 Oct, 14:30',
        method: 'QRIS',
        amount: 'Rp 45.000',
    },
    {
        id: '2',
        invoiceId: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '24 Oct, 09:45',
        method: 'BANK',
        amount: 'Rp 120.000',
    },
    {
        id: '3',
        invoiceId: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '23 Oct, 16:20',
        method: 'GOPAY',
        amount: 'Rp 85.000',
    },
    {
        id: '4',
        invoiceId: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '23 Oct, 10:05',
        method: 'OVO',
        amount: 'Rp 60.000',
    },
    {
        id: '5',
        invoiceId: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '23 Oct, 10:05',
        method: 'OVO',
        amount: 'Rp 60.000',
    },
];

export default function BranchReportsPage() {
    return (
        <>
            <BranchTopBar title="Reports" branchName="Keputih Branch" />

            <div className="flex w-full flex-1 flex-col gap-8 bg-[#f8fafc] p-10">
                <ReportSummaryCards />
                <PaymentLedger rows={LEDGER} />
            </div>
        </>
    );
}
