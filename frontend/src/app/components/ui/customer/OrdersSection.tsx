'use client';

import React from 'react';

interface OrdersSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function OrdersSection({ title, children }: OrdersSectionProps) {
    return (
        <div className="flex w-full flex-col rounded-[12.75px] border border-[#bdc9c6] bg-white p-[11.5px]">
            <div className="flex items-center justify-between">
                <p className="text-[12.25px] leading-[17.5px] font-bold text-[#0f172b]">{title}</p>
            </div>
            <div className="flex flex-col">
                {React.Children.map(children, (child) => (
                    <div className="pt-[7px]">{child}</div>
                ))}
            </div>
        </div>
    );
}
