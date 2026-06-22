'use client';

import React from 'react';
import { CircleX, ChevronDown, ChevronUp } from 'lucide-react';

export interface PaymentVoucher {
    amount: string;
    code: string;
    description: string;
    expiry: string;
}

/** A claimed voucher the customer can apply to this order. */
export interface VoucherOption {
    id: number;
    amount: string;
    code: string;
    description: string;
    expiry: string;
    /** false when the order total is below the voucher's minimum purchase. */
    eligible: boolean;
    /** Shown when not eligible (e.g. "Min. belanja Rp 50.000"). */
    reason?: string;
}

interface PaymentVoucherSectionProps {
    voucher: PaymentVoucher | null;
    appliedId: number | null;
    options: VoucherOption[];
    expanded: boolean;
    onToggle: () => void;
    onApply: (id: number) => void;
    onRemove: () => void;
}

export default function PaymentVoucherSection({
    voucher,
    appliedId,
    options,
    expanded,
    onToggle,
    onApply,
    onRemove,
}: PaymentVoucherSectionProps) {
    return (
        <div className="flex w-full flex-col gap-[20px]">
            {voucher ? (
                <div className="flex w-full items-start overflow-hidden rounded-[12px] border border-[#bdc9c6] p-px">
                    <div className="flex w-[84px] flex-col items-center justify-center self-stretch bg-gradient-to-b from-[#009689] to-[#00786f] px-[7px] py-[10.5px]">
                        <p className="w-full text-[9px] leading-[13.5px] font-normal text-white opacity-80">HEMAT</p>
                        <p className="w-[70px] text-[14px] leading-[21px] font-extrabold text-white">{voucher.amount}</p>
                    </div>
                    <div className="flex min-w-px flex-1 flex-col items-start p-[10.5px]">
                        <div className="flex w-full items-start justify-between">
                            <p className="text-[12.25px] leading-[17.5px] font-extrabold text-[#0f172b]">{voucher.code}</p>
                            <button
                                type="button"
                                onClick={onRemove}
                                aria-label="Remove voucher"
                                className="text-[#f41313] transition-opacity hover:opacity-70"
                            >
                                <CircleX size={24} />
                            </button>
                        </div>
                        <p className="text-[11px] leading-[16.5px] font-normal text-[#45556c]">{voucher.description}</p>
                        <div className="mt-[10.5px] flex w-full items-center justify-between">
                            <p className="text-[10px] leading-[15px] font-normal text-[#62748e]">{voucher.expiry}</p>
                            <span className="rounded-full bg-[#6df5e1] px-[15px] py-[4px] text-[14px] leading-[21px] font-bold text-[#00776a]">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-center text-[15px] leading-[20px] font-medium text-[#bdc9c6]">No Active Voucher.</p>
                    <div className="h-px w-full rounded-[1px] bg-[#bdc9c6]" />
                </>
            )}

            {/* Voucher picker — the list of claimed vouchers with working Apply buttons. */}
            {expanded && (
                <div className="flex w-full flex-col gap-[12px]">
                    {options.length === 0 ? (
                        <p className="text-center text-[14px] leading-5 text-[#62748e]">
                            Belum ada voucher. Tukarkan kode di menu Vouchers.
                        </p>
                    ) : (
                        options.map((opt) => {
                            const isApplied = opt.id === appliedId;
                            return (
                                <div
                                    key={opt.id}
                                    className={`flex w-full items-center justify-between rounded-[12px] border p-[14px] ${
                                        isApplied
                                            ? 'border-[#009689] bg-[rgba(0,150,137,0.06)]'
                                            : 'border-[#bdc9c6] bg-white'
                                    }`}
                                >
                                    <div className="flex min-w-0 flex-col gap-[2px]">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[14px] leading-5 font-bold text-[#0f172b]">{opt.code}</span>
                                            <span className="text-[12px] leading-4 font-semibold text-[#00776a]">
                                                {opt.amount}
                                            </span>
                                        </div>
                                        <span className="truncate text-[11px] leading-4 text-[#45556c]">
                                            {opt.description}
                                        </span>
                                        <span className="text-[10px] leading-[15px] text-[#62748e]">{opt.expiry}</span>
                                        {!opt.eligible && opt.reason && (
                                            <span className="text-[10px] leading-[15px] text-[#ba1a1a]">{opt.reason}</span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onApply(opt.id)}
                                        disabled={!opt.eligible || isApplied}
                                        className="shrink-0 rounded-[8px] bg-[#005c52] px-4 py-2 text-[13px] leading-4 font-semibold text-white transition-colors hover:bg-[#00463e] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isApplied ? 'Applied' : 'Apply'}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            <div className="flex w-full flex-col items-center">
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex flex-col items-center justify-center text-[#bdc9c6] transition-colors hover:text-[#009689]"
                >
                    <span className="text-[15px] leading-[20px] font-medium">
                        {expanded ? 'Hide Vouchers' : 'View All Vouchers'}
                    </span>
                    {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
            </div>
        </div>
    );
}
