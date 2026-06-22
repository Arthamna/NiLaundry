'use client';

import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';

import { BranchReview } from '@/components/ui/admin/branchData';
import TablePagination, { usePagination } from '@/components/ui/admin/TablePagination';

const CARD = 'rounded-[12px] border border-[#e0e3e1] bg-white';

type Sort = 'Highest' | 'Lowest';
type StarFilter = 'All' | 1 | 2 | 3 | 4 | 5;

// Per-star bar colour (teal = good … red = poor), matching the Figma chart.
const STAR_COLOR: Record<number, string> = {
    5: '#0f766e',
    4: '#6df5e1',
    3: '#f59e0b',
    2: '#f97316',
    1: '#ef4444',
};

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
                        {review.customerPhone && (
                            <span className="text-[13px] leading-[18px] text-[#6e7977]">{review.customerPhone}</span>
                        )}
                    </div>
                </div>
                <span
                    className="flex h-fit items-center gap-[4px] rounded-[8px] px-[8px] py-[3px] text-[13px] font-semibold"
                    style={{ backgroundColor: badge.bg, color: badge.fg }}
                >
                    <Star size={12} className="fill-current" />
                    {review.rating.toFixed(1)}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-[8px] text-[12px] leading-[18px] text-[#6e7977]">
                <span className="rounded-[6px] bg-[#f1f4f3] px-[8px] py-[2px] font-mono text-[#6e7977]">
                    {review.orderCode}
                </span>
                {review.service && (
                    <>
                        <span>·</span>
                        <span>{review.service}</span>
                    </>
                )}
            </div>

            {review.comment && <p className="text-[14px] leading-[21px] text-[#3e4947]">{review.comment}</p>}
        </div>
    );
}

// "Review" block on the branch Performance tab (Figma node 466:6036).
export default function BranchReviewSection({ reviews }: { reviews: BranchReview[] }) {
    const [starFilter, setStarFilter] = useState<StarFilter>('All');
    const [sort, setSort] = useState<Sort | null>(null);

    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;

    const buckets = useMemo(() => {
        const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        for (const r of reviews) {
            const star = Math.min(5, Math.max(1, Math.round(r.rating)));
            counts[star] += 1;
        }
        return [5, 4, 3, 2, 1].map((star) => ({ star, count: counts[star], color: STAR_COLOR[star] }));
    }, [reviews]);

    const maxCount = Math.max(1, ...buckets.map((b) => b.count));

    const visible = useMemo(() => {
        let list = [...reviews];
        if (starFilter !== 'All') list = list.filter((r) => Math.round(r.rating) === starFilter);
        if (sort === 'Highest') list.sort((a, b) => b.rating - a.rating);
        if (sort === 'Lowest') list.sort((a, b) => a.rating - b.rating);
        return list;
    }, [reviews, starFilter, sort]);

    const { page, setPage, pageCount, pageItems, total: visibleTotal, pageSize } = usePagination(visible);

    const starChips: StarFilter[] = [5, 4, 3, 2, 1];
    const sortChips: Sort[] = ['Highest', 'Lowest'];

    return (
        <div className="flex flex-col gap-[20px]">
            <h2 className="text-[24px] leading-[32px] font-bold tracking-[-0.6px] text-[#181c1c]">Review</h2>

            {/* Summary + distribution */}
            <div className="grid grid-cols-[260px_1fr] gap-[20px]">
                <div className={`${CARD} flex flex-col items-center justify-center gap-[8px] px-[24px] py-[32px]`}>
                    <span className="text-[56px] leading-[56px] font-bold tracking-[-1.5px] text-[#181c1c]">
                        {average.toFixed(1)}
                    </span>
                    <Stars value={Math.round(average)} size={18} />
                    <span className="text-[14px] leading-[20px] text-[#6e7977]">{total} reviews</span>
                </div>

                <div className={`${CARD} flex flex-col gap-[12px] px-[24px] py-[20px]`}>
                    <span className="text-[16px] leading-[24px] font-semibold text-[#181c1c]">Rating Distribution</span>
                    <div className="flex flex-col gap-[10px]">
                        {buckets.map((b) => (
                            <div key={b.star} className="flex items-center gap-[12px]">
                                <span className="flex w-[28px] items-center gap-[3px] text-[13px] text-[#3e4947]">
                                    {b.star} <Star size={11} className="fill-[#f59e0b] text-[#f59e0b]" />
                                </span>
                                <div className="h-[10px] flex-1 overflow-hidden rounded-full bg-[#f1f4f3]">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${(b.count / maxCount) * 100}%`, backgroundColor: b.color }}
                                    />
                                </div>
                                <span className="w-[16px] text-right text-[13px] text-[#6e7977]">{b.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* All reviews */}
            <div className={`${CARD} flex flex-col gap-[18px] p-[24px]`}>
                <div className="flex flex-wrap items-center justify-between gap-[16px]">
                    <div className="flex items-center gap-[10px]">
                        <span className="text-[20px] leading-[28px] font-semibold text-[#181c1c]">All Reviews</span>
                        <span className="rounded-full bg-[#f1f4f3] px-[8px] py-[2px] text-[12px] font-medium text-[#6e7977]">
                            {total}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-[12px]">
                    <div className="flex items-center gap-[8px]">
                        <button
                            type="button"
                            onClick={() => setStarFilter('All')}
                            className={`rounded-full px-[12px] py-[5px] text-[13px] font-medium transition-colors ${
                                starFilter === 'All'
                                    ? 'bg-[#181c1c] text-white'
                                    : 'border border-[#e0e3e1] text-[#3e4947] hover:bg-[#f1f4f3]'
                            }`}
                        >
                            All
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
                                onClick={() => setSort((cur) => (cur === s ? null : s))}
                                className={`rounded-[8px] px-[12px] py-[6px] text-[13px] font-medium transition-colors ${
                                    sort === s ? 'bg-[#181c1c] text-white' : 'text-[#6e7977] hover:bg-[#f1f4f3]'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {visible.length === 0 ? (
                    <p className="text-[13px] text-[#6e7977]">No reviews yet.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-[16px]">
                            {pageItems.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                        <div className="-mx-[6px] border-t border-[#f1f4f3] pt-[6px]">
                            <TablePagination
                                page={page}
                                pageCount={pageCount}
                                total={visibleTotal}
                                pageSize={pageSize}
                                onPage={setPage}
                                label="reviews"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
