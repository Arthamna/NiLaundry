import React from 'react';

export interface TopServiceBar {
    label: string;
    orders: number;
}

interface TopServicesChartProps {
    bars: TopServiceBar[];
}

const CHART_HEIGHT = 200; // px of plot area the tallest bar fills

// Top Services bar chart card (Figma node 120:8117). Pure-CSS bars — no chart lib.
export default function TopServicesChart({ bars }: TopServicesChartProps) {
    const maxOrders = Math.max(...bars.map((b) => b.orders), 1);

    return (
        <div className="flex w-full flex-col rounded-[12.75px] border border-[#e2e8f0] bg-white p-px drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            {/* Header */}
            <div className="flex w-full items-start justify-between border-b border-[#e2e8f0] px-[17.5px] pt-[14px] pb-[15px]">
                <div className="flex flex-col">
                    <h3 className="text-[15px] leading-[22.5px] font-semibold text-[#0f172b]">Top Services</h3>
                    <p className="pt-[1.75px] text-[10.5px] leading-[14px] text-[#62748e]">Ranking · 30 days</p>
                </div>
            </div>

            {/* Plot */}
            <div className="w-full px-[10.5px] pt-[10.5px] pb-[7px]">
                <div className="relative h-[220px] w-full">
                    {/* Dashed gridlines */}
                    {[0, 25, 50, 75, 100].map((top) => (
                        <div
                            key={top}
                            className="absolute right-0 left-0 border-t border-dashed border-[#e2e8f0]"
                            style={{ top: `${top}%` }}
                        />
                    ))}

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-around">
                        {bars.map((bar) => (
                            <div key={bar.label} className="flex w-[88px] flex-col items-center">
                                <div
                                    className="w-full rounded-t-[2px] bg-[#0f766e]"
                                    style={{ height: `${(bar.orders / maxOrders) * CHART_HEIGHT}px` }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Labels */}
                <div className="flex justify-around pt-[6px]">
                    {bars.map((bar) => (
                        <span
                            key={bar.label}
                            className="w-[88px] text-center text-[10.167px] leading-none text-[#64748b]"
                        >
                            {bar.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
