'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Phone, Clock } from 'lucide-react';

import { superadminApi, getApiErrorMessage } from '@/lib/api';

const LABEL = 'text-[13px] leading-[18px] font-medium text-[#181c1c]';
const FIELD =
    'h-[43px] w-full rounded-[8px] border border-[#e0e3e1] bg-white px-[15px] py-[11px] text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none focus:border-[#005c55]';
const ICON_FIELD =
    'flex h-[43px] w-full items-center gap-[8px] rounded-[8px] border border-[#e0e3e1] bg-white pr-[15px] pl-[17px] focus-within:border-[#005c55]';

// "Add New Branch" modal (Figma node 466:5460 / 466:5393).
export default function AddBranchModal() {
    const router = useRouter();
    const [form, setForm] = useState({ nama: '', alamat: '', noTelp: '', jamBuka: '', jamTutup: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function close() {
        router.push('/admin/branches');
    }

    function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await superadminApi.createCabang({
                nama: form.nama,
                alamat: form.alamat,
                noTelp: form.noTelp,
                jamBuka: form.jamBuka,
                jamTutup: form.jamTutup,
            });
            router.push('/admin/branches');
            router.refresh();
        } catch (err) {
            setError(getApiErrorMessage(err));
            setSubmitting(false);
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
                aria-label="Add New Branch"
                className="relative z-10 w-[480px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[16px] bg-white shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)]"
            >
                <div className="flex items-center justify-between border-b border-[#e0e3e1] px-[28px] pt-[24px] pb-[21px]">
                    <div className="flex flex-col">
                        <h2 className="text-[18px] leading-[26px] font-bold text-[#181c1c]">Add New Branch</h2>
                        <p className="pt-[2px] text-[13px] leading-[18px] text-[#6e7977]">
                            Fill in the details to register a new branch
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
                    <div className="flex flex-col gap-[18px] px-[28px] pt-[24px] pb-[8px]">
                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="branch-name" className={LABEL}>
                                Branch Name <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                id="branch-name"
                                type="text"
                                required
                                value={form.nama}
                                onChange={(e) => update('nama', e.target.value)}
                                placeholder="e.g. Keputih"
                                className={FIELD}
                            />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="branch-address" className={LABEL}>
                                Branch Address <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                id="branch-address"
                                type="text"
                                required
                                value={form.alamat}
                                onChange={(e) => update('alamat', e.target.value)}
                                placeholder="Jalan Keputih Perlimaan"
                                className={FIELD}
                            />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="branch-phone" className={LABEL}>
                                Phone Number <span className="text-[#ef4444]">*</span>
                            </label>
                            <div className={ICON_FIELD}>
                                <Phone size={14} className="shrink-0 text-[#9ca3af]" />
                                <input
                                    id="branch-phone"
                                    type="tel"
                                    required
                                    value={form.noTelp}
                                    onChange={(e) => update('noTelp', e.target.value)}
                                    placeholder="+62 812-3456-7890"
                                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-[16px]">
                            <div className="flex flex-1 flex-col gap-[6px]">
                                <label htmlFor="branch-open" className={LABEL}>
                                    Opening Time <span className="text-[#ef4444]">*</span>
                                </label>
                                <div className={ICON_FIELD}>
                                    <Clock size={14} className="shrink-0 text-[#9ca3af]" />
                                    <input
                                        id="branch-open"
                                        type="time"
                                        required
                                        value={form.jamBuka}
                                        onChange={(e) => update('jamBuka', e.target.value)}
                                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-[6px]">
                                <label htmlFor="branch-close" className={LABEL}>
                                    Closing Time <span className="text-[#ef4444]">*</span>
                                </label>
                                <div className={ICON_FIELD}>
                                    <Clock size={14} className="shrink-0 text-[#9ca3af]" />
                                    <input
                                        id="branch-close"
                                        type="time"
                                        required
                                        value={form.jamTutup}
                                        onChange={(e) => update('jamTutup', e.target.value)}
                                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-[13px] text-[#b91c1c]">{error}</p>}
                    </div>

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
                            {submitting ? 'Saving…' : 'Add Branch'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
