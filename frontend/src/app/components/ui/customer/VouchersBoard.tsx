'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import VoucherTabs from '@/components/ui/customer/VoucherTabs';
import VoucherCard from '@/components/ui/customer/VoucherCard';
import { voucherApi, getApiErrorMessage, getCurrentPelangganId, type Voucher } from '@/lib/api';

type Tab = 'Active' | 'Used' | 'Expired';
const TABS = ['Active', 'Used', 'Expired'];

interface CardVM {
    id: number;
    amount: string;
    code: string;
    description: string;
    expiry: string;
}

const idr = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;

// Built inside the fetch callback so the time-based "expiry" is computed off-render.
function toVM(v: Voucher, now: number): CardVM {
    const ms = new Date(v.berlakuHingga).getTime() - now;
    const expiry = ms <= 0 ? 'Kadaluarsa' : `${Math.ceil(ms / 86_400_000)} hari lagi`;
    const amount = v.tipeDiskon === 'persen' ? `${v.nilaiDiskon}%` : idr(v.nilaiDiskon);
    return { id: v.id, amount, code: v.kode, description: `Min. belanja ${idr(v.minPembelian)}`, expiry };
}

export default function VouchersBoard() {
    const router = useRouter();
    const [active, setActive] = useState<Tab>('Active');
    const [groups, setGroups] = useState<Record<Tab, CardVM[]>>({ Active: [], Used: [], Expired: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const pelangganId = getCurrentPelangganId();
        const request =
            pelangganId == null
                ? Promise.reject(new Error('Sesi tidak ditemukan. Silakan masuk kembali.'))
                : // 'owned' = vouchers this customer has claimed (voucher_pelanggan),
                  // so a code redeemed via "Add Voucher" actually shows up here.
                  voucherApi.listVouchers(pelangganId, 'owned', controller.signal);

        request
            .then((vouchers: Voucher[]) => {
                const now = Date.now();
                const isExpired = (v: Voucher) => new Date(v.berlakuHingga).getTime() < now;
                // Bucket owned vouchers: applied to an order => Used (regardless of
                // expiry); otherwise past expiry => Expired, still valid => Active.
                setGroups({
                    Active: vouchers.filter((v) => !v.usedByMe && !isExpired(v)).map((v) => toVM(v, now)),
                    Used: vouchers.filter((v) => v.usedByMe).map((v) => toVM(v, now)),
                    Expired: vouchers.filter((v) => !v.usedByMe && isExpired(v)).map((v) => toVM(v, now)),
                });
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, []);

    const shown = groups[active];

    return (
        <div className="flex w-full flex-col gap-[50px]">
            <div className="flex w-full flex-col gap-[30px]">
                <VoucherTabs tabs={TABS} active={active} onChange={(t) => setActive(t as Tab)} />

                {error && (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}

                <div className="flex w-full flex-col gap-[20px]">
                    {isLoading ? (
                        <p className="text-[15px] text-[#62748e]">Memuat voucher…</p>
                    ) : shown.length === 0 ? (
                        <p className="text-[15px] text-[#62748e]">Tidak ada voucher.</p>
                    ) : (
                        shown.map((v) => (
                            <VoucherCard
                                key={v.id}
                                amount={v.amount}
                                code={v.code}
                                description={v.description}
                                expiry={v.expiry}
                                // Only Active vouchers are appliable; "Apply" mirrors the
                                // dashboard "Use Now" — start a new order with this voucher
                                // pre-selected. Used / Expired tabs are display-only.
                                onApply={
                                    active === 'Active'
                                        ? () => router.push(`/customer/orders/new?voucher=${v.id}`)
                                        : undefined
                                }
                            />
                        ))
                    )}
                </div>
            </div>

            <Link
                href="/customer/vouchers/add"
                className="relative flex w-full items-center justify-center gap-[8px] rounded-[12px] border border-[#bdc9c6] bg-white py-[16px] text-[15px] leading-[20px] font-medium text-[#bdc9c6] transition-colors hover:border-[#009689] hover:text-[#009689]"
                aria-label="Add New Voucher"
            >
                <Plus size={20} />
                Add New Voucher
            </Link>
        </div>
    );
}
