'use client';

import React, { Suspense, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import BackButton from '@/components/ui/customer/BackButton';
import { rateOrder } from '@/lib/orders';

// TODO: replace with the authenticated user's id once auth is wired.
const USER_ID = 'current-user';

const RATING_LABEL: Record<number, string> = {
    1: 'Sangat buruk',
    2: 'Kurang',
    3: 'Cukup',
    4: 'Sangat bagus!',
    5: 'Luar biasa!',
};

function StarRating({ rating, onSelect }: { rating: number; onSelect?: (value: number) => void }) {
    return (
        <div className="flex items-start justify-center gap-[3.5px] pt-[10.5px]">
            {[1, 2, 3, 4, 5].map((value) => {
                const filled = value <= rating;
                const star = (
                    <span className={`text-[26.25px] leading-[31.5px] ${filled ? 'text-[#ffb900]' : 'text-[#cad5e2]'}`}>★</span>
                );
                return onSelect ? (
                    <button
                        key={value}
                        type="button"
                        aria-label={`Beri ${value} bintang`}
                        onClick={() => onSelect(value)}
                        className="w-[21.875px] transition-transform hover:scale-110"
                    >
                        {star}
                    </button>
                ) : (
                    <span key={value} className="w-[21.875px] text-center">
                        {star}
                    </span>
                );
            })}
        </div>
    );
}

function ReviewInner() {
    const params = useParams<{ order_id: string }>();
    const searchParams = useSearchParams();

    const orderId = params?.order_id ?? 'NL-2380';
    const service = searchParams.get('service') ?? 'Dry Clean Premium';
    const initialStars = Number(searchParams.get('stars')) || 5;

    const [rating, setRating] = useState(initialStars);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit() {
        setSubmitting(true);
        await rateOrder(USER_ID, orderId, rating, review);
        setSubmitting(false);
        setSubmitted(true);
    }

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name="Sarah Jenkins" activeVouchers={3} />

            <div className="flex w-full flex-col gap-[20px]">
                <BackButton href="/customer/orders" label="← Kembali" />

                {/* Rating summary card */}
                <div className="flex w-full flex-col items-center justify-center gap-[20px] rounded-[12.75px] border border-[#bdc9c6] bg-white p-[15px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
                    <p className="w-full text-center text-[16px] leading-[16.5px] font-bold text-[#62748e]">
                        #{orderId} · {service}
                    </p>
                    <div className="h-[42px] w-[302px]">
                        <StarRating rating={rating} onSelect={submitted ? undefined : setRating} />
                    </div>
                    {submitted && (
                        <p className="w-full text-center text-[12px] leading-[14px] font-normal text-[#62748e]">
                            {RATING_LABEL[rating]}
                        </p>
                    )}
                </div>

                {/* Comment + submit — hidden once the review is submitted */}
                {!submitted && (
                    <div className="w-full">
                        <div className="flex w-full flex-col items-center justify-center gap-[20px] rounded-[12.75px] border border-[#bdc9c6] bg-white p-[15px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
                            <p className="w-full text-[14px] leading-[14px] font-bold text-[#0f172b]">Apa yang Anda suka?</p>
                            <div className="flex w-full flex-col gap-[16px]">
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Ceritakan pengalamanmu…"
                                    className="h-[70px] w-full resize-none rounded-[6.75px] border border-[#bdc9c6] p-[8px] text-[13px] leading-[14px] text-[#0f172b] placeholder:text-[rgba(15,23,43,0.5)] outline-none focus:border-[#009689]"
                                />
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex h-[40px] w-full items-center justify-center rounded-[6.75px] bg-[#009689] px-[113px] py-[8px] text-[12px] leading-[17.5px] font-bold text-white transition-colors hover:bg-[#007a70] disabled:opacity-60"
                                >
                                    {submitting ? 'Mengirim…' : 'Kirim Ulasan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ReviewPage() {
    return (
        <Suspense fallback={null}>
            <ReviewInner />
        </Suspense>
    );
}
