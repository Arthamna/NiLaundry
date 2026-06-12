'use client';

import React from 'react';

interface FilterTabsProps {
    tabs: string[];
    active: string;
    onChange: (tab: string) => void;
}

export default function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
    return (
        <div className="flex h-[40px] items-start gap-[5.25px]">
            {tabs.map((tab) => {
                const isActive = tab === active;
                return (
                    <button
                        key={tab}
                        onClick={() => onChange(tab)}
                        className={`flex h-full items-center justify-center rounded-full px-[24px] py-1 text-[11px] leading-[16.5px] font-normal ${
                            isActive
                                ? 'bg-[#009689] text-white'
                                : 'border border-[#bdc9c6] bg-white text-[#45556c]'
                        }`}
                    >
                        {tab}
                    </button>
                );
            })}
        </div>
    );
}
