'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Phone, ChevronDown } from 'lucide-react';

import { superadminApi, getApiErrorMessage } from '@/lib/api';

const LABEL = 'text-[13px] leading-[18px] font-medium text-[#181c1c]';
const FIELD =
    'h-[43px] w-full rounded-[8px] border border-[#e0e3e1] bg-white px-[15px] py-[11px] text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none focus:border-[#005c55]';

interface AddStaffModalProps {
    /** When provided, the modal is controlled (closes via callback) instead of navigating. */
    onClose?: () => void;
}

// "Add New Staff" modal (Figma node 422:5078 → 347:3553).
export default function AddStaffModal({ onClose }: AddStaffModalProps = {}) {
    const router = useRouter();
    const [branches, setBranches] = useState<superadminApi.SuperCabang[]>([]);
    const [form, setForm] = useState({ nama: '', email: '', noTelp: '', alamat: '', cabangId: 0 });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ac = new AbortController();
        superadminApi
            .listCabang(ac.signal)
            .then((rows) => {
                const list = rows ?? [];
                setBranches(list);
                if (list.length > 0) setForm((f) => ({ ...f, cabangId: list[0].id }));
            })
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            });
        return () => ac.abort();
    }, []);

    function close() {
        if (onClose) {
            onClose();
            return;
        }
        router.push('/admin/staffs');
    }

    function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        if (!form.cabangId) {
            setError('Please select a branch.');
            return;
        }
        setSubmitting(true);
        try {
            await superadminApi.createPegawai({
                nama: form.nama,
                email: form.email,
                noTelp: form.noTelp,
                alamat: form.alamat,
                cabangId: form.cabangId,
            });
            // Controlled (in-branch) mode closes via callback; standalone navigates.
            if (onClose) {
                onClose();
            } else {
                router.push('/admin/staffs');
                router.refresh();
            }
        } catch (err) {
            setError(getApiErrorMessage(err));
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="absolute inset-0 bg-[rgba(24,28,28,0.4)] backdrop-blur-[2px]"
            />

            {/* Dialog */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Add New Staff"
                className="relative z-10 w-[480px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[16px] bg-white shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)]"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e0e3e1] px-[28px] pt-[24px] pb-[21px]">
                    <div className="flex flex-col">
                        <h2 className="text-[18px] leading-[26px] font-bold text-[#181c1c]">Add New Staff</h2>
                        <p className="pt-[2px] text-[13px] leading-[18px] text-[#6e7977]">
                            Fill in the details to register a new staff member
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Close"
                        className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#f1f4f3] text-[#3e4947] transition-colors hover:bg-[#e5e9e7]"
                    >
                        <X size={14} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Fields */}
                    <div className="flex flex-col gap-[18px] px-[28px] pt-[24px] pb-[8px]">
                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="staff-name" className={LABEL}>
                                Full Name <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                id="staff-name"
                                type="text"
                                required
                                value={form.nama}
                                onChange={(e) => update('nama', e.target.value)}
                                placeholder="e.g. Ahmad Fauzi"
                                className={FIELD}
                            />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="staff-email" className={LABEL}>
                                Email <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                id="staff-email"
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => update('email', e.target.value)}
                                placeholder="example@nilaundry.id"
                                className={FIELD}
                            />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="staff-phone" className={LABEL}>
                                Phone Number <span className="text-[#ef4444]">*</span>
                            </label>
                            <div className="flex h-[43px] w-full items-center gap-[8px] rounded-[8px] border border-[#e0e3e1] bg-white pr-[15px] pl-[17px] focus-within:border-[#005c55]">
                                <Phone size={14} className="shrink-0 text-[#9ca3af]" />
                                <input
                                    id="staff-phone"
                                    type="tel"
                                    required
                                    value={form.noTelp}
                                    onChange={(e) => update('noTelp', e.target.value)}
                                    placeholder="+62 812-3456-7890"
                                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="staff-address" className={LABEL}>
                                Address <span className="text-[#ef4444]">*</span>
                            </label>
                            <textarea
                                id="staff-address"
                                required
                                value={form.alamat}
                                onChange={(e) => update('alamat', e.target.value)}
                                placeholder="Jalan Keputih Perlimaan No. 12"
                                className="h-[64px] w-full resize-none rounded-[8px] border border-[#e0e3e1] bg-white px-[15px] py-[11px] text-[14px] leading-[21px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none focus:border-[#005c55]"
                            />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="staff-branch" className={LABEL}>
                                Branch <span className="text-[#ef4444]">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="staff-branch"
                                    value={form.cabangId}
                                    onChange={(e) => update('cabangId', Number(e.target.value))}
                                    className="h-[42px] w-full appearance-none rounded-[8px] border border-[#e0e3e1] bg-white pr-[40px] pl-[15px] text-[14px] leading-[21px] text-[#181c1c] outline-none focus:border-[#005c55]"
                                >
                                    {branches.length === 0 && <option value={0}>Loading…</option>}
                                    {branches.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.nama}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={20}
                                    className="pointer-events-none absolute top-1/2 right-[11px] -translate-y-1/2 text-[#9ca3af]"
                                />
                            </div>
                        </div>

                        {error && <p className="text-[13px] text-[#b91c1c]">{error}</p>}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-[10px] px-[28px] pt-[16px] pb-[24px]">
                        <button
                            type="button"
                            onClick={close}
                            className="rounded-[8px] border border-[#bdc9c6] bg-white px-[21px] py-[11px] text-[14px] leading-[21px] font-semibold text-[#3e4947] transition-colors hover:bg-[#f1f4f3]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[20px] py-[10px] text-[14px] leading-[21px] font-semibold text-white transition-colors hover:bg-[#00514b] disabled:opacity-60"
                        >
                            <Plus size={16} className="shrink-0" />
                            {submitting ? 'Saving…' : 'Add Staff'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
