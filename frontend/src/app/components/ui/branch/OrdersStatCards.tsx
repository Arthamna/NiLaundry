import React from 'react';

interface StatCard {
    label: string;
    value: string;
    valueColor: string;
}

const CARDS: StatCard[] = [
    { label: 'Total Orders', value: '142', valueColor: 'text-[#181c1c]' },
    { label: 'Pickup', value: '24', valueColor: 'text-[#0f172b]' },
    { label: 'Processing', value: '38', valueColor: 'text-[#0f172b]' },
    { label: 'Delivery', value: '24', valueColor: 'text-[#0f172b]' },
    { label: 'Completed', value: '24', valueColor: 'text-[#0f172b]' },
];

export default function OrdersStatCards() {
    return (
        <div className="grid w-full grid-cols-5 gap-4">
            {CARDS.map((card) => (
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
