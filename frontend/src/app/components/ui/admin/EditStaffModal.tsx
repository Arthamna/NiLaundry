'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Trash2 } from 'lucide-react';

import { superadminApi, getApiErrorMessage } from '@/lib/api';
import ConfirmDeleteModal from '@/components/ui/admin/ConfirmDeleteModal';

interface EditStaffModalProps {
    staffId: number;
}

const ROW = 'flex items-center gap-[12px]';
const ROW_LABEL =
    'flex w-[140px] shrink-0 items-center justify-between text-[14px] leading-[17.5px] text-[#0f172b]';
const ROW_INPUT =
    'h-[30px] min-w-0 flex-1 rounded-[6px] border border-[#bdc9c6] px-[10px] py-[2px] text-[14px] leading-[17.5px] text-[#181c1c] outline-none focus:border-[#005c55]';

// Staff detail / edit modal (Figma node 466:2760 → 466:3015). Fetches the staff
// from the list (no GET-by-id endpoint) and persists via updatePegawai.
export default function EditStaffModal({ staffId }: EditStaffModalProps) {
    const router = useRouter();
    const [branches, setBranches] = useState<superadminApi.SuperCabang[]>([]);
    const [form, setForm] = useState({ nama: '', email: '', noTelp: '', alamat: '', cabangId: 0 });
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        const ac = new AbortController();
        Promise.all([superadminApi.listPegawai(ac.signal), superadminApi.listCabang(ac.signal)])
            .then(([staff, cabang]) => {
                setBranches(cabang ?? []);
                const found = (staff ?? []).find((s) => s.id === staffId);
                if (found) {
                    setForm({
                        nama: found.nama,
                        email: found.email,
                        noTelp: found.noTelp,
                        alamat: found.alamat,
                        cabangId: found.cabangId,
                    });
                } else {
                    setError('Staff not found.');
                }
            })
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            })
            .finally(() => {
                if (!ac.signal.aborted) setLoading(false);
            });
        return () => ac.abort();
    }, [staffId]);

    function close() {
        router.push('/admin/staffs');
    }

    function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function save() {
        setError(null);
        setBusy(true);
        try {
            await superadminApi.updatePegawai(staffId, {
                nama: form.nama,
                email: form.email,
                noTelp: form.noTelp,
                alamat: form.alamat,
                cabangId: form.cabangId,
            });
            router.push('/admin/staffs');
            router.refresh();
        } catch (err) {
            setError(getApiErrorMessage(err));
            setBusy(false);
        }
    }

    async function remove() {
        setError(null);
        setBusy(true);
        try {
            await superadminApi.deletePegawai(staffId);
            router.push('/admin/staffs');
            router.refresh();
        } catch (err) {
            setError(getApiErrorMessage(err));
            setBusy(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="absolute inset-0 bg-[rgba(24,28,28,0.4)] backdrop-blur-[2px]"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Staff detail"
                className="relative z-10 w-[480px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[16px] bg-white shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)]"
            >
                <div className="flex items-center justify-between border-b border-[#e0e3e1] px-[28px] pt-[24px] pb-[21px]">
                    <h2 className="text-[18px] leading-[26px] font-bold text-[#181c1c]">Edit Staff</h2>
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Close"
                        className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#f1f4f3] text-[#3e4947] transition-colors hover:bg-[#e5e9e7]"
                    >
                        <X size={14} />
                    </button>
                </div>

                {loading ? (
                    <p className="px-[28px] py-[40px] text-[14px] text-[#6e7977]">Loading…</p>
                ) : (
                    <div className="flex flex-col gap-[16px] px-[28px] pt-[24px] pb-[8px]">
                        <div className={ROW}>
                            <div className={ROW_LABEL}>
                                <span>Name</span>
                                <span>:</span>
                            </div>
                            <input value={form.nama} onChange={(e) => update('nama', e.target.value)} className={ROW_INPUT} />
                        </div>
                        <div className={ROW}>
                            <div className={ROW_LABEL}>
                                <span>Branch</span>
                                <span>:</span>
                            </div>
                            <select
                                value={form.cabangId}
                                onChange={(e) => update('cabangId', Number(e.target.value))}
                                className={ROW_INPUT}
                            >
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={ROW}>
                            <div className={ROW_LABEL}>
                                <span>Email</span>
                                <span>:</span>
                            </div>
                            <input value={form.email} onChange={(e) => update('email', e.target.value)} className={ROW_INPUT} />
                        </div>
                        <div className={ROW}>
                            <div className={ROW_LABEL}>
                                <span>Phone Number</span>
                                <span>:</span>
                            </div>
                            <input value={form.noTelp} onChange={(e) => update('noTelp', e.target.value)} className={ROW_INPUT} />
                        </div>
                        <div className={ROW}>
                            <div className={ROW_LABEL}>
                                <span>Address</span>
                                <span>:</span>
                            </div>
                            <input value={form.alamat} onChange={(e) => update('alamat', e.target.value)} className={ROW_INPUT} />
                        </div>
                        {error && <p className="text-[13px] text-[#b91c1c]">{error}</p>}
                    </div>
                )}

                <div className="flex items-center justify-between px-[28px] pt-[16px] pb-[24px]">
                    <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        disabled={busy || loading}
                        aria-label="Delete staff"
                        className="flex h-[40px] items-center justify-center rounded-[6.75px] border border-[#f41313] px-[10px] py-[8px] text-[#f41313] transition-colors hover:bg-[#fef2f2] disabled:opacity-50"
                    >
                        <Trash2 size={20} />
                    </button>
                    <div className="flex items-center gap-[10px]">
                        <button
                            type="button"
                            onClick={close}
                            className="rounded-[8px] border border-[#bdc9c6] bg-white px-[21px] py-[11px] text-[14px] leading-[21px] font-semibold text-[#3e4947] transition-colors hover:bg-[#f1f4f3]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={save}
                            disabled={busy || loading}
                            className="rounded-[8px] bg-[#005c55] px-[20px] py-[10px] text-[14px] leading-[21px] font-semibold text-white transition-colors hover:bg-[#00514b] disabled:opacity-60"
                        >
                            {busy ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>

            {confirmDelete && (
                <ConfirmDeleteModal
                    title="Delete Staff"
                    message={
                        <>
                            Delete <strong>{form.nama || 'this staff member'}</strong>? This action cannot be
                            undone.
                        </>
                    }
                    confirmLabel="Delete Staff"
                    loading={busy}
                    error={error}
                    onConfirm={remove}
                    onCancel={() => setConfirmDelete(false)}
                />
            )}
        </div>
    );
}
