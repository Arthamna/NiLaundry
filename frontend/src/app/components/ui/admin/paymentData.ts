// Demo payments data mirrors the Figma "Payments" design (node 496:9134) one-for-one.

export type PaymentMethod = 'QRIS' | 'BANK' | 'GOPAY' | 'OVO';

export interface Payment {
    id: string;
    /** Invoice code, e.g. "#INV-8492". */
    invoice: string;
    customerName: string;
    customerPhone: string;
    /** Display date, e.g. "24 Oct, 14:30". */
    date: string;
    method: PaymentMethod;
    /** Pre-formatted amount, e.g. "Rp 45.000". */
    amount: string;
}

export interface MethodShare {
    method: PaymentMethod;
    /** Donut segment color (Figma legend swatches). */
    color: string;
    percent: number;
    count: number;
}

// Method breakdown donut + legend (Figma node 496:9160), listed in the design's legend order.
export const METHOD_SHARES: MethodShare[] = [
    { method: 'QRIS', color: '#0f766e', percent: 58, count: 58 },
    { method: 'BANK', color: '#ffb900', percent: 16, count: 16 },
    { method: 'GOPAY', color: '#0ea5e9', percent: 18, count: 18 },
    { method: 'OVO', color: '#a855f7', percent: 8, count: 8 },
];

export const METHOD_FILTERS: Array<'All' | PaymentMethod> = ['All', 'QRIS', 'BANK', 'GOPAY', 'OVO'];

export const PAYMENTS: Payment[] = [
    {
        id: 'inv-8492-a',
        invoice: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '24 Oct, 14:30',
        method: 'QRIS',
        amount: 'Rp 45.000',
    },
    {
        id: 'inv-8492-b',
        invoice: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '24 Oct, 09:45',
        method: 'BANK',
        amount: 'Rp 120.000',
    },
    {
        id: 'inv-8492-c',
        invoice: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '23 Oct, 16:20',
        method: 'GOPAY',
        amount: 'Rp 85.000',
    },
    {
        id: 'inv-8492-d',
        invoice: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '23 Oct, 10:05',
        method: 'OVO',
        amount: 'Rp 60.000',
    },
    {
        id: 'inv-8492-e',
        invoice: '#INV-8492',
        customerName: 'Budi Santoso',
        customerPhone: '0812-3456-7890',
        date: '23 Oct, 10:05',
        method: 'OVO',
        amount: 'Rp 60.000',
    },
];
