'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Ticket, ChevronDown, Trash2 } from 'lucide-react';

import { superadminApi, getApiErrorMessage } from '@/lib/api';
import ConfirmDeleteModal from '@/components/ui/admin/ConfirmDeleteModal';

const LABEL = 'text-[13px] leading-[18px] font-medium text-[#181c1c]';
const FIELD =
    'h-[43px] w-full rounded-[8px] border border-[#e0e3e1] bg-white px-[15px] py-[11px] text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none focus:border-[#005c55]';

interface VoucherFormProps {
    /** When set, the form loads the voucher and switches to edit mode. */
    voucherId?: number;
}

type FormState = {
    kode: string;
    tipeDiskon: 'persen' | 'nominal';
    nilaiDiskon: string;
    minPembelian: string;
    kuota: string;
    berlakuHingga: string; // value for <input type="datetime-local">
};

const EMPTY: FormState = {
    kode: '',
    tipeDiskon: 'persen',
    nilaiDiskon: '',
    minPembelian: '',
    kuota: '',
    berlakuHingga: '',
};

// Convert an ISO timestamp into the "YYYY-MM-DDTHH:mm" shape datetime-local needs.
function toLocalInput(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
        d.getMinutes(),
    )}`;
}

// Shared add/edit voucher form rendered as a full page (Vouchers surface).
export default function VoucherForm({ voucherId }: VoucherFormProps) {
    const router = useRouter();
    const isEdit = typeof voucherId === 'number';

    const [form, setForm] = useState<FormState>(EMPTY);
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (!isEdit) return;
        const ac = new AbortController();
        superadminApi
            .getVoucher(voucherId, ac.signal)
            .then((v) => {
                const tipe = /persen|percent|%/i.test(v.tipeDiskon) ? 'persen' : 'nominal';
                setForm({
                    kode: v.kode,
                    tipeDiskon: tipe,
                    nilaiDiskon: String(v.nilaiDiskon),
                    minPembelian: String(v.minPembelian),
                    kuota: String(v.kuota),
                    berlakuHingga: toLocalInput(v.berlakuHingga),
                });
            })
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            })
            .finally(() => {
                if (!ac.signal.aborted) setLoading(false);
            });
        return () => ac.abort();
    }, [isEdit, voucherId]);

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const expiresAt = new Date(form.berlakuHingga);
        if (Number.isNaN(expiresAt.getTime())) {
            setError('Please pick a valid expiry date.');
            return;
        }

        const payload = {
            kode: form.kode.trim(),
            tipeDiskon: form.tipeDiskon,
            nilaiDiskon: Number(form.nilaiDiskon),
            minPembelian: Number(form.minPembelian || 0),
            berlakuHingga: expiresAt.toISOString(),
            kuota: Number(form.kuota),
        };

        setSubmitting(true);
        try {
            if (isEdit) {
                await superadminApi.updateVoucher(voucherId, payload);
            } else {
                await superadminApi.createVoucher(payload);
            }
            router.push('/admin/vouchers');
            router.refresh();
        } catch (err) {
            setError(getApiErrorMessage(err));
            setSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!isEdit) return;
        setDeleteError(null);
        setDeleting(true);
        try {
            await superadminApi.deleteVoucher(voucherId);
            router.push('/admin/vouchers');
            router.refresh();
        } catch (err) {
            setDeleteError(getApiErrorMessage(err));
            setDeleting(false);
        }
    }

    const isPercent = form.tipeDiskon === 'persen';

    return (
        <div className="flex w-full justify-center p-[40px]">
            <div className="w-full max-w-[560px]">
                <Link
                    href="/admin/vouchers"
                    className="mb-[16px] inline-flex items-center gap-[6px] text-[13px] leading-[18px] font-medium text-[#3e4947] hover:text-[#00786f]"
                >
                    <ArrowLeft size={15} />
                    Back to Vouchers
                </Link>

                <div className="overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)]">
                    {/* Header */}
                    <div className="flex items-center gap-[12px] border-b border-[#e0e3e1] bg-gradient-to-r from-[#009689] to-[#00786f] px-[28px] py-[20px]">
                        <span className="flex size-[36px] items-center justify-center rounded-[10px] bg-white/15 text-white">
                            <Ticket size={18} />
                        </span>
                        <div className="flex flex-col">
                            <h2 className="text-[18px] leading-[26px] font-bold text-white">
                                {isEdit ? 'Edit Voucher' : 'Add New Voucher'}
                            </h2>
                            <p className="text-[12.5px] leading-[18px] text-white/80">
                                {isEdit
                                    ? 'Update the voucher details below'
                                    : 'Fill in the details to create a new voucher'}
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="px-[28px] py-[28px] text-[14px] text-[#6e7977]">Loading…</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-[18px] px-[28px] pt-[24px] pb-[8px]">
                                <div className="flex flex-col gap-[6px]">
                                    <label htmlFor="v-kode" className={LABEL}>
                                        Voucher Code <span className="text-[#ef4444]">*</span>
                                    </label>
                                    <input
                                        id="v-kode"
                                        type="text"
                                        required
                                        value={form.kode}
                                        onChange={(e) => update('kode', e.target.value.toUpperCase())}
                                        placeholder="e.g. NILAUNDRY20"
                                        className={`${FIELD} font-mono tracking-[0.5px]`}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-[16px]">
                                    <div className="flex flex-col gap-[6px]">
                                        <label htmlFor="v-tipe" className={LABEL}>
                                            Discount Type <span className="text-[#ef4444]">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="v-tipe"
                                                value={form.tipeDiskon}
                                                onChange={(e) =>
                                                    update('tipeDiskon', e.target.value as FormState['tipeDiskon'])
                                                }
                                                className="h-[43px] w-full appearance-none rounded-[8px] border border-[#e0e3e1] bg-white pr-[40px] pl-[15px] text-[14px] leading-[21px] text-[#181c1c] outline-none focus:border-[#005c55]"
                                            >
                                                <option value="persen">Percentage (%)</option>
                                                <option value="nominal">Fixed Amount (Rp)</option>
                                            </select>
                                            <ChevronDown
                                                size={18}
                                                className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2 text-[#9ca3af]"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-[6px]">
                                        <label htmlFor="v-nilai" className={LABEL}>
                                            {isPercent ? 'Discount (%)' : 'Discount (Rp)'}{' '}
                                            <span className="text-[#ef4444]">*</span>
                                        </label>
                                        <input
                                            id="v-nilai"
                                            type="number"
                                            required
                                            min={isPercent ? 1 : 0}
                                            max={isPercent ? 100 : undefined}
                                            step={isPercent ? 1 : 500}
                                            value={form.nilaiDiskon}
                                            onChange={(e) => update('nilaiDiskon', e.target.value)}
                                            placeholder={isPercent ? '20' : '15000'}
                                            className={FIELD}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-[16px]">
                                    <div className="flex flex-col gap-[6px]">
                                        <label htmlFor="v-min" className={LABEL}>
                                            Min. Purchase (Rp)
                                        </label>
                                        <input
                                            id="v-min"
                                            type="number"
                                            min={0}
                                            step={1000}
                                            value={form.minPembelian}
                                            onChange={(e) => update('minPembelian', e.target.value)}
                                            placeholder="0"
                                            className={FIELD}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-[6px]">
                                        <label htmlFor="v-kuota" className={LABEL}>
                                            Quota <span className="text-[#ef4444]">*</span>
                                        </label>
                                        <input
                                            id="v-kuota"
                                            type="number"
                                            required
                                            min={1}
                                            value={form.kuota}
                                            onChange={(e) => update('kuota', e.target.value)}
                                            placeholder="100"
                                            className={FIELD}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-[6px]">
                                    <label htmlFor="v-expiry" className={LABEL}>
                                        Valid Until <span className="text-[#ef4444]">*</span>
                                    </label>
                                    <input
                                        id="v-expiry"
                                        type="datetime-local"
                                        required
                                        value={form.berlakuHingga}
                                        onChange={(e) => update('berlakuHingga', e.target.value)}
                                        className={FIELD}
                                    />
                                </div>

                                {error && <p className="text-[13px] text-[#b91c1c]">{error}</p>}
                            </div>

                            <div className="flex items-center justify-between gap-[10px] px-[28px] pt-[16px] pb-[24px]">
                                {isEdit ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDeleteError(null);
                                            setConfirmDelete(true);
                                        }}
                                        disabled={submitting || deleting}
                                        className="flex items-center gap-[6px] rounded-[8px] border border-[#f41313] px-[14px] py-[11px] text-[14px] leading-[21px] font-semibold text-[#f41313] transition-colors hover:bg-[#fef2f2] disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                ) : (
                                    <span />
                                )}
                                <div className="flex items-center gap-[10px]">
                                    <Link
                                        href="/admin/vouchers"
                                        className="rounded-[8px] border border-[#bdc9c6] bg-white px-[21px] py-[11px] text-[14px] leading-[21px] font-semibold text-[#3e4947] transition-colors hover:bg-[#f1f4f3]"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="rounded-[8px] bg-[#005c55] px-[22px] py-[11px] text-[14px] leading-[21px] font-semibold text-white transition-colors hover:bg-[#00514b] disabled:opacity-60"
                                    >
                                        {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Voucher'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {confirmDelete && (
                <ConfirmDeleteModal
                    title="Delete Voucher"
                    message={
                        <>
                            Delete voucher <strong>{form.kode || 'this voucher'}</strong>? It will be removed
                            from the list. This action cannot be undone.
                        </>
                    }
                    confirmLabel="Delete Voucher"
                    loading={deleting}
                    error={deleteError}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(false)}
                />
            )}
        </div>
    );
}
