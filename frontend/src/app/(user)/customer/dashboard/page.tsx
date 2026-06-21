'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, PackageCheck, WashingMachine, CheckCircle2 } from 'lucide-react';

import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import StatsGrid from '@/components/ui/customer/StatsGrid';
import OrderProgress from '@/components/ui/customer/OrderProgress';
import RecentActivity from '@/components/ui/customer/RecentActivity';
import VouchersPanel from '@/components/ui/customer/VouchersPanel';
import QuickActions from '@/components/ui/customer/QuickActions';
import {
    pesananApi,
    voucherApi,
    notifikasiApi,
    getApiErrorMessage,
    getCurrentPelangganId,
    type Pesanan,
    type Voucher,
    type Notifikasi,
} from '@/lib/api';

// The per-order progress timeline is not exposed by the API yet (see CUSTOMER.md);
// this stays a static visual until the backend provides order stage history.
const STEPS = [
    { label: 'Pickup', sublabel: '9:15 AM', icon: <Truck size={18} />, status: 'done' as const },
    { label: 'Processing', sublabel: '10:30 AM', icon: <PackageCheck size={18} />, status: 'done' as const },
    // { label: 'Washing', sublabel: 'In Progress', icon: <WashingMachine size={18} />, status: 'active' as const },
    { label: 'Delivery', sublabel: 'In Progress', icon: <CheckCircle2 size={18} />, status: 'active' as const },
];

const idr = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;

interface DashboardView {
    activeCount: number;
    completedCount: number;
    totalSaved: string;
    progress: { orderId: string; estimatedTime: string; statusLabel: string } | null;
    activity: { id: string; message: string; timestamp: string }[];
    voucherCards: { code: string; title: string; description: string; expiresIn: string }[];
}

function buildView(orders: Pesanan[], vouchers: Voucher[], notifs: Notifikasi[], totalSaved: number): DashboardView {
    const now = Date.now();
    const active = orders.filter((o) => o.status !== 'selesai');
    const completed = orders.filter((o) => o.status === 'selesai');
    const first = active[0];

    const progress = first
        ? {
              orderId: `#${first.id}`,
              estimatedTime: (() => {
                  const d = new Date(first.estimasiSelesai);
                  return Number.isNaN(d.getTime())
                      ? ''
                      : d.toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                        });
              })(),
              statusLabel: first.status,
          }
        : null;

    const voucherCards = vouchers
        .filter((v) => new Date(v.berlakuHingga).getTime() >= now)
        .slice(0, 3)
        .map((v) => {
            const ms = new Date(v.berlakuHingga).getTime() - now;
            return {
                code: v.kode,
                title: v.tipeDiskon === 'persen' ? `${v.nilaiDiskon}% Discount` : `${idr(v.nilaiDiskon)} Off`,
                description: `Min. belanja ${idr(v.minPembelian)}`,
                expiresIn: ms <= 0 ? 'Kadaluarsa' : `Expires in ${Math.ceil(ms / 86_400_000)} days`,
            };
        });

    return {
        activeCount: active.length,
        completedCount: completed.length,
        totalSaved: idr(totalSaved),
        progress,
        activity: notifs.slice(0, 3).map((n) => ({ id: String(n.id), message: n.judul, timestamp: '' })),
        voucherCards,
    };
}

export default function CustomerDashboardPage() {
    const router = useRouter();
    const [view, setView] = useState<DashboardView | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const pelangganId = getCurrentPelangganId();
        const request =
            pelangganId == null
                ? Promise.reject(new Error('Sesi tidak ditemukan. Silakan masuk kembali.'))
                : Promise.all([
                      pesananApi.listPesanan(pelangganId, undefined, controller.signal),
                      voucherApi.listVouchers(pelangganId, controller.signal),
                      notifikasiApi.listNotifikasi(pelangganId, controller.signal),
                      voucherApi.getTotalHemat(pelangganId, controller.signal),
                  ]);

        request
            .then(([o, v, n, hemat]) => setView(buildView(o, v, n, hemat.totalHemat)))
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, []);

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader />

            {error && (
                <p role="alert" className="text-[14px] text-[#ba1a1a]">
                    {error}
                </p>
            )}

            {isLoading || !view ? (
                <p className="text-[15px] text-[#62748e]">Memuat dashboard…</p>
            ) : (
                <>
                    <StatsGrid
                        activeOrders={view.activeCount}
                        completedOrders={view.completedCount}
                        totalSaved={view.totalSaved}
                    />
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-8 flex flex-col gap-6">
                            {view.progress && (
                                <OrderProgress
                                    orderId={view.progress.orderId}
                                    estimatedTime={view.progress.estimatedTime}
                                    statusLabel={view.progress.statusLabel}
                                    steps={STEPS}
                                />
                            )}
                            <RecentActivity items={view.activity} />
                        </div>
                        <div className="col-span-4 flex flex-col gap-6">
                            <VouchersPanel vouchers={view.voucherCards} />
                            <QuickActions onPlaceOrder={() => router.push('/customer/orders/new')} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
