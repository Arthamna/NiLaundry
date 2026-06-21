import React from 'react';
import { Check } from 'lucide-react';

interface MethodSegment {
    label: string;
    color: string;
    percent: number;
    count: number;
}

const SEGMENTS: MethodSegment[] = [
    { label: 'QRIS', color: '#0f766e', percent: 58, count: 58 },
    { label: 'BANK', color: '#ffb900', percent: 16, count: 16 },
    { label: 'GOPAY', color: '#0ea5e9', percent: 18, count: 18 },
    { label: 'OVO', color: '#a855f7', percent: 8, count: 8 },
];

// Build the donut's conic-gradient stops from the segment percentages.
const DONUT_GRADIENT = (() => {
    let acc = 0;
    const stops = SEGMENTS.map((s) => {
        const start = acc;
        acc += s.percent;
        return `${s.color} ${start}% ${acc}%`;
    });
    return `conic-gradient(${stops.join(', ')})`;
})();

export default function ReportSummaryCards() {
    return (
        <div className="grid h-[180px] w-full grid-cols-2 gap-x-4">
            {/* Total Paid */}
            <div className="flex flex-col overflow-clip rounded-[12px] border border-[#e2e8f0] bg-white p-[25px]">
                <div className="flex items-center gap-2 pb-4">
                    <span className="flex h-8 w-[30px] items-center justify-center rounded-full bg-[rgba(109,245,225,0.3)]">
                        <Check size={12} className="text-[#0f766e]" />
                    </span>
                    <span className="text-[14px] leading-5 font-medium tracking-[0.7px] text-[#3e4947] uppercase">
                        Total Paid
                    </span>
                </div>
                <p className="pb-1 text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                    Rp 12.0M
                </p>
                <p className="text-[14px] leading-5 text-[#6e7977]">452 successful transactions</p>
            </div>

            {/* Method breakdown */}
            <div className="flex flex-col rounded-[12.75px] border border-[#e2e8f0] bg-white p-px drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
                <div className="flex h-[31px] items-center border-b border-[#e2e8f0] px-4">
                    <h3 className="text-[15px] leading-[22.5px] font-semibold text-[#0f172b]">Method</h3>
                </div>
                <div className="flex flex-1 items-center gap-3 p-3">
                    <div className="relative size-[101px] shrink-0">
                        <div className="size-full rounded-full" style={{ background: DONUT_GRADIENT }} />
                        <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-white">
                            <span className="text-[9px] leading-none text-[#64748b]">Total</span>
                            <span className="text-[13px] leading-tight font-bold text-[#0f172a]">100</span>
                        </div>
                    </div>
                    <ul className="flex flex-1 flex-col gap-1">
                        {SEGMENTS.map((s) => (
                            <li key={s.label} className="flex items-center gap-1.5">
                                <span
                                    className="size-[7px] shrink-0 rounded-[3px]"
                                    style={{ backgroundColor: s.color }}
                                />
                                <span className="flex-1 text-[11px] leading-4 text-[#45556c]">{s.label}</span>
                                <span className="text-[11px] leading-4 font-semibold text-[#0f172b]">
                                    {s.percent}%
                                </span>
                                <span className="text-[11px] leading-4 text-[#90a1b9]">· {s.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
