'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RATING_LABEL: Record<number, string> = {
    1: 'Sangat buruk',
    2: 'Kurang',
    3: 'Cukup',
    4: 'Sangat bagus!',
    5: 'Luar biasa!',
};

interface OrderReviewCardProps {
    orderId: string;
    service?: string;
    /** When > 0 the order is already reviewed → show the reviewed state (node 186-2579). */
    initialRating?: number;
}

export default function OrderReviewCard({ orderId, service = 'Cuci Setrika Reguler', initialRating = 0 }: OrderReviewCardProps) {
    const router = useRouter();
    const [hover, setHover] = useState(0);

    // Reviewed state (node 186-2579): centered gold stars + label.
    if (initialRating > 0) {
        return (
            <div className="flex w-full flex-col items-center justify-center gap-[20px] rounded-[12.75px] border border-[#bdc9c6] bg-white p-[15px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
                <div className="flex items-start justify-center gap-[3.5px] pt-[10.5px]">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <span
                            key={value}
                            className={`w-[21.875px] text-center text-[26.25px] leading-[31.5px] ${
                                value <= initialRating ? 'text-[#ffb900]' : 'text-[#cad5e2]'
                            }`}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <p className="w-full text-center text-[12px] leading-[14px] font-normal text-[#62748e]">{RATING_LABEL[initialRating]}</p>
            </div>
        );
    }

    // Unrated state (node 186-2797): "Nilai Order" row. Clicking a star opens the review page.
    function goReview(value: number) {
        router.push(`/customer/orders/${encodeURIComponent(orderId)}/review?stars=${value}&service=${encodeURIComponent(service)}`);
    }

    return (
        <div className="flex w-full items-start justify-between rounded-[16px] border border-[#bdc9c6] bg-white px-[17px] py-[9px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
            <p className="text-[14px] leading-[31.5px] font-semibold text-[#181c1c]">Nilai Order</p>
            <div className="flex items-center gap-[4px]">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        type="button"
                        aria-label={`Beri ${value} bintang`}
                        onClick={() => goReview(value)}
                        onMouseEnter={() => setHover(value)}
                        onMouseLeave={() => setHover(0)}
                        className="w-[21.875px] text-center transition-transform hover:scale-110"
                    >
                        <span className={`text-[26.25px] leading-[31.5px] ${value <= hover ? 'text-[#ffb900]' : 'text-[#cad5e2]'}`}>
                            ★
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
