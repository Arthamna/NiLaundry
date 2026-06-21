'use client';

import React from 'react';

type StepStatus = 'done' | 'active' | 'pending';

interface Step {
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    status: StepStatus;
}

interface OrderProgressProps {
    orderId: string;
    estimatedTime: string;
    statusLabel: string;
    steps: Step[];
    /** Fraction of the track filled (0-1). Defaults to 2/3. */
    progress?: number;
}

function StepNode({ step }: { step: Step }) {
    const circle: Record<StepStatus, string> = {
        done: 'bg-[#005c55] text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]',
        active: 'border-2 border-[#005c55] bg-white text-[#005c55] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]',
        pending: 'bg-[#e5e9e7] text-[#6e7977]',
    };
    const labelColor = step.status === 'pending' ? 'text-[#6e7977]' : 'text-[#005c55]';
    const sublabelStyle =
        step.status === 'active' ? 'font-bold text-[#005c55]' : 'font-normal text-[#6e7977]';

    return (
        <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`flex size-10 items-center justify-center rounded-full ${circle[step.status]}`}>
                {step.icon}
            </div>
            <p className={`text-[15px] leading-5 font-medium ${labelColor}`}>{step.label}</p>
            <p className={`text-[11px] leading-[15px] ${sublabelStyle}`}>{step.sublabel}</p>
        </div>
    );
}

export default function OrderProgress({ orderId, estimatedTime, statusLabel, steps, progress = 1 }: OrderProgressProps) {
    return (
        <div className="overflow-hidden rounded-[12px] border border-[#bdc9c6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-[#bdc9c6] px-6 pt-6 pb-[25px]">
                <div>
                    <h3 className="text-[21px] leading-7 font-semibold text-[#181c1c]">Current Order Progress</h3>
                    <p className="text-[15px] leading-5 text-[#6e7977]">
                        Order #{orderId} • Estimated: {estimatedTime}
                    </p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-[#6df5e1] px-4 py-1 text-[13px] leading-4 font-semibold tracking-[0.6px] text-[#006f64]">
                    {statusLabel}
                </span>
            </div>

            <div className="p-8">
                <div className="relative flex justify-between">
                    {/* Track line, centered on the 40px nodes */}
                    <div className="absolute left-5 right-5 top-5 h-1 bg-[#e5e9e7]">
                        <div className="absolute inset-y-0 left-0 bg-[#005c55]" style={{ width: `${progress * 100}%` }} />
                    </div>
                    {steps.map((step, i) => (
                        <StepNode key={i} step={step} />
                    ))}
                </div>
            </div>
        </div>
    );
}
