'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
    /** Heading, e.g. "Delete Branch". */
    title: string;
    /** Body copy describing what is being removed. */
    message: React.ReactNode;
    confirmLabel?: string;
    loading?: boolean;
    error?: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

// Reusable destructive-action confirmation dialog used across the admin surfaces
// (branch / staff / voucher / courier) in place of window.confirm.
export default function ConfirmDeleteModal({
    title,
    message,
    confirmLabel = 'Delete',
    loading = false,
    error = null,
    onConfirm,
    onCancel,
}: ConfirmDeleteModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Cancel"
                onClick={onCancel}
                disabled={loading}
                className="absolute inset-0 bg-[rgba(24,28,28,0.4)] backdrop-blur-[2px]"
            />

            {/* Dialog */}
            <div
                role="alertdialog"
                aria-modal="true"
                aria-label={title}
                className="relative z-10 w-[420px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[16px] bg-white shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)]"
            >
                <div className="flex items-start gap-[16px] px-[28px] pt-[26px] pb-[8px]">
                    <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#fef2f2] text-[#dc2626]">
                        <AlertTriangle size={22} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col pt-[2px]">
                        <h2 className="text-[18px] leading-[26px] font-bold text-[#181c1c]">{title}</h2>
                        <p className="pt-[4px] text-[14px] leading-[21px] text-[#6e7977]">{message}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        aria-label="Close"
                        className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#f1f4f3] text-[#3e4947] transition-colors hover:bg-[#e5e9e7] disabled:opacity-50"
                    >
                        <X size={14} />
                    </button>
                </div>

                {error && <p className="px-[28px] pt-[4px] text-[13px] text-[#b91c1c]">{error}</p>}

                <div className="flex items-center justify-end gap-[10px] px-[28px] pt-[16px] pb-[24px]">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-[8px] border border-[#bdc9c6] bg-white px-[21px] py-[11px] text-[14px] leading-[21px] font-semibold text-[#3e4947] transition-colors hover:bg-[#f1f4f3] disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-[8px] bg-[#dc2626] px-[20px] py-[11px] text-[14px] leading-[21px] font-semibold text-white transition-colors hover:bg-[#b91c1c] disabled:opacity-60"
                    >
                        {loading ? 'Deleting…' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
