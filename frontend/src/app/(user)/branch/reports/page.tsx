'use client';

import React, { useEffect, useMemo, useState } from 'react';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import ReportSummaryCards, { MethodSegment } from '@/components/ui/branch/ReportSummaryCards';
import PaymentLedger, { LedgerRow } from '@/components/ui/branch/PaymentLedger';
import {
    adminApi,
    getApiErrorMessage,
    getCurrentCabangId,
    type AdminPayment,
    type PaymentAverage,
    type PaymentMethodChartItem,
    type PaymentTotal,
} from '@/lib/api';
import { formatDateLong, formatIDR, formatInvoiceId } from '@/components/ui/branch/format';

const LEDGER_PAGE_SIZE = 10;

function toLedgerRow(p: AdminPayment): LedgerRow {
    return {
        id: String(p.id),
        invoiceId: formatInvoiceId(p.id),
        customerName: p.pelangganNama,
        customerPhone: p.pelangganNoTelp,
        date: formatDateLong(p.waktu),
        method: p.metode.toUpperCase(),
        amount: formatIDR(p.jumlah),
    };
}

function toSegments(items: PaymentMethodChartItem[]): MethodSegment[] {
    return items.map((it) => ({
        label: it.metode.toUpperCase(),
        percent: it.persentase,
        count: it.totalEntries,
    }));
}

export default function BranchReportsPage() {
    const cabangId = useMemo(() => getCurrentCabangId(), []);

    const [total, setTotal] = useState<PaymentTotal | null>(null);
    const [average, setAverage] = useState<PaymentAverage | null>(null);
    const [chart, setChart] = useState<PaymentMethodChartItem[]>([]);
    const [ledger, setLedger] = useState<AdminPayment[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cabangId == null) {
            setError('Sesi cabang tidak ditemukan.');
            return;
        }
        const controller = new AbortController();
        Promise.all([
            adminApi.getPaymentMethodTotal(cabangId, controller.signal),
            adminApi.getPaymentMethodAverage(cabangId, controller.signal),
            adminApi.getPaymentMethodChart(cabangId, controller.signal),
            adminApi.listPayments(cabangId, { limit: 500 }, controller.signal),
        ])
            .then(([t, a, c, l]) => {
                setTotal(t);
                setAverage(a);
                setChart(c);
                setLedger(l);
                setError(null);
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            });
        return () => controller.abort();
    }, [cabangId]);

    const segments = useMemo(() => toSegments(chart), [chart]);
    const successfulCount = useMemo(
        () => segments.reduce((acc, s) => acc + s.count, 0),
        [segments],
    );

    const filteredLedger = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return ledger;
        return ledger.filter(
            (r) =>
                r.pelangganNama.toLowerCase().includes(q) ||
                String(r.id).includes(q) ||
                String(r.pesananId).includes(q),
        );
    }, [ledger, search]);

    const paged = useMemo(() => {
        const start = (page - 1) * LEDGER_PAGE_SIZE;
        return filteredLedger.slice(start, start + LEDGER_PAGE_SIZE);
    }, [filteredLedger, page]);

    return (
        <>
            <BranchTopBar title="Reports" branchName={`Branch #${cabangId ?? '-'}`} />

            <div className="flex w-full flex-1 flex-col gap-8 bg-[#f8fafc] p-10">
                {error && (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}

                <ReportSummaryCards
                    totalPaid={formatIDR(total?.total ?? 0)}
                    successfulCount={successfulCount}
                    average={formatIDR(average?.average ?? 0)}
                    segments={segments}
                />

                <PaymentLedger
                    rows={paged.map(toLedgerRow)}
                    page={page}
                    pageSize={LEDGER_PAGE_SIZE}
                    totalEntries={filteredLedger.length}
                    onPageChange={setPage}
                    searchTerm={search}
                    onSearchChange={(q) => {
                        setSearch(q);
                        setPage(1);
                    }}
                />
            </div>
        </>
    );
}
