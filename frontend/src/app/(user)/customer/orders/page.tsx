'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import OrdersSection from '@/components/ui/customer/OrdersSection';
import OrderCard from '@/components/ui/customer/OrderCard';
import { pesananApi, ulasanApi, getApiErrorMessage, getCurrentPelangganId, type Pesanan } from '@/lib/api';
import { isCompletedStatus, isCancelledStatus, isHistoryStatus } from '@/lib/orderStatus';

function formatEta(p: Pesanan): string {
    const d = new Date(p.estimasiSelesai);
    if (Number.isNaN(d.getTime())) return '';
    const fmt = d.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
    if (isCancelledStatus(p.status)) return `Dibatalkan · ${fmt}`;
    return isCompletedStatus(p.status) ? `Selesai · ${fmt}` : `ETA ${fmt}`;
}

export default function CustomerOrdersPage() {
    const [orders, setOrders] = useState<Pesanan[]>([]);
    // pesananId set of orders this customer has already reviewed (GET /pelanggan/{id}/ulasan).
    const [reviewedIds, setReviewedIds] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const pelangganId = getCurrentPelangganId();

        if (pelangganId == null) {
            setError('Sesi tidak ditemukan. Silakan masuk kembali.');
            setIsLoading(false);
            return;
        }

        Promise.all([
            pesananApi.listPesanan(pelangganId, undefined, controller.signal),
            // Reviews are non-critical for the list; fall back to none on error.
            ulasanApi.listUlasan(pelangganId, controller.signal).catch(() => []),
        ])
            .then(([pesanan, ulasan]) => {
                setOrders(pesanan);
                setReviewedIds(new Set(ulasan.map((u) => u.pesananId)));
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, []);

    // Cancelled orders (incl. payment-failed) join completed in the history
    // section — never the active list.
    const activeOrders = orders.filter((o) => !isHistoryStatus(o.status));
    const completedOrders = orders.filter((o) => isHistoryStatus(o.status));

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader />

            <div className="flex w-full flex-col gap-[40px]">
                <div className="flex items-center justify-between">
                    <h1 className="text-[20px] leading-[28px] font-bold text-[#0f172b]">My Orders</h1>
                    <Link
                        href="/customer/orders/new"
                        className="flex items-center gap-[7px] rounded-[8.75px] bg-[#0f766e] px-[16px] py-[9px] text-[12.25px] leading-[17.5px] font-semibold text-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#0d655e]"
                    >
                        <Plus size={16} /> Place New Order
                    </Link>
                </div>

                {error && (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}

                {isLoading ? (
                    <p className="text-[15px] text-[#62748e]">Memuat pesanan…</p>
                ) : (
                    <>
                        {/* `service` name is not stored on pesanan (see CUSTOMER.md) — neutral
                            label until listPesanan embeds the layanan/service summary. */}
                        <OrdersSection title="Active Order">
                            {activeOrders.length === 0 ? (
                                <p className="text-[15px] text-[#62748e]">Tidak ada pesanan aktif.</p>
                            ) : (
                                activeOrders.map((o) => (
                                    <OrderCard
                                        key={o.id}
                                        orderId={`#${o.id}`}
                                        service={o.ringkasanLayanan || 'Pesanan Laundry'}
                                        status={o.status}
                                        eta={formatEta(o)}
                                    />
                                ))
                            )}
                        </OrdersSection>

                        <OrdersSection title="Completed Order">
                            {completedOrders.length === 0 ? (
                                <p className="text-[15px] text-[#62748e]">Belum ada pesanan selesai.</p>
                            ) : (
                                completedOrders.map((o) => (
                                    <OrderCard
                                        key={o.id}
                                        orderId={`#${o.id}`}
                                        service={o.ringkasanLayanan || 'Pesanan Laundry'}
                                        status={o.status}
                                        eta={formatEta(o)}
                                        isReviewed={reviewedIds.has(o.id)}
                                    />
                                ))
                            )}
                        </OrdersSection>
                    </>
                )}
            </div>
        </div>
    );
}
