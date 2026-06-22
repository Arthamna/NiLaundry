// Demo orders data mirrors the Figma "Orders" design (node 120:4975 / 488:8408) one-for-one.

export type OrderStatus = 'Pickup' | 'Processing' | 'Delivery' | 'Completed' | 'Cancelled';

export interface Order {
    id: string;
    /** Order code, e.g. "#ORD-9082". */
    code: string;
    branch: string;
    customerName: string;
    customerInitials: string;
    customerPhone: string;
    /** Estimated finish label, e.g. "Today, 14:00" or "Tomorrow, 10:00". */
    estFinish: string;
    /** Overdue badge text shown in red, e.g. "Overdue (2h)". Empty when on time. */
    overdue?: string;
    status: OrderStatus;
}

// Avatar in every order row: light-teal circle with teal initials (Figma node 488:8465).
export const ORDER_AVATAR_BG = '#6df5e1';
export const ORDER_AVATAR_TEXT = '#006f64';

// Status pill palette pulled straight from the Figma table cells.
export const STATUS_STYLES: Record<OrderStatus, { bg: string; border: string; text: string }> = {
    Pickup: { bg: '#ffccd3', border: '#f991aa', text: '#f41313' },
    Processing: { bg: '#fef3c6', border: '#fee685', text: '#f59e0b' },
    Delivery: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
    Completed: { bg: '#9cf2e8', border: '#80d5cb', text: '#0f766e' },
    Cancelled: { bg: '#f3f4f6', border: '#d1d5db', text: '#6b7280' },
};

export const STATUS_FILTERS: Array<'All' | OrderStatus> = [
    'All',
    'Pickup',
    'Processing',
    'Delivery',
    'Completed',
    'Cancelled',
];

/** Map a backend status (lowercase, e.g. "cancelled"/"selesai") to the
 *  capitalized OrderStatus this table renders. Mirrors branch/format.ts. */
export function toOrderStatus(raw: string): OrderStatus {
    switch (raw.trim().toLowerCase()) {
        case 'pickup':
        case 'baru':
        case 'menunggu':
            return 'Pickup';
        case 'delivery':
        case 'diambil':
            return 'Delivery';
        case 'completed':
        case 'selesai':
            return 'Completed';
        case 'cancelled':
        case 'canceled':
        case 'dibatalkan':
            return 'Cancelled';
        default:
            return 'Processing';
    }
}

export interface OrderStat {
    label: string;
    value: string;
}

// Top summary cards (Figma node 488:8413).
export const ORDER_STATS: OrderStat[] = [
    { label: 'Total Orders', value: '142' },
    { label: 'Pickup', value: '24' },
    { label: 'Processing', value: '38' },
    { label: 'Delivery', value: '24' },
    { label: 'Completed', value: '24' },
];

export const ORDERS: Order[] = [
    {
        id: 'ord-9082-a',
        code: '#ORD-9082',
        branch: 'Keputih',
        customerName: 'Anita Smith',
        customerInitials: 'AS',
        customerPhone: '+62 812 3456',
        estFinish: 'Today, 14:00',
        status: 'Delivery',
    },
    {
        id: 'ord-9081-a',
        code: '#ORD-9081',
        branch: 'Keputih',
        customerName: 'Budi Kurniawan',
        customerInitials: 'BK',
        customerPhone: '+62 819 8765',
        estFinish: 'Tomorrow, 10:00',
        status: 'Completed',
    },
    {
        id: 'ord-9080-a',
        code: '#ORD-9080',
        branch: 'Keputih',
        customerName: 'Citra Dewi',
        customerInitials: 'CD',
        customerPhone: '+62 856 1122',
        estFinish: '',
        overdue: 'Overdue (2h)',
        status: 'Processing',
    },
    {
        id: 'ord-9082-b',
        code: '#ORD-9082',
        branch: 'Keputih',
        customerName: 'Anita Smith',
        customerInitials: 'AS',
        customerPhone: '+62 812 3456',
        estFinish: 'Today, 14:00',
        status: 'Pickup',
    },
    {
        id: 'ord-9081-b',
        code: '#ORD-9081',
        branch: 'Keputih',
        customerName: 'Budi Kurniawan',
        customerInitials: 'BK',
        customerPhone: '+62 819 8765',
        estFinish: 'Tomorrow, 10:00',
        status: 'Completed',
    },
    {
        id: 'ord-9082-c',
        code: '#ORD-9082',
        branch: 'Keputih',
        customerName: 'Anita Smith',
        customerInitials: 'AS',
        customerPhone: '+62 812 3456',
        estFinish: 'Today, 14:00',
        status: 'Delivery',
    },
    {
        id: 'ord-9080-b',
        code: '#ORD-9080',
        branch: 'Keputih',
        customerName: 'Citra Dewi',
        customerInitials: 'CD',
        customerPhone: '+62 856 1122',
        estFinish: '',
        overdue: 'Overdue (2h)',
        status: 'Processing',
    },
    {
        id: 'ord-9082-d',
        code: '#ORD-9082',
        branch: 'Keputih',
        customerName: 'Anita Smith',
        customerInitials: 'AS',
        customerPhone: '+62 812 3456',
        estFinish: 'Today, 14:00',
        status: 'Pickup',
    },
    {
        id: 'ord-9082-e',
        code: '#ORD-9082',
        branch: 'Keputih',
        customerName: 'Anita Smith',
        customerInitials: 'AS',
        customerPhone: '+62 812 3456',
        estFinish: 'Today, 14:00',
        status: 'Delivery',
    },
    {
        id: 'ord-9080-c',
        code: '#ORD-9080',
        branch: 'Keputih',
        customerName: 'Citra Dewi',
        customerInitials: 'CD',
        customerPhone: '+62 856 1122',
        estFinish: '',
        overdue: 'Overdue (2h)',
        status: 'Processing',
    },
];
