'use client';

import React from 'react';

interface VoucherCardProps {
    amount: string;
    code: string;
    description: string;
    expiry: string;
    onApply?: () => void;
}

export default function VoucherCard({ amount, code, description, expiry, onApply }: VoucherCardProps) {
    return (
        <div className="flex w-full items-start overflow-hidden rounded-[12px] border border-[#bdc9c6] p-px">
            <div className="flex w-[84px] flex-col items-center justify-center self-stretch bg-gradient-to-b from-[#009689] to-[#00786f] px-[7px] py-[10.5px]">
                <p className="w-full text-[9px] leading-[13.5px] font-normal text-white opacity-80">HEMAT</p>
                <p className="w-[70px] text-[14px] leading-[21px] font-extrabold text-white">{amount}</p>
            </div>
            <div className="flex min-w-px flex-1 flex-col items-start p-[10.5px]">
                <p className="text-[12.25px] leading-[17.5px] font-extrabold text-[#0f172b]">{code}</p>
                <p className="text-[11px] leading-[16.5px] font-normal text-[#45556c]">{description}</p>
                <div className="mt-[10.5px] flex w-full items-center justify-between">
                    <p className="text-[10px] leading-[15px] font-normal text-[#62748e]">{expiry}</p>
                    {/* Apply only renders when the parent supplies a handler — used
                        vouchers (already applied) and expired ones are display-only. */}
                    {onApply && (
                        <button
                            type="button"
                            onClick={onApply}
                            className="rounded-full bg-[#6df5e1] px-[15px] py-1 text-[14px] leading-[21px] font-bold text-[#00776a] transition-colors hover:bg-[#4ee9d2]"
                        >
                            Apply
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
