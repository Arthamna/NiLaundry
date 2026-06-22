'use client';

import React from 'react';
import InboxItem from './InboxItem';

interface ActivityItem {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    time: string;
    unread?: boolean;
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

            <div className="flex flex-col">
                {items.map((item, i) => (
                    <InboxItem
                        key={item.id}
                        icon={item.icon}
                        title={item.title}
                        subtitle={item.subtitle}
                        time={item.time}
                        unread={item.unread}
                        last={i === items.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
