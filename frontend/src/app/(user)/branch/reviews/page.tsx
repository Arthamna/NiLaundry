'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Star, Search, ChevronLeft, ChevronRight } from 'lucide-react';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import { AVATAR_TONES } from '@/components/ui/branch/avatarTones';
import {
    adminApi,
    getApiErrorMessage,
    getCurrentCabangId,
    type UlasanAdmin,
    type UlasanAverage,
    type UlasanDistribusi,
} from '@/lib/api';
import {
    avatarToneFor,
    formatOrderId,
    initialsOf,
} from '@/components/ui/branch/format';

const PAGE_SIZE = 6;
const RATING_CHIPS = [5, 4, 3, 2, 1];
type SortOption = 'Newest' | 'Highest' | 'Lowest';
const SORT_OPTIONS: SortOption[] = ['Newest', 'Highest', 'Lowest'];

const DISTRIBUTION_COLOR: Record<number, string> = {
    5: 'bg-[#0f766e]',
    4: 'bg-[#6df5e1]',
    3: 'bg-[#f59e0b]',
    2: 'bg-[#f97316]',
    1: 'bg-[#ef4444]',
};

function ratingTone(rating: number): { pill: string; text: string } {
    if (rating >= 4.5) return { pill: 'bg-[rgba(15,118,110,0.09)]', text: 'text-[#0f766e]' };
    if (rating >= 4.0) return { pill: 'bg-[rgba(20,184,166,0.09)]', text: 'text-[#14b8a6]' };
    if (rating >= 3.0) return { pill: 'bg-[rgba(245,158,11,0.09)]', text: 'text-[#f59e0b]' };
    if (rating >= 2.0) return { pill: 'bg-[rgba(249,115,22,0.09)]', text: 'text-[#f97316]' };
    return { pill: 'bg-[rgba(239,68,68,0.09)]', text: 'text-[#ef4444]' };
}

function StarRow({ rating, size }: { rating: number; size: number }) {
    const filled = Math.round(rating);
    return (
        <div className="flex items-center gap-px">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={size}
                    className={n <= filled ? 'fill-[#f59e0b] text-[#f59e0b]' : 'fill-[#cbd5e1] text-[#cbd5e1]'}
                />
            ))}
        </div>
    );
}

export default function BranchReviewsPage() {
    const cabangId = useMemo(() => getCurrentCabangId(), []);

    const [average, setAverage] = useState<UlasanAverage | null>(null);
    const [distribusi, setDistribusi] = useState<UlasanDistribusi | null>(null);
    const [ulasan, setUlasan] = useState<UlasanAdmin[]>([]);
    const [search, setSearch] = useState('');
    const [ratingFilter, setRatingFilter] = useState<number | 'All'>('All');
    const [sort, setSort] = useState<SortOption>('Newest');
    const [page, setPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cabangId == null) {
            setError('Sesi cabang tidak ditemukan.');
            return;
        }
        const controller = new AbortController();
        Promise.all([
            adminApi.getUlasanAverage(cabangId, controller.signal),
            adminApi.getUlasanDistribusi(cabangId, controller.signal),
            // Pull a generous slice; the page filters/sorts client-side
            // (matches the existing UI which has search + rating chips + sort).
            adminApi.listUlasan(cabangId, { limit: 200 }, controller.signal),
        ])
            .then(([a, d, u]) => {
                setAverage(a);
                setDistribusi(d);
                setUlasan(u);
                setError(null);
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            });
        return () => controller.abort();
    }, [cabangId]);

    const total = average?.totalUlasan ?? distribusi?.total ?? 0;

    const distribution = useMemo(() => {
        if (!distribusi) return [];
        const totalCount = distribusi.total || 1;
        return [5, 4, 3, 2, 1].map((stars) => {
            const count =
                stars === 5
                    ? distribusi.rating5
                    : stars === 4
                      ? distribusi.rating4
                      : stars === 3
                        ? distribusi.rating3
                        : stars === 2
                          ? distribusi.rating2
                          : distribusi.rating1;
            return {
                stars,
                count,
                pct: (count / totalCount) * 100,
                color: DISTRIBUTION_COLOR[stars],
            };
        });
    }, [distribusi]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        let out = ulasan.filter((u) => {
            if (ratingFilter !== 'All' && u.rating !== ratingFilter) return false;
            if (q && !u.pelangganNama.toLowerCase().includes(q) && !u.komentar.toLowerCase().includes(q)) {
                return false;
            }
            return true;
        });
        if (sort === 'Highest') out = [...out].sort((a, b) => b.rating - a.rating);
        else if (sort === 'Lowest') out = [...out].sort((a, b) => a.rating - b.rating);
        // 'Newest' uses the server's id-DESC order (no waktu_ulasan column).
        return out;
    }, [ulasan, search, ratingFilter, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = useMemo(
        () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [filtered, page],
    );

    return (
        <>
            <BranchTopBar title="Reviews" />

            <div className="flex w-full flex-col gap-6 px-10 pt-10 pb-10">
                <div className="flex flex-col gap-1">
                    <span className="text-[14px] leading-5 font-medium text-[#3e4947]">Customer Feedback</span>
                    <h3 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                        Customer Reviews
                    </h3>
                </div>

                {error && (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}

                {/* Summary row */}
                <div className="flex items-stretch gap-4">
                    {/* Average rating */}
                    <div className="flex w-[180px] shrink-0 flex-col items-center justify-center gap-2 rounded-[12px] border border-[#e2e8f0] bg-white px-[40px] py-[28px]">
                        <span className="text-[56px] leading-[56px] font-bold text-[#181c1c]">
                            {average ? average.averageRating.toFixed(1) : '–'}
                        </span>
                        <StarRow rating={average?.averageRating ?? 0} size={18} />
                        <span className="text-[13px] leading-[18px] text-[#6e7977]">{total} reviews</span>
                    </div>

                    {/* Distribution */}
                    <div className="flex flex-1 flex-col gap-[10px] rounded-[12px] border border-[#e2e8f0] bg-white px-[28px] py-[24px]">
                        <span className="text-[14px] leading-5 font-medium text-[#181c1c]">Rating Distribution</span>
                        <div className="flex flex-col gap-[10px]">
                            {distribution.map((row) => (
                                <div key={row.stars} className="flex items-center gap-3">
                                    <div className="flex w-[48px] shrink-0 items-center gap-1">
                                        <span className="text-[13px] leading-5 text-[#3e4947]">{row.stars}</span>
                                        <Star size={11} className="fill-[#f59e0b] text-[#f59e0b]" />
                                    </div>
                                    <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#f1f4f3]">
                                        <div
                                            className={`h-full rounded-full ${row.color}`}
                                            style={{ width: `${row.pct}%` }}
                                        />
                                    </div>
                                    <span className="w-[24px] shrink-0 text-right text-[12px] leading-4 text-[#6e7977]">
                                        {row.count}
                                    </span>
                                </div>
                            ))}
                            {distribution.length === 0 && (
                                <span className="text-[12px] text-[#6e7977]">Belum ada data.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews panel */}
                <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white">
                    <div className="flex items-center justify-between border-b border-[#e0e3e1] px-6 py-[18px]">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[20px] leading-7 font-semibold text-[#181c1c]">All Reviews</h3>
                            <span className="rounded-full bg-[#f1f4f3] px-2 py-0.5 text-[13px] leading-[18px] text-[#3e4947]">
                                {filtered.length}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative w-[200px]">
                                <Search
                                    size={14}
                                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#6e7977]"
                                />
                                <input
                                    type="text"
                                    placeholder="Search reviews..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full rounded-[8px] border border-[#e0e3e1] bg-white py-2 pr-3 pl-9 text-[13px] text-[#181c1c] outline-none placeholder:text-[#6e7977]"
                                />
                            </div>

                            <div className="flex items-center gap-1 rounded-[8px] bg-[#f1f4f3] p-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRatingFilter('All');
                                        setPage(1);
                                    }}
                                    className={`rounded-[6px] px-2 py-1 text-[12px] leading-4 font-medium ${
                                        ratingFilter === 'All'
                                            ? 'bg-white text-[#181c1c] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                            : 'text-[#3e4947]'
                                    }`}
                                >
                                    All
                                </button>
                                {RATING_CHIPS.map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => {
                                            setRatingFilter(n);
                                            setPage(1);
                                        }}
                                        className={`flex items-center gap-1 rounded-[6px] px-2 py-1 text-[12px] leading-4 font-medium ${
                                            ratingFilter === n
                                                ? 'bg-white text-[#181c1c] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                                : 'text-[#3e4947]'
                                        }`}
                                    >
                                        {n}
                                        <Star size={11} className="fill-[#f59e0b] text-[#f59e0b]" />
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-1 rounded-[8px] bg-[#f1f4f3] p-1">
                                {SORT_OPTIONS.map((label) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => setSort(label)}
                                        className={`rounded-[6px] px-2 py-1 text-[12px] leading-4 font-medium ${
                                            sort === label
                                                ? 'bg-white text-[#181c1c] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                                : 'text-[#3e4947]'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        {paged.length === 0 && (
                            <div className="col-span-2 px-6 py-10 text-center text-[14px] text-[#3e4947]">
                                Tidak ada ulasan.
                            </div>
                        )}
                        {paged.map((review, index) => {
                            const tone = ratingTone(review.rating);
                            const isLastRow = index >= paged.length - (paged.length % 2 === 0 ? 2 : 1);
                            const tone_avatar = avatarToneFor(review.pelangganId);
                            return (
                                <article
                                    key={review.id}
                                    className={`flex flex-col gap-[14px] px-6 pt-6 pb-[25px] ${
                                        index % 2 === 0 ? 'border-r border-[#e0e3e1]' : ''
                                    } ${isLastRow ? '' : 'border-b border-[#e0e3e1]'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-[10px]">
                                            <div
                                                className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] leading-[18px] font-semibold ${AVATAR_TONES[tone_avatar]}`}
                                            >
                                                {initialsOf(review.pelangganNama)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] leading-5 font-medium text-[#181c1c]">
                                                    {review.pelangganNama}
                                                </span>
                                                <span className="text-[12px] leading-4 text-[#6e7977]">
                                                    {review.pelangganEmail}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end gap-1 pl-3">
                                            <div className={`flex items-center gap-1 rounded-full px-2 py-[3px] ${tone.pill}`}>
                                                <Star size={12} className={`fill-current ${tone.text}`} />
                                                <span className={`text-[13px] leading-[18px] font-bold ${tone.text}`}>
                                                    {review.rating.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="rounded-[4px] bg-[#f1f4f3] px-2 py-0.5 text-[12px] leading-4 text-[#6e7977]">
                                            {formatOrderId(review.pesananId)}
                                        </span>
                                        {review.layananNama && (
                                            <>
                                                <span className="text-[12px] leading-4 text-[#3e4947]">·</span>
                                                <span className="text-[12px] leading-4 text-[#3e4947]">{review.layananNama}</span>
                                            </>
                                        )}
                                        <span className="text-[12px] leading-4 text-[#3e4947]">·</span>
                                        <span className="text-[12px] leading-4 text-[#3e4947]">
                                            Pegawai: {review.pegawaiNama}
                                        </span>
                                    </div>

                                    <p className="line-clamp-3 text-[14px] leading-5 text-[#3e4947]">{review.komentar}</p>
                                </article>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#bdc9c6] px-6 py-3">
                        <span className="text-[13px] leading-5 text-[#3e4947]">
                            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} reviews
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className="flex items-center justify-center rounded-[4px] p-1 disabled:opacity-30"
                            >
                                <ChevronLeft size={14} className="text-[#3e4947]" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setPage(n)}
                                    className={
                                        n === page
                                            ? 'flex size-7 items-center justify-center rounded-[4px] bg-[#0f766e] text-[12px] leading-4 font-semibold text-[#a3faef]'
                                            : 'flex size-7 items-center justify-center rounded-[4px] text-[12px] leading-4 font-semibold text-[#3e4947]'
                                    }
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                type="button"
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="flex items-center justify-center rounded-[4px] p-1 disabled:opacity-30"
                            >
                                <ChevronRight size={14} className="text-[#3e4947]" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
