'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Phone, ChevronDown } from 'lucide-react';

import { VEHICLE_TYPES } from '@/components/ui/admin/courierData';

const LABEL = 'text-[13px] leading-[18px] font-medium text-[#181c1c]';
const FIELD =
    'h-[43px] w-full rounded-[8px] border border-[#e0e3e1] bg-white px-[15px] py-[11px] text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none focus:border-[#005c55]';

// "Tambah Courier Baru" modal (Figma node 466:4425).
export default function AddCourierModal() {
    const router = useRouter();

    function close() {
        router.push('/admin/couriers');
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
                aria-label="Tambah Courier Baru"
                className="relative z-10 w-[480px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[16px] bg-white shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)]"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e0e3e1] px-[28px] pt-[24px] pb-[21px]">
                    <div className="flex flex-col">
                        <h2 className="text-[18px] leading-[26px] font-bold text-[#181c1c]">Tambah Courier Baru</h2>
                        <p className="pt-[2px] text-[13px] leading-[18px] text-[#6e7977]">
                            Isi data lengkap untuk mendaftarkan courier baru
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
                            <label htmlFor="courier-name" className={LABEL}>
                                Nama Lengkap <span className="text-[#ef4444]">*</span>
                            </label>
                            <input id="courier-name" type="text" placeholder="Contoh: Ahmad Fauzi" className={FIELD} />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="courier-vehicle" className={LABEL}>
                                Jenis Kendaraan <span className="text-[#ef4444]">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="courier-vehicle"
                                    defaultValue="Motor"
                                    className="h-[42px] w-full appearance-none rounded-[8px] border border-[#e0e3e1] bg-white pr-[40px] pl-[15px] text-[14px] leading-[21px] text-[#181c1c] outline-none focus:border-[#005c55]"
                                >
                                    {VEHICLE_TYPES.map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={20}
                                    className="pointer-events-none absolute top-1/2 right-[11px] -translate-y-1/2 text-[#9ca3af]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="courier-plate" className={LABEL}>
                                Plat Nomor <span className="text-[#ef4444]">*</span>
                            </label>
                            <input id="courier-plate" type="text" placeholder="M 1577 AK" className={FIELD} />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="courier-phone" className={LABEL}>
                                Nomor Telepon <span className="text-[#ef4444]">*</span>
                            </label>
                            <div className="flex h-[43px] w-full items-center gap-[8px] rounded-[8px] border border-[#e0e3e1] bg-white pr-[15px] pl-[17px] focus-within:border-[#005c55]">
                                <Phone size={14} className="shrink-0 text-[#9ca3af]" />
                                <input
                                    id="courier-phone"
                                    type="tel"
                                    placeholder="+62 812-3456-7890"
                                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none"
                                />
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
                            Tambah Courier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
