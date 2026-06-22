'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

import AnalysisCards from '@/components/ui/admin/AnalysisCards';
import BranchReviewSection from '@/components/ui/admin/BranchReviewSection';
import BranchServicesTable from '@/components/ui/admin/BranchServicesTable';
import ServiceModal from '@/components/ui/admin/ServiceModal';
import StaffTable from '@/components/ui/admin/StaffTable';
import AddStaffModal from '@/components/ui/admin/AddStaffModal';
import ConfirmDeleteModal from '@/components/ui/admin/ConfirmDeleteModal';
import { BranchService, BranchReview } from '@/components/ui/admin/branchData';
import { Staff } from '@/components/ui/admin/staffData';
import { MethodShare } from '@/components/ui/admin/paymentData';
import { superadminApi, getApiErrorMessage } from '@/lib/api';
import { formatIDR, formatIDRShort, initialsOf, avatarToneFor } from '@/components/ui/branch/format';

type Tab = 'Performance' | 'Staff' | 'Services';
type ModalState =
    | null
    | { type: 'addStaff' }
    | { type: 'addService' }
    | { type: 'editService'; service: BranchService };

const TABS: Tab[] = ['Performance', 'Staff', 'Services'];
const MIX_COLORS = ['#0f766e', '#ffb900', '#0ea5e9', '#a855f7', '#6366f1', '#94a3b8'];

const TONE_HEX: Record<string, { bg: string; text: string }> = {
    mint: { bg: '#6df5e1', text: '#006f64' },
    teal: { bg: '#9cf2e8', text: '#0f766e' },
    gray: { bg: '#e5e9e7', text: '#3e4947' },
    pink: { bg: '#fce7f3', text: '#be185d' },
    purple: { bg: '#ede9fe', text: '#6d28d9' },
    blue: { bg: '#e0f2fe', text: '#0369a1' },
    amber: { bg: '#fef3c6', text: '#b45309' },
    green: { bg: '#d1fae5', text: '#065f46' },
};

function toBranchService(s: superadminApi.SuperCabangService): BranchService {
    return {
        id: `tarif-${s.idTarif}`,
        code: `#SV-${String(s.idTarif).padStart(4, '0')}`,
        name: s.namaLayanan,
        unit: s.satuanLayanan,
        price: formatIDR(s.hargaPerSatuan),
        description: s.deskripsiLayanan ?? '-',
        idTarif: s.idTarif,
        idLayanan: s.idLayanan,
        hargaValue: s.hargaPerSatuan,
    };
}

function toBranchReview(r: superadminApi.SuperBranchReview): BranchReview {
    const tone = TONE_HEX[avatarToneFor(r.pelangganNama)] ?? TONE_HEX.gray;
    return {
        id: `rv-${r.id}`,
        customerName: r.pelangganNama,
        customerInitials: initialsOf(r.pelangganNama),
        customerPhone: '',
        avatarBg: tone.bg,
        avatarText: tone.text,
        rating: r.rating,
        date: '',
        orderCode: `#ORD-${String(r.pesananId).padStart(4, '0')}`,
        service: r.layananNama ?? '',
        weight: '',
        comment: r.komentar,
    };
}

function toStaff(p: superadminApi.SuperPegawai): Staff {
    const tone = TONE_HEX[avatarToneFor(p.nama)] ?? TONE_HEX.gray;
    return {
        id: String(p.id),
        name: p.nama,
        initials: initialsOf(p.nama),
        branch: p.cabangNama,
        email: p.email,
        phone: p.noTelp,
        address: p.alamat,
        avatarBg: tone.bg,
        avatarText: tone.text,
    };
}

// Branch detail page with Performance / Staff / Services tabs (Figma nodes 466:5705 / 466:6413 / 466:7108).
export default function BranchDetailView({ branchId }: { branchId: number }) {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('Performance');
    const [modal, setModal] = useState<ModalState>(null);

    const [branch, setBranch] = useState<superadminApi.SuperCabang | null>(null);
    const [perf, setPerf] = useState<superadminApi.SuperCabangPerformance | null>(null);
    const [mix, setMix] = useState<superadminApi.SuperPaymentMix[]>([]);
    const [services, setServices] = useState<BranchService[]>([]);
    const [reviews, setReviews] = useState<BranchReview[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const loadServices = useCallback(
        (signal?: AbortSignal) =>
            superadminApi
                .getBranchServices(branchId, signal)
                .then((rows) => setServices((rows ?? []).map(toBranchService))),
        [branchId],
    );

    const loadStaff = useCallback(
        (signal?: AbortSignal) =>
            superadminApi
                .listPegawai(signal)
                .then((rows) => setStaff((rows ?? []).filter((p) => p.cabangId === branchId).map(toStaff))),
        [branchId],
    );

    useEffect(() => {
        const ac = new AbortController();
        Promise.all([
            superadminApi.getCabang(branchId, ac.signal),
            superadminApi.getBranchPerformance(ac.signal),
            superadminApi.getPaymentMix(ac.signal),
            superadminApi.getBranchReviews(branchId, { limit: 50 }, ac.signal),
            loadServices(ac.signal),
            loadStaff(ac.signal),
        ])
            .then(([cabang, perfRows, mixRows, reviewRows]) => {
                setBranch(cabang);
                setPerf((perfRows ?? []).find((p) => p.idCabang === branchId) ?? null);
                setMix(mixRows ?? []);
                setReviews((reviewRows ?? []).map(toBranchReview));
            })
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            })
            .finally(() => {
                if (!ac.signal.aborted) setLoading(false);
            });
        return () => ac.abort();
    }, [branchId, loadServices, loadStaff]);

    const shares: MethodShare[] = mix.map((m, i) => ({
        method: m.metode as MethodShare['method'],
        color: MIX_COLORS[i % MIX_COLORS.length],
        percent: Math.round(m.persentase),
        count: m.totalEntries,
    }));

    const analysis = useMemo(() => {
        if (!perf) return { totalPaid: 'Rp 0', totalPaidSub: '0 orders', average: 'Rp 0' };
        return {
            totalPaid: formatIDRShort(perf.totalPaid),
            totalPaidSub: `${perf.totalOrder} orders`,
            average: perf.totalOrder > 0 ? formatIDR(perf.totalPaid / perf.totalOrder) : 'Rp 0',
        };
    }, [perf]);

    const branchName = branch?.nama ?? '';

    async function removeBranch() {
        setDeleteError(null);
        setDeleting(true);
        try {
            await superadminApi.deleteCabang(branchId);
            router.push('/admin/branches');
            router.refresh();
        } catch (err) {
            setDeleteError(getApiErrorMessage(err));
            setDeleting(false);
        }
    }

    return (
        <div className="flex w-full flex-col gap-[24px] p-[40px]">
            {/* Top bar: back + delete */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.push('/admin/branches')}
                    className="flex h-[40px] w-fit items-center gap-[6px] rounded-full bg-[#005c55] px-[14px] py-[5px] text-[16px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                >
                    <ArrowLeft size={18} className="shrink-0" />
                    Back
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setDeleteError(null);
                        setConfirmDelete(true);
                    }}
                    disabled={deleting}
                    className="flex h-[40px] items-center gap-[6px] rounded-[8px] border border-[#f41313] px-[14px] py-[8px] text-[14px] font-semibold text-[#f41313] transition-colors hover:bg-[#fef2f2] disabled:opacity-50"
                >
                    <Trash2 size={16} />
                    Delete Branch
                </button>
            </div>

            {error && (
                <p className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
                    {error}
                </p>
            )}

            {/* Title + tabs */}
            <div className="flex flex-col gap-[8px]">
                <h1 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                    {branchName ? `${branchName} Branch` : 'Branch'}
                </h1>
                <div className="flex items-center border-b border-[#e0e3e1]">
                    {TABS.map((t) => {
                        const isActive = tab === t;
                        return (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTab(t)}
                                className={`px-[16px] py-[9px] text-[14px] font-semibold transition-colors ${
                                    isActive
                                        ? 'border-b-[2px] border-[#181c1c] text-[#181c1c]'
                                        : 'text-[#6e7977] hover:text-[#3e4947]'
                                }`}
                            >
                                {t}
                            </button>
                        );
                    })}
                </div>
            </div>

            {loading ? (
                <p className="text-[13px] text-[#6e7977]">Loading…</p>
            ) : (
                <>
                    {/* Performance */}
                    {tab === 'Performance' && (
                        <div className="flex flex-col gap-[24px]">
                            <div className="flex flex-col gap-[16px]">
                                <h2 className="text-[24px] leading-[32px] font-bold tracking-[-0.6px] text-[#181c1c]">
                                    Analysis
                                </h2>
                                <AnalysisCards
                                    shares={shares.length > 0 ? shares : undefined}
                                    totalPaid={analysis.totalPaid}
                                    totalPaidSub={analysis.totalPaidSub}
                                    average={analysis.average}
                                />
                            </div>
                            <BranchReviewSection reviews={reviews} />
                        </div>
                    )}

                    {/* Staff */}
                    {tab === 'Staff' && (
                        <div className="flex flex-col gap-[20px]">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setModal({ type: 'addStaff' })}
                                    className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[16px] py-[9px] text-[14px] leading-[20px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                                >
                                    <Plus size={16} className="shrink-0" />
                                    Add Staff
                                </button>
                            </div>
                            <StaffTable staff={staff} title={`Staff · ${branchName} Branch`} />
                        </div>
                    )}

                    {/* Services */}
                    {tab === 'Services' && (
                        <div className="flex flex-col gap-[20px]">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setModal({ type: 'addService' })}
                                    className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[16px] py-[9px] text-[14px] leading-[20px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                                >
                                    <Plus size={16} className="shrink-0" />
                                    Add Service
                                </button>
                            </div>
                            <BranchServicesTable
                                branchName={branchName}
                                services={services}
                                onRowClick={(service) => setModal({ type: 'editService', service })}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            {modal?.type === 'addStaff' && (
                <AddStaffModal
                    onClose={() => {
                        setModal(null);
                        loadStaff();
                    }}
                />
            )}
            {modal?.type === 'addService' && (
                <ServiceModal
                    mode="add"
                    cabangId={branchId}
                    onClose={() => setModal(null)}
                    onSaved={() => {
                        setModal(null);
                        loadServices();
                    }}
                />
            )}
            {modal?.type === 'editService' && (
                <ServiceModal
                    mode="edit"
                    cabangId={branchId}
                    service={modal.service}
                    onClose={() => setModal(null)}
                    onSaved={() => {
                        setModal(null);
                        loadServices();
                    }}
                />
            )}

            {confirmDelete && (
                <ConfirmDeleteModal
                    title="Delete Branch"
                    message={
                        <>
                            Delete <strong>{branchName || 'this branch'}</strong>? This action cannot be undone.
                        </>
                    }
                    confirmLabel="Delete Branch"
                    loading={deleting}
                    error={deleteError}
                    onConfirm={removeBranch}
                    onCancel={() => setConfirmDelete(false)}
                />
            )}
        </div>
    );
}
