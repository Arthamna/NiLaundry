import React from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export interface TopBranchRow {
    initials: string;
    name: string;
    percentOfTarget: number;
    revenue: string;
}

interface TopBranchesCardProps {
    rows: TopBranchRow[];
}

// Top Branches card (Figma node, right column of the third row).
export default function TopBranchesCard({ rows }: TopBranchesCardProps) {
    return (
        <div className="flex flex-1 flex-col self-start rounded-[12.75px] border border-[#e2e8f0] bg-white p-px drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            {/* Header */}
            <div className="flex w-full items-center justify-between border-b border-[#e2e8f0] px-[17.5px] pt-[14px] pb-[15px]">
                <div className="flex flex-col">
                    <h3 className="text-[15px] leading-[22.5px] font-semibold text-[#0f172b]">Top Branches</h3>
                    <p className="pt-[1.75px] text-[10.5px] leading-[14px] text-[#62748e]">Revenue this week</p>
                </div>
                <Link
                    href="/admin/branches"
                    className="shrink-0 text-[10.5px] leading-[14px] font-medium text-[#00786f] hover:underline"
                >
                    View all
                </Link>
            </div>

            {/* List */}
            <div className="flex flex-col px-[17.5px] py-[14px]">
                {rows.map((row, i) => (
                    <div key={`${row.name}-${i}`} className="flex items-center gap-3 py-[8px]">
                        <div className="flex size-[28px] shrink-0 items-center justify-center rounded-[8px] bg-[#f0fdfa] text-[11px] font-semibold text-[#0f766e]">
                            {row.initials}
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <p className="text-[14px] leading-[20px] font-medium text-[#0f172b]">{row.name}</p>
                            <span className="flex items-center gap-1 text-[10.5px] leading-[14px] text-[#62748e]">
                                <TrendingUp size={11} className="text-[#00a63e]" />
                                {row.percentOfTarget}% of target
                            </span>
                        </div>
                        <p className="ml-auto text-[14px] leading-[20px] font-semibold text-[#0f172b]">{row.revenue}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
