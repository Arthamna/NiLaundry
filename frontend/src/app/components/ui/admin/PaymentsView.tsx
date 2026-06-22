import React from 'react';

import AnalysisCards from '@/components/ui/admin/AnalysisCards';
import PaymentsTable from '@/components/ui/admin/PaymentsTable';
import { PAYMENTS } from '@/components/ui/admin/paymentData';

// Page body for /admin/payments (Figma node 496:9134).
export default function PaymentsView() {
    return (
        <div className="flex w-full flex-col gap-[24px] p-[40px]">
            {/* Summary cards */}
            <AnalysisCards />

            {/* Table */}
            <PaymentsTable payments={PAYMENTS} />
        </div>
    );
}
