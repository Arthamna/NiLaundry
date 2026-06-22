import React from 'react';

export type OrderStatus = 'Delivery' | 'Processing' | 'Pickup' | 'Completed';

const STATUS_STYLES: Record<OrderStatus, string> = {
    Delivery: 'bg-[#eff6ff] border-[#bfdbfe] text-[#1d4ed8]',
    Processing: 'bg-[#fef3c6] border-[#fee685] text-[#f59e0b]',
    Pickup: 'bg-[#ffccd3] border-[#f991aa] text-[#f41313]',
    Completed: 'bg-[#d1fae5] border-[#6ee7b7] text-[#065f46]',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-[9px] py-[3px] text-[12px] leading-4 font-medium ${STATUS_STYLES[status]}`}
        >
            {status}
        </span>
    );
}
