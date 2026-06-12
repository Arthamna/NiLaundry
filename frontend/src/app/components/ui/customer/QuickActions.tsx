'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface QuickActionsProps {
    onPlaceOrder?: () => void;
}

export default function QuickActions({ onPlaceOrder }: QuickActionsProps) {
    return (
        <div className="relative overflow-hidden rounded-[12px] bg-[#005c55] p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
            <div className="absolute -bottom-10 -right-10 size-40 rounded-full bg-white/10 blur-[32px]" />
            <div className="relative flex flex-col gap-1">
                <h3 className="text-[21px] leading-7 font-semibold text-white">New Laundry?</h3>
                <p className="pb-5 text-[15px] leading-5 text-white/80">
                    Schedule a pickup and let us handle the rest. We come to you!
                </p>
                <button
                    onClick={onPlaceOrder}
                    className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-white py-4 text-[15px] leading-5 font-medium text-[#005c55] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
                    aria-label="Place New Order"
                >
                    <Plus size={20} /> Place New Order
                </button>
            </div>
        </div>
    );
}
