import React from 'react';

// OrderStatus stores the SAME canonical values the database persists in
// pesanan.status_pesanan (lowercase English). The UI capitalizes for display
// via STATUS_LABEL — it never stores the capitalized form.
export type OrderStatus = 'pickup' | 'processing' | 'delivery' | 'completed';

/** Stable display order used by filter chips and stat cards. */
export const ORDER_STATUSES: OrderStatus[] = ['pickup', 'processing', 'delivery', 'completed'];

/** Human-readable label for a stored status value. */
export const STATUS_LABEL: Record<OrderStatus, string> = {
    pickup: 'Pickup',
    processing: 'Processing',
    delivery: 'Delivery',
    completed: 'Completed',
};

const STATUS_STYLES: Record<OrderStatus, string> = {
    delivery: 'bg-[#eff6ff] border-[#bfdbfe] text-[#1d4ed8]',
    processing: 'bg-[#fef3c6] border-[#fee685] text-[#f59e0b]',
    pickup: 'bg-[#ffccd3] border-[#f991aa] text-[#f41313]',
    completed: 'bg-[#d1fae5] border-[#6ee7b7] text-[#065f46]',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-[9px] py-[3px] text-[12px] leading-4 font-medium ${STATUS_STYLES[status]}`}
        >
            {STATUS_LABEL[status]}
        </span>
    );
}
