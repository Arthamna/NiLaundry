'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Pencil, Trash2, ChevronDown } from 'lucide-react';

import { Courier, VEHICLE_TYPES } from '@/components/ui/admin/courierData';

interface EditCourierModalProps {
    courier: Courier;
}

const ROW = 'flex items-center gap-[12px]';
const ROW_LABEL =
    'flex w-[120px] shrink-0 items-center justify-between text-[14px] leading-[17.5px] text-[#0f172b]';
const ROW_INPUT =
    'h-[22px] min-w-0 max-w-[270px] flex-1 rounded-[4px] border border-[#bdc9c6] px-[8px] py-[2px] text-[14px] leading-[17.5px] text-[#62748e] outline-none focus:border-[#005c55]';

// A label + editable text field row (input + pencil affordance).
function FieldRow({ label, defaultValue }: { label: string; defaultValue: string }) {
    return (
        <div className={ROW}>
            <div className={ROW_LABEL}>
                <span>{label}</span>
                <span>:</span>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-[10px]">
                <input defaultValue={defaultValue} className={ROW_INPUT} />
                <Pencil size={16} className="shrink-0 text-[#6e7977]" />
            </div>
        </div>
    );
}

// Courier detail / edit modal (Figma node 466:4356).
export default function EditCourierModal({ courier }: EditCourierModalProps) {
    const router = useRouter();

    function close() {
        router.push('/admin/couriers');
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
                aria-label="Edit Courier"
                className="relative z-10 w-[480px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[16px] bg-white shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)]"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e0e3e1] px-[28px] pt-[24px] pb-[21px]">
                    <h2 className="text-[18px] leading-[26px] font-bold text-[#181c1c]">Edit Courier</h2>
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Tutup"
                        className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#f1f4f3] text-[#3e4947] transition-colors hover:bg-[#e5e9e7]"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-[20px] px-[28px] pt-[24px] pb-[8px]">
                    <FieldRow label="Nama Lengkap" defaultValue={courier.name} />

                    {/* Jenis Kendaraan — dropdown row */}
                    <div className={ROW}>
                        <div className={ROW_LABEL}>
                            <span>Jenis Kendaraan</span>
                            <span>:</span>
                        </div>
                        <div className="relative flex min-w-0 max-w-[270px] flex-1 items-center">
                            <select
                                defaultValue={courier.vehicleType}
                                className="h-[22px] w-full appearance-none rounded-[4px] border border-[#bdc9c6] py-[2px] pr-[24px] pl-[8px] text-[14px] leading-[17.5px] text-[#62748e] outline-none focus:border-[#005c55]"
                            >
                                {VEHICLE_TYPES.map((v) => (
                                    <option key={v} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-[4px] text-[#6e7977]"
                            />
                        </div>
                    </div>

                    <FieldRow label="Plat Nomor" defaultValue={courier.plate} />
                    <FieldRow label="Nomor Telepon" defaultValue={courier.phone} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-[28px] pt-[16px] pb-[24px]">
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Hapus courier"
                        className="flex h-[40px] items-center justify-center rounded-[6.75px] border border-[#f41313] px-[10px] py-[8px] text-[#f41313] transition-colors hover:bg-[#fef2f2]"
                    >
                        <Trash2 size={20} />
                    </button>
                    <div className="flex items-center gap-[10px]">
                        <button
                            type="button"
                            onClick={close}
                            className="rounded-[8px] border border-[#bdc9c6] bg-white px-[21px] py-[11px] text-[14px] leading-[21px] font-semibold text-[#3e4947] transition-colors hover:bg-[#f1f4f3]"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={close}
                            className="rounded-[8px] bg-[#005c55] px-[20px] py-[10px] text-[14px] leading-[21px] font-semibold text-white transition-colors hover:bg-[#00514b]"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
