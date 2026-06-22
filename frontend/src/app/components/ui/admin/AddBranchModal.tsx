'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Phone, Clock } from 'lucide-react';

const LABEL = 'text-[13px] leading-[18px] font-medium text-[#181c1c]';
const FIELD =
    'h-[43px] w-full rounded-[8px] border border-[#e0e3e1] bg-white px-[15px] py-[11px] text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none focus:border-[#005c55]';
const ICON_FIELD =
    'flex h-[43px] w-full items-center gap-[8px] rounded-[8px] border border-[#e0e3e1] bg-white pr-[15px] pl-[17px] focus-within:border-[#005c55]';

// "Tambah Branch Baru" modal (Figma node 466:5460 / 466:5393).
export default function AddBranchModal() {
    const router = useRouter();

    function close() {
        router.push('/admin/branches');
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // UI-only: persistence is wired separately. Close on submit.
        close();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Tutup"
                onClick={close}
                className="absolute inset-0 bg-[rgba(24,28,28,0.4)] backdrop-blur-[2px]"
            />

            {/* Dialog */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Tambah Branch Baru"
                className="relative z-10 w-[480px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[16px] bg-white shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)]"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e0e3e1] px-[28px] pt-[24px] pb-[21px]">
                    <div className="flex flex-col">
                        <h2 className="text-[18px] leading-[26px] font-bold text-[#181c1c]">Tambah Branch Baru</h2>
                        <p className="pt-[2px] text-[13px] leading-[18px] text-[#6e7977]">
                            Isi data lengkap untuk mendaftarkan branch baru
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Tutup"
                        className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#f1f4f3] text-[#3e4947] transition-colors hover:bg-[#e5e9e7]"
                    >
                        <X size={14} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Fields */}
                    <div className="flex flex-col gap-[18px] px-[28px] pt-[24px] pb-[8px]">
                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="branch-name" className={LABEL}>
                                Nama Cabang <span className="text-[#ef4444]">*</span>
                            </label>
                            <input id="branch-name" type="text" placeholder="Contoh: Keputih" className={FIELD} />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="branch-address" className={LABEL}>
                                Alamat Cabang <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                id="branch-address"
                                type="text"
                                placeholder="Jalan Keputih Perlimaan"
                                className={FIELD}
                            />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="branch-phone" className={LABEL}>
                                Nomor Telepon <span className="text-[#ef4444]">*</span>
                            </label>
                            <div className={ICON_FIELD}>
                                <Phone size={14} className="shrink-0 text-[#9ca3af]" />
                                <input
                                    id="branch-phone"
                                    type="tel"
                                    placeholder="+62 812-3456-7890"
                                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-[16px]">
                            <div className="flex flex-1 flex-col gap-[6px]">
                                <label htmlFor="branch-open" className={LABEL}>
                                    Jam Buka <span className="text-[#ef4444]">*</span>
                                </label>
                                <div className={ICON_FIELD}>
                                    <Clock size={14} className="shrink-0 text-[#9ca3af]" />
                                    <input
                                        id="branch-open"
                                        type="text"
                                        placeholder="08:00"
                                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-[6px]">
                                <label htmlFor="branch-close" className={LABEL}>
                                    Jam Tutup <span className="text-[#ef4444]">*</span>
                                </label>
                                <div className={ICON_FIELD}>
                                    <Clock size={14} className="shrink-0 text-[#9ca3af]" />
                                    <input
                                        id="branch-close"
                                        type="text"
                                        placeholder="19:00"
                                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-[10px] px-[28px] pt-[16px] pb-[24px]">
                        <button
                            type="button"
                            onClick={close}
                            className="rounded-[8px] border border-[#bdc9c6] bg-white px-[21px] py-[11px] text-[14px] leading-[21px] font-semibold text-[#3e4947] transition-colors hover:bg-[#f1f4f3]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[20px] py-[10px] text-[14px] leading-[21px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                        >
                            <Plus size={16} className="shrink-0" />
                            Tambah Branch
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
