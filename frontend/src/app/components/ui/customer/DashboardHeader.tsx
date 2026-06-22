'use client';

import { useEffect, useState } from 'react';
import { getCachedPelanggan, getCurrentPelangganId, voucherApi } from '@/lib/api';

/**
 * Page header shown on every customer page.
 *
 * Called with no props on customer pages → it self-resolves the logged-in
 * customer's name from the session cache and counts currently-valid vouchers
 * from GET /pelanggan/{id}/voucher. The optional props remain for other callers
 * (admin/superadmin/help) that still pass explicit values; when given they win.
 */
interface DashboardHeaderProps {
    name?: string;
    activeVouchers?: number;
    /** @deprecated not rendered; kept for backward compatibility with existing callers. */
    membership?: string;
    /** @deprecated not rendered; kept for backward compatibility with existing callers. */
    avatarUrl?: string;
}

export default function DashboardHeader(props: DashboardHeaderProps) {
    // Start from props only so SSR and the first client render match (the session
    // cache lives in localStorage, which is unavailable on the server). The cached
    // name is filled in after mount to avoid a hydration mismatch.
    const [name, setName] = useState(props.name ?? '');
    const [activeVouchers, setActiveVouchers] = useState(props.activeVouchers ?? 0);

    useEffect(() => {
        if (props.name != null) return;
        const cachedName = getCachedPelanggan()?.nama;
        if (cachedName) setName(cachedName);
    }, [props.name]);

    useEffect(() => {
        if (props.activeVouchers != null) return;
        const pelangganId = getCurrentPelangganId();
        if (pelangganId == null) return;

        const controller = new AbortController();
        voucherApi
            // 'owned' so the badge matches the Vouchers page "Active" tab.
            .listVouchers(pelangganId, 'owned', controller.signal)
            .then((vouchers) => {
                const now = Date.now();
                const active = vouchers.filter(
                    (v) => !v.usedByMe && new Date(v.berlakuHingga).getTime() >= now,
                );
                setActiveVouchers(active.length);
            })
            .catch(() => {
                /* header badge is non-critical; ignore fetch errors */
            });
        return () => controller.abort();
    }, [props.activeVouchers]);

    const firstName = name.split(' ')[0] || 'there';
    const initial = firstName.charAt(0).toUpperCase() || '?';

    return (
        <header className="flex h-[66px] items-center justify-between">
            <div className="flex flex-col gap-1">
                <h1 className="text-[31px] leading-[38px] font-semibold tracking-[-0.6px] text-[#181c1c]">
                    Hello, {firstName}!
                </h1>
                <div className="flex items-center">
                    <span className="rounded-full bg-[#00776a] px-4 py-1 text-[13px] leading-4 font-semibold tracking-[0.6px] text-white">
                        {activeVouchers} Active Vouchers
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => window.location.href = '/customer/profile'}
                    className="flex items-center gap-2 rounded-full border border-[#bdc9c6] bg-white py-[5px] pr-[17px] pl-[9px]"
                    aria-label="User Profile"
                >
                    <div className="flex size-8 items-center justify-center rounded-full bg-[#80d5cb] text-sm font-bold text-[#005c55]">
                        {initial}
                    </div>
                    <span className="text-[15px] leading-5 font-medium text-[#181c1c]">{name || 'Guest'}</span>
                </button>
            </div>
        </header>
    );
}
