import React from 'react';
import { Ticket } from 'lucide-react';

export interface VoucherCardData {
    code: string;
    description: string;
    /** Display value, e.g. "20%", "Free Ship", "Rp 50k". */
    value: string;
    maxLabel: string;
    quotaUsed: number;
    quotaTotal: number;
    expires: string;
    status: 'active' | 'expired';
}

// Threshold above which the quota bar turns red (near/at capacity).
const QUOTA_DANGER_RATIO = 0.9;

// Voucher "ticket" card (Figma node 120:7309). Gradient header, dashed divider
// with side notches, value block, quota bar, footer.
export default function VoucherCard({ voucher }: { voucher: VoucherCardData }) {
    const isExpired = voucher.status === 'expired';
    const ratio = voucher.quotaTotal > 0 ? voucher.quotaUsed / voucher.quotaTotal : 0;
    const barColor = ratio >= QUOTA_DANGER_RATIO ? '#ff2056' : '#00bba7';

    const headerGradient = isExpired
        ? 'bg-gradient-to-r from-[#94a3b8] to-[#64748b]'
        : 'bg-gradient-to-r from-[#009689] to-[#00786f]';
    const badgeStyle = isExpired ? 'bg-[#f1f5f9] text-[#64748b]' : 'bg-[#ecfdf5] text-[#007a55]';
    const valueColor = isExpired ? 'text-[#64748b]' : 'text-[#00786f]';

    return (
        <div className="relative flex flex-col overflow-hidden rounded-[12.75px] border border-[#e2e8f0] bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className={`flex items-center justify-between px-[14px] py-[8.75px] ${headerGradient}`}>
                <div className="flex items-center gap-[7px]">
                    <Ticket size={14} className="text-white" />
                    <span className="text-[11px] leading-[16.5px] tracking-[0.55px] text-white uppercase opacity-90">
                        Voucher
                    </span>
                </div>
                <span className={`rounded-full px-[7px] py-[1.75px] text-[10.5px] leading-[14px] ${badgeStyle}`}>
                    {isExpired ? 'Expired' : 'Active'}
                </span>
            </div>

            {/* Top body with dashed divider + notches */}
            <div className="relative border-b border-dashed border-[#e2e8f0] px-[14px] pt-[14px] pb-[15px]">
                <p className="text-[20px] leading-[30px] font-extrabold tracking-[0.8px] text-[#0f172b]">
                    {voucher.code}
                </p>
                <p className="pt-[3.5px] text-[12.25px] leading-[17.5px] text-[#45556c]">{voucher.description}</p>
                <div className="flex items-end gap-2 pt-[10.5px]">
                    <span className={`text-[28px] leading-[42px] font-extrabold tracking-[-0.56px] ${valueColor}`}>
                        {voucher.value}
                    </span>
                    <span className="pb-[7px] text-[10.5px] leading-[14px] text-[#62748e]">{voucher.maxLabel}</span>
                </div>
                <div className="absolute -bottom-[7px] -left-[7px] size-[14px] rounded-full bg-[#f8fafc]" />
                <div className="absolute -right-[7px] -bottom-[7px] size-[14px] rounded-full bg-[#f8fafc]" />
            </div>

            {/* Bottom body */}
            <div className="px-[14px] py-[10.5px]">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] leading-[16.5px] text-[#62748e]">Quota</span>
                    <span className="text-[11px] leading-[16.5px] font-semibold text-[#0f172b]">
                        {voucher.quotaUsed}
                        <span className="font-normal text-[#62748e]">{` / ${voucher.quotaTotal}`}</span>
                    </span>
                </div>
                <div className="mt-[3.5px] h-[5.25px] w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                    <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(100, ratio * 100)}%`, backgroundColor: barColor }}
                    />
                </div>
                <div className="flex items-center justify-between pt-[10.5px]">
                    <span className="text-[11px] leading-[16.5px] text-[#62748e]">Expires {voucher.expires}</span>
                    <button type="button" className="text-[14px] leading-[21px] font-semibold text-[#00786f]">
                        Details →
                    </button>
                </div>
            </div>
        </div>
    );
}
