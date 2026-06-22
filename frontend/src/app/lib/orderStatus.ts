// Shared mapping for the small order-status pill (the badge with a bullet on the
// right of each order card / the order-detail header). Keyed by the backend
// `status_pesanan` value so both the orders list and the detail page render the
// same label + colors.

export interface StatusBadge {
    label: string;
    /** pill background */
    badge: string;
    /** bullet color */
    dot: string;
    /** label text color */
    text: string;
}

const GRAY: StatusBadge = {
    label: 'Status',
    badge: 'bg-[#f1f5f9]',
    dot: 'bg-[#94a3b8]',
    text: 'text-[#475569]',
};

// Delivery-flow statuses (pickup → processing → delivery → completed) plus the
// legacy values kept for older rows. Labels mirror the four status-order steps
// in a simple, consistent form, each with its own distinct color so the stage
// reads instantly: Pickup (orange) → Processing (purple) → Delivery (blue) →
// Completed (green).
const STATUS_BADGES: Record<string, StatusBadge> = {
    pickup: { label: 'Pickup', badge: 'bg-[#fff7ed]', dot: 'bg-[#fe9a00]', text: 'text-[#c2410c]' },
    processing: { label: 'Processing', badge: 'bg-[#faf5ff]', dot: 'bg-[#ad46ff]', text: 'text-[#8200db]' },
    delivery: { label: 'Delivery', badge: 'bg-[#eff6ff]', dot: 'bg-[#3b82f6]', text: 'text-[#1d4ed8]' },
    completed: { label: 'Completed', badge: 'bg-[#ecfdf5]', dot: 'bg-[#10b981]', text: 'text-[#047857]' },
    // Cancelled — e.g. the customer left payment unconfirmed or payment failed.
    cancelled: { label: 'Cancelled', badge: 'bg-[#f3f4f6]', dot: 'bg-[#9ca3af]', text: 'text-[#6b7280]' },
    // legacy / payment-flow values
    selesai: { label: 'Completed', badge: 'bg-[#ecfdf5]', dot: 'bg-[#10b981]', text: 'text-[#047857]' },
    active: { label: 'Processing', badge: 'bg-[#faf5ff]', dot: 'bg-[#ad46ff]', text: 'text-[#8200db]' },
    unpaid: { label: 'Belum dibayar', badge: 'bg-[#fef2f2]', dot: 'bg-[#ef4444]', text: 'text-[#b91c1c]' },
    paid: { label: 'Dibayar', badge: 'bg-[#ecfdf5]', dot: 'bg-[#10b981]', text: 'text-[#047857]' },
};

/** Returns the badge label + colors for a backend order status. */
export function getStatusBadge(status: string): StatusBadge {
    return STATUS_BADGES[status] ?? { ...GRAY, label: status || 'Status' };
}

/** Completed orders use 'completed' (new flow); 'selesai' is the legacy value. */
export function isCompletedStatus(status: string): boolean {
    return status === 'completed' || status === 'selesai';
}

/** Cancelled orders (left payment unconfirmed or payment failed). */
export function isCancelledStatus(status: string): boolean {
    return status === 'cancelled';
}

/**
 * History statuses live in the "Completed" section of the orders page (not the
 * active list): genuinely completed orders plus cancelled ones.
 */
export function isHistoryStatus(status: string): boolean {
    return isCompletedStatus(status) || isCancelledStatus(status);
}
