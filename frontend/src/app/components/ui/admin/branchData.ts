// Demo branch data mirrors the Figma "Branches" designs (nodes 422:5533 / 466:5705 / 466:6413 / 466:7108) one-for-one.

export interface Branch {
    id: string;
    /** Branch code, e.g. "#BR-0001". */
    code: string;
    name: string;
    address: string;
    phone: string;
    /** Operating hours label, e.g. "08:00 - 19.00". */
    hours: string;
}

export interface BranchService {
    id: string;
    /** Service code, e.g. "#BR-0001". */
    code: string;
    name: string;
    /** Unit, e.g. "kg". */
    unit: string;
    /** Price per unit (raw number string as shown in the table), e.g. "50000". */
    price: string;
    description: string;
}

export interface BranchReview {
    id: string;
    customerName: string;
    customerInitials: string;
    customerPhone: string;
    avatarBg: string;
    avatarText: string;
    rating: number;
    date: string;
    orderCode: string;
    service: string;
    weight: string;
    comment: string;
}

export interface RatingBucket {
    star: number;
    count: number;
    /** Bar fill color, taken verbatim from the Figma distribution chart. */
    color: string;
}

// Distribution + per-star chart palette (Figma node 466:6039 distribution bars).
export const RATING_BUCKETS: RatingBucket[] = [
    { star: 5, count: 5, color: '#0f766e' },
    { star: 4, count: 3, color: '#6df5e1' },
    { star: 3, count: 2, color: '#f59e0b' },
    { star: 2, count: 1, color: '#f97316' },
    { star: 1, count: 1, color: '#ef4444' },
];

export const BRANCH_RATING = 3.8;
export const BRANCH_REVIEW_COUNT = 12;

export const BRANCHES: Branch[] = Array.from({ length: 8 }, (_, i) => ({
    id: i === 0 ? 'keputih' : `br-${i + 1}`,
    code: '#BR-0001',
    name: 'Keputih',
    address: 'Jalan Keputih Perlimaan',
    phone: '+62 812-3456-7890',
    hours: '08:00 - 19.00',
}));

export const BRANCH_SERVICES: BranchService[] = Array.from({ length: 10 }, (_, i) => ({
    id: `svc-${i + 1}`,
    code: '#BR-0001',
    name: 'Keputih',
    unit: 'kg',
    price: '50000',
    description: 'Lorem Ipsum Dolor Sit Amet',
}));

export const BRANCH_REVIEWS: BranchReview[] = [
    {
        id: 'rv-1',
        customerName: 'Anita Smith',
        customerInitials: 'AS',
        customerPhone: '+62 812 3456',
        avatarBg: '#6df5e1',
        avatarText: '#006f64',
        rating: 5,
        date: '24 Okt 2023, 16:10',
        orderCode: '#ORD-9082',
        service: 'Cuci + Setrika',
        weight: '3 kg',
        comment:
            'Pakaian bersih banget dan wangi! Pengirimannya tepat waktu sesuai estimasi. Pasti bakal order lagi bulan depan. Terima kasih NiLaundry Keputih!',
    },
    {
        id: 'rv-2',
        customerName: 'Budi Kurniawan',
        customerInitials: 'BK',
        customerPhone: '+62 819 8765',
        avatarBg: '#0f766e',
        avatarText: '#ffffff',
        rating: 4,
        date: '23 Okt 2023, 11:30',
        orderCode: '#ORD-9081',
        service: 'Cuci Kering',
        weight: '5 kg',
        comment:
            'Pelayanannya ramah dan hasilnya lumayan bagus. Ada sedikit noda yang masih tersisa di kemeja putih saya, tapi secara keseluruhan sudah oke.',
    },
    {
        id: 'rv-3',
        customerName: 'Citra Dewi',
        customerInitials: 'CD',
        customerPhone: '+62 856 1122',
        avatarBg: '#e5e9e7',
        avatarText: '#3e4947',
        rating: 2,
        date: '23 Okt 2023, 09:15',
        orderCode: '#ORD-9080',
        service: 'Cuci + Setrika',
        weight: '4 kg',
        comment:
            'Kecewa banget, pakaian saya selesai 2 jam lebih lambat dari jadwal. Udah ditunggu-tunggu dari tadi. Semoga ke depannya bisa lebih on-time.',
    },
    {
        id: 'rv-4',
        customerName: 'Dewi Lestari',
        customerInitials: 'DL',
        customerPhone: '+62 878 4321',
        avatarBg: '#fce7f3',
        avatarText: '#be185d',
        rating: 5,
        date: '22 Okt 2023, 18:45',
        orderCode: '#ORD-9079',
        service: 'Laundry Ekspres',
        weight: '2 kg',
        comment:
            'Layanan ekspresnya keren banget! 3 jam sudah selesai dan hasilnya memuaskan. Lipatan bajunya rapi sekali, tidak ada yang kusut. Recommended!',
    },
    {
        id: 'rv-5',
        customerName: 'Eko Prasetyo',
        customerInitials: 'EP',
        customerPhone: '+62 816 7890',
        avatarBg: '#ede9fe',
        avatarText: '#6d28d9',
        rating: 3,
        date: '22 Okt 2023, 14:20',
        orderCode: '#ORD-9078',
        service: 'Cuci Kering',
        weight: '6 kg',
        comment:
            'Biasa aja sih, sesuai harga. Tidak ada yang spesial tapi juga tidak ada yang mengecewakan. Mungkin akan coba cabang lain untuk perbandingan.',
    },
    {
        id: 'rv-6',
        customerName: 'Fitriani',
        customerInitials: 'FT',
        customerPhone: '+62 817 8901',
        avatarBg: '#fce7f3',
        avatarText: '#be185d',
        rating: 5,
        date: '21 Okt 2023, 20:00',
        orderCode: '#ORD-9077',
        service: 'Cuci + Setrika',
        weight: '3.5 kg',
        comment:
            'Sudah langganan di sini lebih dari 6 bulan. Konsisten bagus! Kak Ahmad selalu ramah dan pakaian selalu bersih dan wangi. Harga juga terjangkau.',
    },
];

export function findBranch(id: string): Branch | undefined {
    return BRANCHES.find((b) => b.id === id);
}
