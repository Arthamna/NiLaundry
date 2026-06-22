import React from 'react';
import Link from 'next/link';

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
    const subtitle = rows.length > 0 ? rows.map((r) => r.label).join(' · ') : 'No transactions yet';
    return (
        <div className="flex flex-1 flex-col self-stretch rounded-[12.75px] border border-[#e2e8f0] bg-white p-px drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            {/* Header */}
            <div className="flex w-full items-center justify-between border-b border-[#e2e8f0] px-[17.5px] pt-[14px] pb-[15px]">
                <div className="flex min-w-0 flex-col">
                    <h3 className="text-[15px] leading-[22.5px] font-semibold text-[#0f172b]">Payment Mix Today</h3>
                    <p className="truncate pt-[1.75px] text-[10.5px] leading-[14px] text-[#62748e]">{subtitle}</p>
                </div>
                <Link
                    href="/admin/payments"
                    className="shrink-0 text-[10.5px] leading-[14px] font-medium text-[#00786f] hover:underline"
                >
                    View all
                </Link>
            </div>

            {/* 2x2 tiles */}
            <div className="grid grid-cols-2 gap-[12px] px-[18px] py-[14px]">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="flex flex-col gap-[6px] rounded-[8.75px] border border-[#e2e8f0] p-[12px]"
                    >
                        <div className="flex items-center gap-[7px]">
                            <span
                                className="size-[8px] shrink-0 rounded-full"
                                style={{ backgroundColor: row.color }}
                            />
                            <p className="truncate text-[11.5px] leading-[15px] font-medium text-[#475569]">
                                {row.label}
                            </p>
                        </div>
                        <div className="flex items-baseline gap-[5px]">
                            <p className="text-[20px] leading-[26px] font-bold text-[#0f172b]">{row.amount}</p>
                            <span className="text-[10.5px] leading-[14px] text-[#62748e]">transactions</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
