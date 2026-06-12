'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ActivityItem {
    id: string;
    message: React.ReactNode;
    timestamp: string;
    isActive?: boolean;
}

interface RecentActivityProps {
    items: ActivityItem[];
    onViewAll?: () => void;
}

export default function RecentActivity({ items, onViewAll }: RecentActivityProps) {
    return (
        <div className="flex flex-col gap-4 rounded-[12px] border border-[#bdc9c6] bg-white p-[25px]">
            <div className="flex items-center justify-between">
                <h3 className="text-[21px] leading-7 font-semibold text-[#181c1c]">Recent Activity</h3>
                <button
                    onClick={onViewAll}
                    className="text-[15px] leading-5 font-medium text-[#005c55]"
                    aria-label="View All Activity"
                >
                    View All
                </button>
            </div>

            <div className="flex flex-col gap-1">
                {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 rounded-lg p-4">
                        <div className="w-2 shrink-0 pt-2">
                            {item.isActive && <div className="size-2 rounded-full bg-[#005c55]" />}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <p className="text-[17px] leading-6 text-[#181c1c]">{item.message}</p>
                            <p className="text-[15px] leading-5 text-[#6e7977]">{item.timestamp}</p>
                        </div>
                        <ChevronRight size={16} className="mt-1 shrink-0 text-[#6e7977]" />
                    </div>
                ))}
            </div>
        </div>
    );
}
