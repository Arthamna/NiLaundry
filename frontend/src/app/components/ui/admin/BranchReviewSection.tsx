'use client';

import React, { useState } from 'react';
import { Search, Star, ChevronLeft, ChevronRight } from 'lucide-react';

import {
    BRANCH_REVIEWS,
    RATING_BUCKETS,
    BRANCH_RATING,
    BRANCH_REVIEW_COUNT,
    BranchReview,
} from '@/components/ui/admin/branchData';

const CARD = 'rounded-[12px] border border-[#e0e3e1] bg-white';
const MAX_COUNT = Math.max(...RATING_BUCKETS.map((b) => b.count));
const Y_MAX = 8;

type Sort = 'Terbaru' | 'Tertinggi' | 'Terendah';
type StarFilter = 'Semua' | 1 | 2 | 3 | 4 | 5;

// Star row: filled amber stars up to `value`, muted for the rest.
function Stars({ value, size = 16 }: { value: number; size?: number }) {
    return (
        <div className="flex items-center gap-[2px]">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={size}
                    className={n <= value ? 'fill-[#f59e0b] text-[#f59e0b]' : 'fill-[#e0e3e1] text-[#e0e3e1]'}
                />
            ))}
        </div>
    );
}

// Rating badge color scales from teal (good) to orange (poor), matching the Figma review cards.
function badgeStyle(rating: number): { bg: string; fg: string } {
    if (rating >= 4) return { bg: '#d1f6ef', fg: '#0f766e' };
    if (rating === 3) return { bg: '#fef3c6', fg: '#f59e0b' };
    return { bg: '#ffedd5', fg: '#f97316' };
}

function ReviewCard({ review }: { review: BranchReview }) {
    const badge = badgeStyle(review.rating);
    return (
        <div className="flex flex-col gap-[12px] rounded-[12px] border border-[#e0e3e1] p-[18px]">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-[10px]">
                    <span
                        className="flex size-[40px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tracking-[0.6px]"
                        style={{ backgroundColor: review.avatarBg, color: review.avatarText }}
                    >
                        {review.customerInitials}
                    </span>
                    <div className="flex flex-col">
                        <span className="text-[15px] leading-[20px] font-semibold text-[#181c1c]">
                            {review.customerName}
                        </span>
                        <span className="text-[13px] leading-[18px] text-[#6e7977]">{review.customerPhone}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-[6px]">
                    <span
                        className="flex items-center gap-[4px] rounded-[8px] px-[8px] py-[3px] text-[13px] font-semibold"
                        style={{ backgroundColor: badge.bg, color: badge.fg }}
                    >
                        <Star size={12} className="fill-current" />
                        {review.rating.toFixed(1)}
                    </span>
                    <span className="text-[12px] leading-[18px] text-[#6e7977]">{review.date}</span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-[8px] text-[12px] leading-[18px] text-[#6e7977]">
                <span className="rounded-[6px] bg-[#f1f4f3] px-[8px] py-[2px] font-mono text-[#6e7977]">
                    {review.orderCode}
                </span>
                <span>·</span>
                <span>{review.service}</span>
                <span>·</span>
                <span>{review.weight}</span>
            </div>

            <p className="text-[14px] leading-[21px] text-[#3e4947]">{review.comment}</p>
        </div>
    );
}

// "Review" block on the branch Performance tab (Figma node 466:6036).
export default function BranchReviewSection() {
    const [starFilter, setStarFilter] = useState<StarFilter>('Semua');
    const [sort, setSort] = useState<Sort>('Terbaru');

    let reviews = [...BRANCH_REVIEWS];
    if (starFilter !== 'Semua') reviews = reviews.filter((r) => Math.round(r.rating) === starFilter);
    if (sort === 'Tertinggi') reviews.sort((a, b) => b.rating - a.rating);
    if (sort === 'Terendah') reviews.sort((a, b) => a.rating - b.rating);

    const starChips: StarFilter[] = [5, 4, 3, 2, 1];
    const sortChips: Sort[] = ['Terbaru', 'Tertinggi', 'Terendah'];

    return (
        <div className="flex flex-col gap-[20px]">
            <h2 className="text-[24px] leading-[32px] font-bold tracking-[-0.6px] text-[#181c1c]">Review</h2>

            {/* Summary + distribution + per-star */}
            <div className="grid grid-cols-[260px_1fr_280px] gap-[20px]">
                {/* Average rating */}
                <div className={`${CARD} flex flex-col items-center justify-center gap-[8px] px-[24px] py-[32px]`}>
                    <span className="text-[56px] leading-[56px] font-bold tracking-[-1.5px] text-[#181c1c]">
                        {BRANCH_RATING.toFixed(1)}
                    </span>
                    <Stars value={Math.round(BRANCH_RATING)} size={18} />
                    <span className="text-[14px] leading-[20px] text-[#6e7977]">{BRANCH_REVIEW_COUNT} ulasan</span>
                </div>

                {/* Distribution */}
                <div className={`${CARD} flex flex-col gap-[12px] px-[24px] py-[20px]`}>
                    <span className="text-[16px] leading-[24px] font-semibold text-[#181c1c]">Distribusi Rating</span>
                    <div className="flex flex-col gap-[10px]">
                        {RATING_BUCKETS.map((b) => (
                            <div key={b.star} className="flex items-center gap-[12px]">
                                <span className="flex w-[28px] items-center gap-[3px] text-[13px] text-[#3e4947]">
                                    {b.star} <Star size={11} className="fill-[#f59e0b] text-[#f59e0b]" />
                                </span>
                                <div className="h-[10px] flex-1 overflow-hidden rounded-full bg-[#f1f4f3]">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${(b.count / MAX_COUNT) * 100}%`,
                                            backgroundColor: b.color,
                                        }}
                                    />
                                </div>
                                <span className="w-[16px] text-right text-[13px] text-[#6e7977]">{b.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Per Bintang bar chart */}
                <div className={`${CARD} flex flex-col gap-[12px] px-[24px] py-[20px]`}>
                    <span className="text-[16px] leading-[24px] font-semibold text-[#181c1c]">Per Bintang</span>
                    <div className="flex gap-[10px]">
                        {/* Y axis */}
                        <div className="flex h-[120px] flex-col justify-between text-[11px] text-[#6e7977]">
                            <span>8</span>
                            <span>4</span>
                            <span>2</span>
                            <span>0</span>
                        </div>
                        {/* Bars */}
                        <div className="flex flex-1 items-end justify-between gap-[8px]">
                            {RATING_BUCKETS.map((b) => (
                                <div key={b.star} className="flex flex-1 flex-col items-center gap-[6px]">
                                    <div className="flex h-[120px] w-full items-end justify-center">
                                        <div
                                            className="w-[60%] rounded-t-[4px]"
                                            style={{
                                                height: `${(b.count / Y_MAX) * 100}%`,
                                                backgroundColor: b.color,
                                            }}
                                        />
                                    </div>
                                    <span className="text-[11px] text-[#6e7977]">{b.star}★</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* All reviews */}
            <div className={`${CARD} flex flex-col gap-[18px] p-[24px]`}>
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-[16px]">
                    <div className="flex items-center gap-[10px]">
                        <span className="text-[20px] leading-[28px] font-semibold text-[#181c1c]">Semua Ulasan</span>
                        <span className="rounded-full bg-[#f1f4f3] px-[8px] py-[2px] text-[12px] font-medium text-[#6e7977]">
                            {BRANCH_REVIEW_COUNT}
                        </span>
                    </div>
                    <div className="flex w-[220px] items-center gap-[10px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[15px] py-[8px]">
                        <Search size={12} className="shrink-0 text-[#6b7280]" />
                        <input
                            type="text"
                            placeholder="Cari ulasan..."
                            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#181c1c] placeholder:text-[#6b7280] outline-none"
                        />
                    </div>
                </div>

                {/* Filter chips */}
                <div className="flex flex-wrap items-center justify-between gap-[12px]">
                    <div className="flex items-center gap-[8px]">
                        <button
                            type="button"
                            onClick={() => setStarFilter('Semua')}
                            className={`rounded-full px-[12px] py-[5px] text-[13px] font-medium transition-colors ${
                                starFilter === 'Semua'
                                    ? 'bg-[#181c1c] text-white'
                                    : 'border border-[#e0e3e1] text-[#3e4947] hover:bg-[#f1f4f3]'
                            }`}
                        >
                            Semua
                        </button>
                        {starChips.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setStarFilter(s)}
                                className={`flex items-center gap-[4px] rounded-full px-[12px] py-[5px] text-[13px] font-medium transition-colors ${
                                    starFilter === s
                                        ? 'bg-[#181c1c] text-white'
                                        : 'border border-[#e0e3e1] text-[#3e4947] hover:bg-[#f1f4f3]'
                                }`}
                            >
                                {s} <Star size={11} className="fill-[#f59e0b] text-[#f59e0b]" />
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-[6px]">
                        {sortChips.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setSort(s)}
                                className={`rounded-[8px] px-[12px] py-[6px] text-[13px] font-medium transition-colors ${
                                    sort === s ? 'bg-[#181c1c] text-white' : 'text-[#6e7977] hover:bg-[#f1f4f3]'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Review grid */}
                <div className="grid grid-cols-2 gap-[16px]">
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-[4px]">
                    <span className="text-[13px] leading-[20px] text-[#6e7977]">
                        Menampilkan 1–{reviews.length} dari {BRANCH_REVIEW_COUNT} ulasan
                    </span>
                    <div className="flex items-center gap-[6px]">
                        <button
                            type="button"
                            className="flex size-[28px] items-center justify-center rounded-[6px] border border-[#e0e3e1] text-[#6e7977] transition-colors hover:bg-[#f7faf8]"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        {[1, 2].map((page) => (
                            <button
                                key={page}
                                type="button"
                                className={`flex size-[28px] items-center justify-center rounded-[6px] border text-[13px] transition-colors ${
                                    page === 1
                                        ? 'border-[#005c55] bg-[#005c55] text-white'
                                        : 'border-[#e0e3e1] text-[#3e4947] hover:bg-[#f7faf8]'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            type="button"
                            className="flex size-[28px] items-center justify-center rounded-[6px] border border-[#e0e3e1] text-[#6e7977] transition-colors hover:bg-[#f7faf8]"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
