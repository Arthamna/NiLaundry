import React from 'react';
import { Star } from 'lucide-react';
import { AVATAR_TONES, AvatarTone } from '@/components/ui/branch/avatarTones';

export interface ReviewRow {
    id: string;
    initials: string;
    avatarTone: AvatarTone;
    customerName: string;
    orderId: string;
    rating: number;
    text: string;
    date: string;
}

// Exact Figma rating-pill fills (node 347:3945): high (#0f766e), mid (#14b8a6), low (#f97316).
function ratingPill(rating: number): string {
    if (rating >= 4.5) return 'bg-[rgba(15,118,110,0.09)] text-[#0f766e]';
    if (rating >= 3.5) return 'bg-[rgba(20,184,166,0.09)] text-[#14b8a6]';
    return 'bg-[rgba(249,115,22,0.09)] text-[#f97316]';
}

export default function RecentReviewsTable({ rows }: { rows: ReviewRow[] }) {
    return (
        <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            {/* Card header */}
            <div className="flex w-full items-center justify-between border-b border-[#e0e3e1] bg-white px-6 pt-6 pb-[21px]">
                <h3 className="text-[20px] leading-7 font-semibold text-[#181c1c]">Recent Reviews</h3>
                <button
                    type="button"
                    className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#005c55] hover:underline"
                    onClick={() => {window.location.href = '/branch/reviews'}}>
                    View All
                </button>
            </div>

            {/* Review cards */}
            <div className="flex w-full">
                {rows.map((row, index) => (
                    <div
                        key={row.id}
                        className={`flex flex-1 flex-col gap-3 pt-5 pr-[21px] pb-5 pl-5 ${
                            index < rows.length - 1 ? 'border-r border-[#e0e3e1]' : ''
                        }`}
                    >
                        {/* Top: avatar + name/order | rating pill + date */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-[10px]">
                                <div
                                    className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] leading-[18px] font-semibold ${AVATAR_TONES[row.avatarTone]}`}
                                >
                                    {row.initials}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] leading-[18px] font-semibold text-[#181c1c]">
                                        {row.customerName}
                                    </span>
                                    <span className="text-[11px] leading-4 text-[#6e7977]">{row.orderId}</span>
                                </div>
                            </div>
                            <div className="flex w-[87px] shrink-0 flex-col items-end justify-center gap-1 pl-[13px]">
                                <div
                                    className={`flex items-center gap-1 rounded-full px-2 py-[3px] ${ratingPill(row.rating)}`}
                                >
                                    <Star size={11} className="fill-current" />
                                    <span className="text-[12px] leading-[18px] font-bold">
                                        {row.rating.toFixed(1)}
                                    </span>
                                </div>
                                <span className="text-[11px] leading-[16.5px] text-[#6e7977]">{row.date}</span>
                            </div>
                        </div>

                        {/* Review text — clamped to 2 lines */}
                        <p className="line-clamp-2 h-10 overflow-hidden text-[13px] leading-5 text-[#3e4947]">
                            {row.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
