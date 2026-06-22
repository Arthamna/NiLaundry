import React from 'react';

import AdminTopBar from '@/components/ui/admin/AdminTopBar';
import TopServicesChart, { TopServiceBar } from '@/components/ui/admin/TopServicesChart';
import ServiceRankingTable, { ServiceRankRow } from '@/components/ui/admin/ServiceRankingTable';

// Demo data mirrors the Figma design (node 120:7897) one-for-one.
const TOP_SERVICES: TopServiceBar[] = [
    { label: 'Cuci Setrika', orders: 1224 },
    { label: 'Express', orders: 642 },
    { label: 'Dry Clean', orders: 482 },
    { label: 'Sepatu', orders: 312 },
    { label: 'Bed Cover', orders: 224 },
    { label: 'Setrika', orders: 186 },
    { label: 'Boneka', orders: 144 },
];

const SERVICE_RANKING: ServiceRankRow[] = [
    { rank: 1, service: 'Cuci Setrika Reguler', orders: '1224', revenue: 'Rp 61,2jt' },
    { rank: 2, service: 'Cuci Express', orders: '642', revenue: 'Rp 38,5jt' },
    { rank: 3, service: 'Dry Clean Premium', orders: '482', revenue: 'Rp 42,6jt' },
    { rank: 4, service: 'Sepatu', orders: '312', revenue: 'Rp 23,4jt' },
    { rank: 5, service: 'Bed Cover', orders: '224', revenue: 'Rp 16,8jt' },
    { rank: 6, service: 'Setrika Only', orders: '186', revenue: 'Rp 9,3jt' },
    { rank: 7, service: 'Boneka', orders: '144', revenue: 'Rp 12,1jt' },
];

export default function AdminServicesPage() {
    return (
        <>
            <AdminTopBar title="Services" role="Super Admin" />

            <div className="flex w-full flex-col gap-[14px] p-[40px]">
                <TopServicesChart bars={TOP_SERVICES} />
                <ServiceRankingTable rows={SERVICE_RANKING} />
            </div>
        </>
    );
}
