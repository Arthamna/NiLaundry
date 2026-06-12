'use client';

import React from 'react';

export type StepState = 'done' | 'current' | 'pending';

export interface TimelineStep {
    title: string;
    time: string;
    state: StepState;
}

const DOT: Record<StepState, string> = {
    done: 'bg-[#009689]',
    current: 'bg-[#fe9a00] shadow-[0px_0px_0px_0px_#fef3c6]',
    pending: 'bg-[#cad5e2]',
};

function Step({ step, last }: { step: TimelineStep; last: boolean }) {
    const lineColor = step.state === 'done' ? 'bg-[#46ecd5]' : 'bg-[#e2e8f0]';
    const titleClass = step.state === 'current' ? 'font-semibold text-[#0f172b]' : 'font-medium text-[#314158]';

    return (
        <div className="flex items-stretch gap-[7px]">
            <div className="flex flex-col items-center">
                <div className={`size-[8.75px] shrink-0 rounded-full ${DOT[step.state]}`} />
                {!last && <div className={`w-px flex-1 ${lineColor}`} />}
            </div>
            <div className="flex flex-col items-start pb-[7px]">
                <p className={`text-[10.5px] leading-[14px] ${titleClass}`}>{step.title}</p>
                <p className="text-[10px] leading-[13.333px] font-normal text-[#62748e]">{step.time}</p>
            </div>
        </div>
    );
}

interface OrderTimelineProps {
    orderId: string;
    service: string;
    status: string;
    steps: TimelineStep[];
}

export default function OrderTimeline({ orderId, service, status, steps }: OrderTimelineProps) {
    return (
        <div className="flex w-full flex-col rounded-[12.75px] border border-[#bdc9c6] bg-white p-[11.5px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                    <p className="text-[11px] leading-[16.5px] font-normal text-[#62748e]">{orderId}</p>
                    <p className="text-[12.25px] leading-[17.5px] font-bold text-[#0f172b]">{service}</p>
                </div>
                <div className="flex items-center gap-[5.25px] rounded-full bg-[#faf5ff] px-[7px] py-[1.75px]">
                    <span className="size-[5.25px] rounded-full bg-[#ad46ff]" />
                    <p className="text-[10.5px] leading-[14px] font-normal text-[#8200db]">{status}</p>
                </div>
            </div>

            <div className="flex flex-col pt-[10.5px]">
                {steps.map((s, i) => (
                    <Step key={i} step={s} last={i === steps.length - 1} />
                ))}
            </div>
        </div>
    );
}
