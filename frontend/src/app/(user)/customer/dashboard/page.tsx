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

const STEP_LABEL: Record<string, string> = {
    pickup: 'Pickup',
    processing: 'Processing',
    delivery: 'Delivery',
    completed: 'Completed',
};

function scenarioSteps(jenisAmbil: string, jenisAntar: string): string[] {
    const steps: string[] = [];
    if (jenisAmbil === 'pickup') steps.push('pickup');
    steps.push('processing');
    if (jenisAntar === 'delivery') steps.push('delivery');
    steps.push('completed');
    return steps;
}

function iconFor(tipe: string): string {
    const t = tipe.toLowerCase();
    if (t.includes('order') || t.includes('pesan')) return '📦';
    if (t.includes('promo') || t.includes('voucher')) return '🎟️';
    if (t.includes('pay') || t.includes('bayar')) return '💳';
    return '🔔';
}

const idr = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;

interface DashboardView {
    activeCount: number;
    completedCount: number;
    totalSaved: string;
    progress: { 
        orderId: string; 
        estimatedTime: string; 
        statusLabel: string;
        steps: { label: string; sublabel: string; icon: React.ReactNode; status: 'done' | 'active' | 'pending' }[];
        progressFraction: number;
    } | null;
    activity: { id: string; icon: string; title: string; subtitle: string; time: string; unread?: boolean }[];
    voucherCards: { code: string; title: string; description: string; expiresIn: string }[];
}

function buildView(orders: Pesanan[], vouchers: Voucher[], notifs: Notifikasi[], totalSaved: number): DashboardView {
    const now = Date.now();
    const active = orders.filter((o) => o.status !== 'selesai' && o.status !== 'completed' && o.status !== 'dibatalkan' && o.status !== 'canceled').sort((a, b) => new Date(b.tanggalPesanan).getTime() - new Date(a.tanggalPesanan).getTime());
    const completed = orders.filter((o) => o.status === 'selesai' || o.status === 'completed');
    const first = active[0];

    let progress = null;
    if (first) {
        const scenario = scenarioSteps(first.jenisAmbil, first.jenisAntar);
        
        let status = first.status;
        if (status === 'diproses') status = 'processing';
        else if (status === 'selesai') status = 'completed';

        let currentIndex = scenario.indexOf(status);
        if (currentIndex < 0) currentIndex = 0;

        const activeStepName = scenario[currentIndex];
        
        const BASE_STEPS = ['pickup', 'processing', 'delivery'];
        let activeBaseIndex = BASE_STEPS.indexOf(activeStepName);
        if (activeStepName === 'completed') {
            activeBaseIndex = 3;
        }

        const maxIndex = BASE_STEPS.length - 1;
        const progressFraction = Math.min(activeBaseIndex, maxIndex) / maxIndex;

        const stepsData = BASE_STEPS.map((key, i) => {
            const state = i < activeBaseIndex ? 'done' : i === activeBaseIndex ? 'active' : 'pending';
            const sublabel = state === 'active' ? 'In Progress' : state === 'pending' ? 'Pending' : 'Done';
            
            let icon;
            if (key === 'pickup') icon = <Truck size={18} />;
            else if (key === 'processing') icon = <PackageCheck size={18} />;
            else if (key === 'delivery') icon = <CheckCircle2 size={18} />;
            else icon = <CheckCircle2 size={18} />;

            return {
                label: STEP_LABEL[key] ?? key,
                sublabel,
                icon,
                status: state as 'done' | 'active' | 'pending',
            };
        });

        progress = {
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
            statusLabel: STEP_LABEL[first.status] ?? first.status,
            steps: stepsData,
            progressFraction,
        };
    }

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
        activity: notifs.slice(0, 3).map((n) => ({
            id: String(n.id),
            icon: iconFor(n.tipe),
            title: n.judul,
            subtitle: n.pesan,
            time: '',
            unread: false,
        })),
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
                            {view.progress && view.progress.steps.length > 0 && (
                                <OrderProgress
                                    orderId={view.progress.orderId}
                                    estimatedTime={view.progress.estimatedTime}
                                    statusLabel={view.progress.statusLabel}
                                    steps={view.progress.steps}
                                    progress={view.progress.progressFraction}
                                />
                            )}
                            <RecentActivity items={view.activity} onViewAll={() => router.push('/customer/inbox')} />
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
