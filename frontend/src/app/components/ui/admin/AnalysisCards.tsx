import React from 'react';
import { CheckCircle2, TrendingUp } from 'lucide-react';

import { METHOD_SHARES } from '@/components/ui/admin/paymentData';

// Summary card with leading icon (Figma nodes 496:9147 / 466:5960).
function SummaryCard({
    icon,
    label,
    value,
    sub,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub: string;
}) {
    return (
        <div className="flex flex-col gap-[12px] rounded-[12px] border border-[#e2e8f0] bg-white p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-[10px]">
                <span className="flex size-[30px] items-center justify-center rounded-full bg-[#f0fdfa] text-[#0f766e]">
                    {icon}
                </span>
                <span className="text-[14px] leading-[20px] font-medium tracking-[0.7px] uppercase text-[#3e4947]">
                    {label}
                </span>
            </div>
            <span className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">{value}</span>
            <span className="text-[14px] leading-[20px] text-[#6e7977]">{sub}</span>
        </div>
    );
}

// Builds the conic-gradient stops for the method donut, clockwise from 12 o'clock.
function buildDonutGradient(): string {
    let cursor = 0;
    const stops = METHOD_SHARES.map((share) => {
        const start = cursor;
        cursor += share.percent;
        return `${share.color} ${start}% ${cursor}%`;
    });
    return `conic-gradient(${stops.join(', ')})`;
}

// "Method" breakdown card with donut + legend (Figma node 496:9160).
function MethodCard() {
    return (
        <div className="flex flex-col gap-[16px] rounded-[12px] border border-[#e2e8f0] bg-white p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <span className="text-[15px] leading-[22.5px] font-semibold text-[#0f172b]">Method</span>
            <div className="flex items-center justify-between gap-[16px]">
                {/* Donut */}
                <div
                    className="relative flex size-[120px] shrink-0 items-center justify-center rounded-full"
                    style={{ background: buildDonutGradient() }}
                >
                    <div className="flex size-[78px] flex-col items-center justify-center rounded-full bg-white">
                        <span className="text-[9.255px] leading-none text-[#64748b]">Total</span>
                        <span className="text-[18px] leading-tight font-bold text-[#0f172b]">100</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-1 flex-col gap-[8px]">
                    {METHOD_SHARES.map((share) => (
                        <div key={share.method} className="flex items-center gap-[8px]">
                            <span
                                className="size-[8px] shrink-0 rounded-full"
                                style={{ backgroundColor: share.color }}
                            />
                            <span className="flex-1 text-[12px] leading-[16px] text-[#45556c]">{share.method}</span>
                            <span className="text-[12px] leading-[16px] font-semibold text-[#0f172b]">
                                {share.percent}%
                            </span>
                            <span className="w-[20px] text-right text-[12px] leading-[16px] text-[#90a1b9]">
                                {share.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Three analysis cards (Total Paid / Rata-rata / Method) shared by Payments and the branch Performance tab.
export default function AnalysisCards() {
    return (
        <div className="grid grid-cols-[1fr_1fr_1.15fr] gap-[24px]">
            <SummaryCard
                icon={<CheckCircle2 size={18} />}
                label="Total Paid"
                value="Rp 12.0M"
                sub="452 successful transactions"
            />
            <SummaryCard
                icon={<TrendingUp size={18} />}
                label="Rata-rata / Transaksi"
                value="Rp 86.250"
                sub="per invoice rata-rata"
            />
            <MethodCard />
        </div>
    );
}
