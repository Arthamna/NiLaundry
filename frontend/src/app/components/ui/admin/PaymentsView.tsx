'use client';

import React, { useEffect, useMemo, useState } from 'react';

import AnalysisCards from '@/components/ui/admin/AnalysisCards';
import PaymentsTable from '@/components/ui/admin/PaymentsTable';
import { Payment, MethodShare } from '@/components/ui/admin/paymentData';
import { superadminApi, getApiErrorMessage } from '@/lib/api';
import {
    formatIDR,
    formatIDRShort,
    formatDateShort,
    paymentMethodColor,
} from '@/components/ui/branch/format';

function toPayment(p: superadminApi.SuperPayment): Payment {
    return {
        id: String(p.id),
        invoice: `#INV-${String(p.id).padStart(4, '0')}`,
        customerName: p.pelangganNama,
        customerPhone: p.pelangganNoTelp,
        date: formatDateShort(p.waktu),
        method: p.metode as Payment['method'],
        amount: formatIDR(p.jumlah),
    };
}

// Page body for /admin/payments (Figma node 496:9134).
export default function PaymentsView() {
    const [payments, setPayments] = useState<superadminApi.SuperPayment[]>([]);
    const [mix, setMix] = useState<superadminApi.SuperPaymentMix[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ac = new AbortController();
        Promise.all([
            superadminApi.listPayments({ limit: 200 }, ac.signal),
            superadminApi.getPaymentMix(ac.signal),
        ])
            .then(([rows, m]) => {
                setPayments(rows ?? []);
                setMix(m ?? []);
            })
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            })
            .finally(() => {
                if (!ac.signal.aborted) setLoading(false);
            });
        return () => ac.abort();
    }, []);

    const rows = useMemo(() => payments.map(toPayment), [payments]);

    const shares: MethodShare[] = mix.map((m) => ({
        method: m.metode,
        color: paymentMethodColor(m.metode),
        percent: Math.round(m.persentase),
        count: m.totalEntries,
    }));

    const totals = useMemo(() => {
        const sum = payments.reduce((s, p) => s + p.jumlah, 0);
        const count = payments.length;
        return {
            totalPaid: formatIDRShort(sum),
            totalPaidSub: `${count} successful transactions`,
            average: count > 0 ? formatIDR(sum / count) : 'Rp 0',
        };
    }, [payments]);

    return (
        <div className="flex w-full flex-col gap-[24px] p-[40px]">
            {error && (
                <p className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
                    {error}
                </p>
            )}

            {/* Summary cards */}
            <AnalysisCards
                shares={shares.length > 0 ? shares : undefined}
                totalPaid={totals.totalPaid}
                totalPaidSub={totals.totalPaidSub}
                average={totals.average}
            />

            {/* Table */}
            {loading ? (
                <p className="text-[13px] text-[#6e7977]">Loading…</p>
            ) : (
                <PaymentsTable payments={rows} />
            )}
        </div>
    );
}
