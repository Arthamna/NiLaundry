'use client';

import { useEffect, useState } from 'react';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import FilterTabs from '@/components/ui/customer/FilterTabs';
import InboxItem from '@/components/ui/customer/InboxItem';
import { notifikasiApi, getApiErrorMessage, getCurrentPelangganId, type Notifikasi } from '@/lib/api';

const TABS = ['All', 'Order', 'Promo', 'Payment'];

function iconFor(tipe: string): string {
    const t = tipe.toLowerCase();
    if (t.includes('order') || t.includes('pesan')) return '📦';
    if (t.includes('promo') || t.includes('voucher')) return '🎟️';
    if (t.includes('pay') || t.includes('bayar')) return '💳';
    return '🔔';
}

function matchesTab(tipe: string, tab: string): boolean {
    if (tab === 'All') return true;
    const t = tipe.toLowerCase();
    if (tab === 'Order') return t.includes('order') || t.includes('pesan');
    if (tab === 'Promo') return t.includes('promo') || t.includes('voucher');
    if (tab === 'Payment') return t.includes('pay') || t.includes('bayar');
    return true;
}

export default function CustomerInboxPage() {
    const [activeTab, setActiveTab] = useState('All');
    const [items, setItems] = useState<Notifikasi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const pelangganId = getCurrentPelangganId();
        const request =
            pelangganId == null
                ? Promise.reject(new Error('Sesi tidak ditemukan. Silakan masuk kembali.'))
                : notifikasiApi.listNotifikasi(pelangganId, controller.signal);

        request
            .then(setItems)
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, []);

    const filtered = items.filter((n) => matchesTab(n.tipe, activeTab));

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader />

            <div className="flex w-full flex-col gap-[30px]">
                <FilterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

                {error && (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}

                <div className="flex w-full flex-col items-start">
                    {isLoading ? (
                        <p className="text-[15px] text-[#62748e]">Memuat notifikasi…</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-[15px] text-[#62748e]">Tidak ada notifikasi.</p>
                    ) : (
                        // NOTE: notifikasi has no timestamp / read-state column (see CUSTOMER.md);
                        // `time` is blank and `unread` false until the schema adds them.
                        filtered.map((n, i) => (
                            <InboxItem
                                key={n.id}
                                icon={iconFor(n.tipe)}
                                title={n.judul}
                                subtitle={n.pesan}
                                time=""
                                unread={false}
                                last={i === filtered.length - 1}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
