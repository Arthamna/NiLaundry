import React from 'react';

export interface OrderServiceLine {
    service: string;
    quantity: string;
    subtotal: string;
}

export interface CourierLine {
    label: string;
    subtotal: string;
}

interface OrderSummaryCardProps {
    services: OrderServiceLine[];
    couriers: CourierLine[];
    total: string;
}

const Divider = () => <div className="h-px w-full rounded-[1px] bg-[#bdc9c6]" />;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[10px] text-[14px] leading-[17.5px] font-normal text-[#0f172b]">
                <span>{label}</span>
                <span>:</span>
            </div>
            <div className="flex items-center gap-[4px] text-[14px] leading-[16.5px] font-normal text-[#62748e]">
                {children}
            </div>
        </div>
    );
}

function ServiceRow({ line }: { line: OrderServiceLine }) {
    return (
        <div className="flex w-full items-end justify-between">
            <div className="flex flex-col justify-center gap-[8px]">
                <div className="flex items-center gap-[12px]">
                    <div className="flex items-center gap-[10px] text-[14px] leading-[17.5px] font-normal text-[#0f172b]">
                        <span>Service</span>
                        <span>:</span>
                    </div>
                    <span className="text-[14px] leading-[16.5px] font-normal text-[#62748e]">{line.service}</span>
                </div>
                <div className="flex h-[28px] w-[191px] items-center gap-[12px]">
                    <div className="flex items-center gap-[10px] text-[14px] leading-[17.5px] font-normal text-[#0f172b]">
                        <span>Quantity</span>
                        <span>:</span>
                    </div>
                    <span className="text-[14px] leading-[16.5px] font-normal text-[#62748e]">{line.quantity}</span>
                </div>
            </div>
            <Field label="Subtotal">{line.subtotal}</Field>
        </div>
    );
}

function CourierRow({ line }: { line: CourierLine }) {
    return (
        <div className="flex w-full items-end justify-between">
            <div className="flex h-[28px] items-center">
                <p className="text-[14px] leading-[17.5px] font-normal text-[#0f172b]">{line.label}</p>
            </div>
            <Field label="Subtotal">{line.subtotal}</Field>
        </div>
    );
}

export default function OrderSummaryCard({ services, couriers, total }: OrderSummaryCardProps) {
    return (
        <div className="flex w-full flex-col gap-[10px] rounded-[12.75px] border-2 border-[#bdc9c6] bg-white p-[12.5px]">
            {services.map((line, i) => (
                <React.Fragment key={i}>
                    <ServiceRow line={line} />
                    <Divider />
                </React.Fragment>
            ))}

            {couriers.map((line, i) => (
                <CourierRow key={i} line={line} />
            ))}

            <div className="h-[2px] w-full rounded-[1px] bg-[#3e4947]" />

            <div className="flex w-full items-start justify-between text-[20px] leading-[38px] tracking-[-0.6px] text-[#005c55]">
                <p className="font-medium">Total :</p>
                <p className="font-normal">{total}</p>
            </div>
        </div>
    );
}
