import React from 'react';

interface StatCard {
    label: string;
    value: string;
    valueColor: string;
}

export interface OrdersStatCardsProps {
    total: number;
    pickup: number;
    processing: number;
    delivery: number;
    completed: number;
}

export default function OrdersStatCards({
    total,
    pickup,
    processing,
    delivery,
    completed,
}: OrdersStatCardsProps) {
    const cards: StatCard[] = [
        { label: 'Total Orders', value: String(total), valueColor: 'text-[#181c1c]' },
        { label: 'Pickup', value: String(pickup), valueColor: 'text-[#0f172b]' },
        { label: 'Processing', value: String(processing), valueColor: 'text-[#0f172b]' },
        { label: 'Delivery', value: String(delivery), valueColor: 'text-[#0f172b]' },
        { label: 'Completed', value: String(completed), valueColor: 'text-[#0f172b]' },
    ];

    return (
        <div className="grid w-full grid-cols-5 gap-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="flex flex-col items-start gap-1 self-start rounded-[12px] border border-[#bdc9c6] bg-white p-[17px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                >
                    <p className="w-full text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947]">
                        {card.label}
                    </p>
                    <p className={`w-full text-[36px] leading-[44px] font-bold tracking-[-0.72px] ${card.valueColor}`}>
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
