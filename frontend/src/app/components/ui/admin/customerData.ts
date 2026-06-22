// Demo customer data mirrors the Figma design (nodes 357:3215 / 466:4504 / 466:4759 / 466:5014) one-for-one.

export interface Customer {
    id: string;
    name: string;
    initials: string;
    phone: string;
    email: string;
    address: string;
    memberLabel: string;
    orders: number;
    /** Total spend in rupiah. */
    totalSpend: number;
    lastOrder: string;
    avgRating: number;
    /** Avatar gradient stops (135deg) taken verbatim from the Figma rows. */
    gradFrom: string;
    gradTo: string;
}

export const CUSTOMERS: Customer[] = [
    {
        id: 'andini-pratama',
        name: 'Andini Pratama',
        initials: 'AP',
        phone: '0812-3344-7788',
        email: 'andini@email.com',
        address: 'Jl. Kemang Raya No. 21, Jakarta Selatan',
        memberLabel: 'Gold Member · sejak 2023',
        orders: 42,
        totalSpend: 3240000,
        lastOrder: '07 Jun',
        avgRating: 4.8,
        gradFrom: '#00bba7',
        gradTo: '#00786f',
    },
    {
        id: 'rizal-kurniawan',
        name: 'Rizal Kurniawan',
        initials: 'RK',
        phone: '0813-9988-1122',
        email: 'rizal@email.com',
        address: 'Jl. Tebet Barat No. 8, Jakarta Selatan',
        memberLabel: 'Silver Member · sejak 2024',
        orders: 18,
        totalSpend: 1480000,
        lastOrder: '07 Jun',
        avgRating: 4.6,
        gradFrom: '#3b82f6',
        gradTo: '#1d4ed8',
    },
    {
        id: 'sari-wulandari',
        name: 'Sari Wulandari',
        initials: 'SW',
        phone: '0857-2200-1144',
        email: 'sari@email.com',
        address: 'Jl. Cikini Raya No. 45, Jakarta Pusat',
        memberLabel: 'Gold Member · sejak 2023',
        orders: 36,
        totalSpend: 2910000,
        lastOrder: '06 Jun',
        avgRating: 4.9,
        gradFrom: '#f59e0b',
        gradTo: '#d97706',
    },
    {
        id: 'doni-saputra',
        name: 'Doni Saputra',
        initials: 'DS',
        phone: '0821-7788-5544',
        email: 'doni@email.com',
        address: 'Jl. Fatmawati No. 12, Jakarta Selatan',
        memberLabel: 'Regular Member · sejak 2025',
        orders: 8,
        totalSpend: 640000,
        lastOrder: '05 Jun',
        avgRating: 4.5,
        gradFrom: '#64748b',
        gradTo: '#475569',
    },
    {
        id: 'lia-anggraini',
        name: 'Lia Anggraini',
        initials: 'LA',
        phone: '0811-2233-4455',
        email: 'lia@email.com',
        address: 'Jl. Senopati No. 30, Jakarta Selatan',
        memberLabel: 'Silver Member · sejak 2024',
        orders: 24,
        totalSpend: 1860000,
        lastOrder: '05 Jun',
        avgRating: 4.7,
        gradFrom: '#8b5cf6',
        gradTo: '#6d28d9',
    },
    {
        id: 'bayu-triyanto',
        name: 'Bayu Triyanto',
        initials: 'BT',
        phone: '0858-9011-3344',
        email: 'bayu@email.com',
        address: 'Jl. Pondok Indah No. 5, Jakarta Selatan',
        memberLabel: 'Gold Member · sejak 2022',
        orders: 52,
        totalSpend: 4120000,
        lastOrder: '04 Jun',
        avgRating: 4.9,
        gradFrom: '#10b981',
        gradTo: '#059669',
    },
];

export type OrderStatus = 'Disetrika' | 'Selesai';

export interface OrderHistoryRow {
    id: string;
    date: string;
    status: OrderStatus;
    total: string;
}

export interface VoucherItem {
    code: string;
    description: string;
    value: string;
    expLabel: string;
    used: boolean;
}

export interface ReviewItem {
    orderId: string;
    rating: number;
    date: string;
    text: string;
}

// The modal detail panels (Order History / Vouchers / Reviews) come straight
// from the Figma; reused for every customer until per-customer data is wired.
export const ORDER_HISTORY: OrderHistoryRow[] = [
    { id: '#NL-2401', date: '07 Jun', status: 'Disetrika', total: 'Rp 45.000' },
    { id: '#NL-2380', date: '02 Jun', status: 'Selesai', total: 'Rp 120.000' },
    { id: '#NL-2355', date: '28 Mei', status: 'Selesai', total: 'Rp 65.000' },
    { id: '#NL-2310', date: '22 Mei', status: 'Selesai', total: 'Rp 75.000' },
    { id: '#NL-2298', date: '17 Mei', status: 'Selesai', total: 'Rp 38.000' },
];

export const VOUCHERS: VoucherItem[] = [
    { code: 'CUCI20', description: 'Diskon 20% Cuci Setrika', value: '20%', expLabel: 'Exp 30 Jun 2026', used: false },
    { code: 'GRATIS-ONGKIR', description: 'Gratis penjemputan & antar', value: 'Free Ship', expLabel: 'Exp 10 Jun 2026', used: false },
    { code: 'MEMBER50', description: 'Cashback Member Gold', value: 'Rp 50k', expLabel: 'Exp 07 Jul 2026', used: false },
    { code: 'LEBARAN', description: 'Hari Raya 30%', value: '30%', expLabel: 'Terpakai', used: true },
];

export const REVIEWS: ReviewItem[] = [
    { orderId: '#NL-2380', rating: 5.0, date: '02 Jun', text: 'Pakaian bersih banget dan wangi! Pengirimannya tepat waktu. Pasti order lagi.' },
    { orderId: '#NL-2355', rating: 5.0, date: '28 Mei', text: 'Layanan ekspresnya keren! 3 jam selesai dan hasilnya memuaskan. Recommended!' },
    { orderId: '#NL-2310', rating: 5.0, date: '22 Mei', text: 'Bagus, pakaian bersih dan kering sempurna. Driver juga sopan.' },
];

export function findCustomer(id: string): Customer | undefined {
    return CUSTOMERS.find((c) => c.id === id);
}

/** "Rp 3.240.000" */
export function formatRupiah(n: number): string {
    return 'Rp ' + n.toLocaleString('id-ID');
}

/** Header stat shows spend in thousands: 3240000 -> "3.240". */
export function formatSpendK(n: number): string {
    return Math.round(n / 1000).toLocaleString('id-ID');
}
