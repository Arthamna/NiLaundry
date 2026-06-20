'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

export type OrderStatusKey = 'disetrika' | 'selesai';

const STATUS: Record<OrderStatusKey, { label: string; badge: string; dot: string; text: string }> = {
    disetrika: { label: 'Disetrika', badge: 'bg-[#faf5ff]', dot: 'bg-[#ad46ff]', text: 'text-[#8200db]' },
    selesai: { label: 'Selesai', badge: 'bg-[#46ecd5]', dot: 'bg-[#007a55]', text: 'text-[#007a55]' },
};

export interface OrderStep {
    label: string;
    done: boolean;
}

interface OrderCardProps {
    orderId: string;
    service: string;
    status: OrderStatusKey;
    eta: string;
    steps?: OrderStep[];
}

function RatingRow({ cleanId, service }: { cleanId: string; service: string }) {
    const router = useRouter();
    const [hover, setHover] = useState(0);

    function goReview(e: React.MouseEvent, value: number) {
        e.stopPropagation();
        router.push(`/customer/orders/${encodeURIComponent(cleanId)}/review?stars=${value}&service=${encodeURIComponent(service)}`);
    }

    return (
        <div className="mt-[7px] flex items-center gap-[7px] border-t border-[#f1f5f9] pt-[7px]">
            <p className="text-[10.5px] leading-[14px] font-medium text-[#6e7977]">Beri rating:</p>
            <div className="flex items-center gap-[2px]">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        type="button"
                        aria-label={`Beri ${value} bintang`}
                        onClick={(e) => goReview(e, value)}
                        onMouseEnter={() => setHover(value)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-transform hover:scale-110"
                    >
                        <Star size={14} className={value <= hover ? 'fill-[#facc15] text-[#facc15]' : 'text-[#cad5e2]'} />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function OrderCard({ orderId, service, status, eta, steps }: OrderCardProps) {
    const router = useRouter();
    const s = STATUS[status];
    const cleanId = orderId.replace(/^#/, '');
    const detailStatus = status === 'selesai' ? 'completed' : 'active';

    function goDetail() {
        router.push(`/customer/orders/${encodeURIComponent(cleanId)}?status=${detailStatus}`);
    }

    return (
        <div
            onClick={goDetail}
            className="flex w-full cursor-pointer flex-col rounded-[8.75px] border border-[#bdc9c6] p-[11.5px] transition-colors hover:border-[#00bba7] hover:bg-[#f6fffe]"
        >
            <div className="flex items-center justify-between">
                <div className="flex w-[120.297px] flex-col">
                    <p className="text-[10.5px] leading-[14px] font-normal text-[#6e7977]">{orderId}</p>
                    <p className="text-[12.25px] leading-[17.5px] font-semibold text-[#0f172b]">{service}</p>
                </div>
                <div className={`flex items-center gap-[5.25px] rounded-full px-[7px] py-[1.75px] ${s.badge}`}>
                    <span className={`size-[5.25px] rounded-full ${s.dot}`} />
                    <p className={`text-[10.5px] leading-[14px] font-normal ${s.text}`}>{s.label}</p>
                </div>
            </div>

            {steps && (
                <div className="flex items-center gap-[10px] pt-[10.5px]">
                    {steps.map((step, i) => (
                        <div key={i} className="flex min-w-px flex-1 flex-col items-start">
                            <div className={`h-[3.5px] w-full rounded-full ${step.done ? 'bg-[#00bba7]' : 'bg-[#bdc9c6]'}`} />
                            <p className="pt-[3.5px] text-[9px] leading-[13.5px] font-normal text-[#6e7977]">{step.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <p className="pt-[7px] text-[11px] leading-[16.5px] font-normal text-[#6e7977]">{eta}</p>

            {/* Completed orders that are not reviewed yet show the rating row. */}
            {status === 'selesai' && <RatingRow cleanId={cleanId} service={service} />}
        </div>
    );
}
