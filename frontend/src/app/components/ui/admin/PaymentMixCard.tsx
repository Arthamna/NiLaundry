import React from 'react';

export interface PaymentMixRow {
    label: string;
    amount: string;
    /** Accent bar color (exact Figma hex). */
    color: string;
}

interface PaymentMixCardProps {
    rows: PaymentMixRow[];
}

// Payment Mix Today card (Figma node 120:4940). 2x2 grid of method tiles.
export default function PaymentMixCard({ rows }: PaymentMixCardProps) {
    return (
        <div className="flex flex-1 flex-col self-stretch rounded-[12.75px] border border-[#e2e8f0] bg-white p-px drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            {/* Header */}
            <div className="flex w-full items-center justify-between border-b border-[#e2e8f0] px-[17.5px] pt-[14px] pb-[15px]">
                <div className="flex flex-col">
                    <h3 className="text-[15px] leading-[22.5px] font-semibold text-[#0f172b]">Payment Mix Today</h3>
                    <p className="pt-[1.75px] text-[10.5px] leading-[14px] text-[#62748e]">QRIS · Bank · Gopay · OVO</p>
                </div>
                <button type="button" className="text-[10.5px] leading-[14px] font-medium text-[#00786f]">
                    View all →
                </button>
            </div>

            {/* 2x2 tiles */}
            <div className="grid grid-cols-2 gap-[12px] px-[18px] py-[14px]">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="flex flex-col items-start rounded-[8.75px] border border-[#e2e8f0] p-[11.5px]"
                    >
                        <div className="h-[21px] w-full">
                            <div
                                className="mt-[3.75px] h-[5.25px] w-[28px] rounded-full"
                                style={{ backgroundColor: row.color }}
                            />
                        </div>
                        <p className="text-[10.5px] leading-[14px] text-[#62748e]">{row.label}</p>
                        <p className="text-[14px] leading-[21px] font-bold text-[#0f172b]">{row.amount}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
