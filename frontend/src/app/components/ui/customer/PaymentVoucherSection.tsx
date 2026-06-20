'use client';

import React from 'react';
import { CircleX, ChevronDown, ChevronUp } from 'lucide-react';

export interface PaymentVoucher {
    amount: string;
    code: string;
    description: string;
    expiry: string;
}

interface PaymentVoucherSectionProps {
    voucher: PaymentVoucher | null;
    expanded: boolean;
    onToggle: () => void;
    onRemove: () => void;
}

export default function PaymentVoucherSection({ voucher, expanded, onToggle, onRemove }: PaymentVoucherSectionProps) {
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
