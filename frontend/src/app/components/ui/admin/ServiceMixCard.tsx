import React from 'react';

export interface ServiceMixRow {
    label: string;
    percent: number;
    /** Bar fill color (exact Figma hex). */
    color: string;
}

interface ServiceMixCardProps {
    rows: ServiceMixRow[];
}

// Service Mix distribution card (Figma node 267:3587).
export default function ServiceMixCard({ rows }: ServiceMixCardProps) {
    return (
        <div className="flex w-[740px] shrink-0 flex-col rounded-[12.75px] border border-[#e2e8f0] bg-white p-px drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            {/* Header */}
            <div className="flex w-full items-start justify-between border-b border-[#e2e8f0] px-[17.5px] pt-[14px] pb-[15px]">
                <div className="flex flex-col">
                    <h3 className="text-[15px] leading-[22.5px] font-semibold text-[#0f172b]">Service Mix</h3>
                    <p className="pt-[1.75px] text-[10.5px] leading-[14px] text-[#62748e]">Distribusi 30 hari</p>
                </div>
                <button type="button" className="text-[10.5px] leading-[14px] font-medium text-[#00786f]">
                    Detail
                </button>
            </div>

            {/* Bars */}
            <div className="flex flex-col gap-[10.5px] px-[17.5px] py-[14px]">
                {rows.map((row) => (
                    <div key={row.label} className="flex w-full flex-col">
                        <div className="flex w-full items-center justify-between">
                            <span className="text-[10.5px] leading-[14px] text-[#314158]">{row.label}</span>
                            <span className="text-[10.5px] leading-[14px] font-semibold text-[#0f172b]">
                                {row.percent}%
                            </span>
                        </div>
                        <div className="mt-[3.5px] h-[5.25px] w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                            <div
                                className="h-full rounded-full"
                                style={{ width: `${row.percent}%`, backgroundColor: row.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
