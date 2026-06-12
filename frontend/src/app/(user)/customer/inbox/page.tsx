'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import FilterTabs from '@/components/ui/customer/FilterTabs';
import InboxItem from '@/components/ui/customer/InboxItem';

const TABS = ['All', 'Order', 'Promo', 'Payment'];

const MESSAGES = [
    { icon: '📦', title: 'Pesanan ORD-2399 siap diantar', subtitle: 'Kurir Budi menuju lokasi Anda', time: '10 mnt lalu', unread: true },
    { icon: '💳', title: 'Pembayaran berhasil', subtitle: 'QRIS Rp 36.000 untuk ORD-2401', time: '1 jam lalu', unread: true },
    { icon: '🎟️', title: 'Voucher baru CUCI30', subtitle: 'Diskon 30% untuk dry clean', time: '3 jam lalu', unread: true },
    { icon: '⭐', title: 'Beri ulasan ORD-2380', subtitle: 'Bantu kami dengan rating', time: 'Kemarin lalu', unread: false },
    { icon: '🛵', title: 'Pesanan ORD-2380 sudah diantar', subtitle: 'Terima kasih telah memesan', time: '2 hari lalu', unread: false },
];

export default function CustomerInboxPage() {
    const [active, setActive] = useState('All');

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name="Sarah Jenkins" activeVouchers={3} membership="Gold Member" />

            <div className="flex w-full flex-col gap-[30px]">
                <FilterTabs tabs={TABS} active={active} onChange={setActive} />

                <div className="flex w-full flex-col items-start">
                    {MESSAGES.map((m, i) => (
                        <InboxItem
                            key={i}
                            icon={m.icon}
                            title={m.title}
                            subtitle={m.subtitle}
                            time={m.time}
                            unread={m.unread}
                            last={i === MESSAGES.length - 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
