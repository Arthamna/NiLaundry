// Shared formatters + adapters used by the /branch pages to convert raw
// backend payloads into the shapes the existing display components expect.

import type { AvatarTone } from '@/components/ui/branch/avatarTones';
import type { OrderStatus } from '@/components/ui/branch/StatusBadge';

const RUPIAH = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

export function formatIDR(n: number): string {
    return `Rp ${RUPIAH.format(Math.round(n))}`;
}

export function formatOrderId(id: number): string {
    return `#ORD-${String(id).padStart(4, '0')}`;
}

export function formatInvoiceId(id: number): string {
    return `#INV-${String(id).padStart(4, '0')}`;
}

export function initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_POOL: AvatarTone[] = ['mint', 'teal', 'gray', 'pink', 'purple', 'blue', 'amber', 'green'];

/** Deterministic avatar tone from any identifier. */
export function avatarToneFor(key: string | number): AvatarTone {
    const s = String(key);
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return AVATAR_POOL[Math.abs(h) % AVATAR_POOL.length];
}

/** Format an ISO timestamp as "24 Oct, 14:30" in Indonesian locale. */
export function formatDateShort(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatDateLong(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

/** Estimated-finish label. Returns "Overdue (Nh)" when past now. */
export function formatEstFinish(iso: string): { label: string; isOverdue: boolean } {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { label: '-', isOverdue: false };
    const now = Date.now();
    const diffMs = d.getTime() - now;
    if (diffMs < 0) {
        const hours = Math.max(1, Math.round(-diffMs / 3_600_000));
        return { label: `Overdue (${hours}h)`, isOverdue: true };
    }
    return { label: formatDateShort(iso), isOverdue: false };
}

/**
 * Normalize a backend status string to the canonical OrderStatus the frontend
 * stores (lowercase English, identical to pesanan.status_pesanan). Legacy
 * Indonesian values ('selesai', 'diproses', 'diambil', 'baru') are still
 * accepted as aliases; unknown values fall back to 'processing'.
 */
export function mapOrderStatus(raw: string): OrderStatus {
    const s = raw.trim().toLowerCase();
    switch (s) {
        case 'pickup':
        case 'baru':
        case 'menunggu':
            return 'pickup';
        case 'processing':
        case 'diproses':
            return 'processing';
        case 'delivery':
        case 'diambil':
            return 'delivery';
        case 'completed':
        case 'selesai':
            return 'completed';
        default:
            return 'processing';
    }
}

/**
 * Client → server status value. Now an identity passthrough: OrderStatus is
 * already the canonical value stored in pesanan.status_pesanan. Kept as a
 * named seam so call sites stay explicit about crossing the wire boundary.
 */
export function uiStatusToBackend(ui: OrderStatus): string {
    return ui;
}
