'use client';

import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

import { BranchService } from '@/components/ui/admin/branchData';

interface ServiceModalProps {
    mode: 'add' | 'edit';
    service?: BranchService;
    onClose: () => void;
}

const LABEL = 'text-[13px] leading-[18px] font-medium text-[#181c1c]';
const FIELD =
    'h-[43px] w-full rounded-[8px] border border-[#e0e3e1] bg-white px-[15px] py-[11px] text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none focus:border-[#005c55]';

// "Tambah Layanan Baru" / "Edit Layanan" modal (Figma nodes 466:7555 / 466:7856).
export default function ServiceModal({ mode, service, onClose }: ServiceModalProps) {
    const isEdit = mode === 'edit';

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // UI-only: persistence is wired separately. Close on submit.
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Tutup"
                onClick={onClose}
                className="absolute inset-0 bg-[rgba(24,28,28,0.4)] backdrop-blur-[2px]"
            />

            {/* Dialog */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={isEdit ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                className="relative z-10 w-[480px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[16px] bg-white shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)]"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e0e3e1] px-[28px] pt-[24px] pb-[21px]">
                    <div className="flex flex-col">
                        <h2 className="text-[18px] leading-[26px] font-bold text-[#181c1c]">
                            {isEdit ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                        </h2>
                        {!isEdit && (
                            <p className="pt-[2px] text-[13px] leading-[18px] text-[#6e7977]">
                                Isi data lengkap untuk menambahkan layanan baru
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
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
                            <label htmlFor="svc-name" className={LABEL}>
                                Nama Layanan <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                id="svc-name"
                                type="text"
                                defaultValue={service?.name}
                                placeholder="Cuci Setrika"
                                className={FIELD}
                            />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="svc-unit" className={LABEL}>
                                Satuan <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                id="svc-unit"
                                type="text"
                                defaultValue={service?.unit}
                                placeholder="kg"
                                className={FIELD}
                            />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="svc-price" className={LABEL}>
                                Harga per Satuan <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                id="svc-price"
                                type="text"
                                defaultValue={service?.price}
                                placeholder="50000"
                                className={FIELD}
                            />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="svc-desc" className={LABEL}>
                                Deskripsi
                            </label>
                            <textarea
                                id="svc-desc"
                                defaultValue={service?.description}
                                placeholder="Lorem ipsum dolor sit amet"
                                className="h-[64px] w-full resize-none rounded-[8px] border border-[#e0e3e1] bg-white px-[15px] py-[11px] text-[14px] leading-[21px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none focus:border-[#005c55]"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-[28px] pt-[16px] pb-[24px]">
                        {isEdit ? (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Hapus layanan"
                                className="flex size-[40px] items-center justify-center rounded-[8px] border border-[#fecaca] bg-white text-[#ef4444] transition-colors hover:bg-[#fef2f2]"
                            >
                                <Trash2 size={16} />
                            </button>
                        ) : (
                            <span />
                        )}
                        <div className="flex items-center gap-[10px]">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-[8px] border border-[#bdc9c6] bg-white px-[21px] py-[11px] text-[14px] leading-[21px] font-semibold text-[#3e4947] transition-colors hover:bg-[#f1f4f3]"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[20px] py-[10px] text-[14px] leading-[21px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                            >
                                {isEdit ? (
                                    'Simpan'
                                ) : (
                                    <>
                                        <Plus size={16} className="shrink-0" />
                                        Tambah Layanan
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
