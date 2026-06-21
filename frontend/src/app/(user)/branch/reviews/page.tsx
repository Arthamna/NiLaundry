import React from 'react';
import { Star, Search, ChevronLeft, ChevronRight } from 'lucide-react';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import { AVATAR_TONES, AvatarTone } from '@/components/ui/branch/avatarTones';

interface ReviewItem {
    id: string;
    initials: string;
    avatarTone: AvatarTone;
    name: string;
    phone: string;
    orderId: string;
    service: string;
    weight: string;
    rating: number;
    text: string;
    date: string;
}

const SUMMARY = {
    average: 3.8,
    total: 12,
    // Exact Figma bar fills per star level (node 347:2662).
    distribution: [
        { stars: 5, count: 5, pct: 55, color: 'bg-[#0f766e]' },
        { stars: 4, count: 3, pct: 33, color: 'bg-[#6df5e1]' },
        { stars: 3, count: 2, pct: 22, color: 'bg-[#f59e0b]' },
        { stars: 2, count: 1, pct: 10, color: 'bg-[#f97316]' },
        { stars: 1, count: 1, pct: 10, color: 'bg-[#ef4444]' },
    ],
};

// "Per Bintang" monthly chart — approximated with CSS bars (design renders an SVG chart).
const PER_BINTANG = [
    { label: 'Jan', pct: 45 },
    { label: 'Feb', pct: 70 },
    { label: 'Mar', pct: 55 },
    { label: 'Apr', pct: 85 },
    { label: 'Mei', pct: 60 },
    { label: 'Jun', pct: 95 },
];

const REVIEWS: ReviewItem[] = [
    {
        id: '1',
        initials: 'AS',
        avatarTone: 'mint',
        name: 'Anita Smith',
        phone: '+62 812 3456',
        orderId: '#ORD-9082',
        service: 'Cuci + Setrika',
        weight: '3 kg',
        rating: 5.0,
        text: 'Pakaian bersih banget dan wangi! Pengirimannya tepat waktu sesuai estimasi. Pasti bakal order lagi bulan depan. Terima kasih NiLaundry Keputih!',
        date: '24 Okt 2023, 16:10',
    },
    {
        id: '2',
        initials: 'BK',
        avatarTone: 'teal',
        name: 'Budi Kurniawan',
        phone: '+62 819 8765',
        orderId: '#ORD-9081',
        service: 'Cuci Kering',
        weight: '5 kg',
        rating: 4.0,
        text: 'Pelayanannya ramah dan hasilnya lumayan bagus. Ada sedikit noda yang masih tersisa di kemeja putih saya, tapi secara keseluruhan sudah oke.',
        date: '23 Okt 2023, 11:30',
    },
    {
        id: '3',
        initials: 'CD',
        avatarTone: 'gray',
        name: 'Citra Dewi',
        phone: '+62 856 1122',
        orderId: '#ORD-9080',
        service: 'Cuci + Setrika',
        weight: '4 kg',
        rating: 2.0,
        text: 'Kecewa banget, pakaian saya selesai 2 jam lebih lambat dari jadwal. Udah ditunggu-tunggu dari tadi. Semoga ke depannya bisa lebih on-time.',
        date: '23 Okt 2023, 09:15',
    },
    {
        id: '4',
        initials: 'DL',
        avatarTone: 'pink',
        name: 'Dewi Lestari',
        phone: '+62 878 4321',
        orderId: '#ORD-9079',
        service: 'Laundry Ekspres',
        weight: '2 kg',
        rating: 5.0,
        text: 'Layanan ekspresnya keren banget! 3 jam sudah selesai dan hasilnya memuaskan. Lipatan bajunya rapi sekali, tidak ada yang kusut. Recommended!',
        date: '22 Okt 2023, 18:45',
    },
    {
        id: '5',
        initials: 'EP',
        avatarTone: 'purple',
        name: 'Eko Prasetyo',
        phone: '+62 816 7890',
        orderId: '#ORD-9078',
        service: 'Cuci Kering',
        weight: '6 kg',
        rating: 3.0,
        text: 'Biasa aja sih, sesuai harga. Tidak ada yang spesial tapi juga tidak ada yang mengecewakan. Mungkin akan coba cabang lain untuk perbandingan.',
        date: '22 Okt 2023, 14:20',
    },
    {
        id: '6',
        initials: 'FT',
        avatarTone: 'mint',
        name: 'Fitriani',
        phone: '+62 817 8901',
        orderId: '#ORD-9077',
        service: 'Cuci + Setrika',
        weight: '3.5 kg',
        rating: 5.0,
        text: 'Sudah langganan di sini lebih dari 6 bulan. Konsisten bagus! Kak Ahmad selalu ramah dan pakaian selalu bersih dan wangi. Harga juga terjangkau.',
        date: '21 Okt 2023, 20:00',
    },
];

const RATING_CHIPS = [5, 4, 3, 2, 1];
const SORT_OPTIONS = ['Terbaru', 'Tertinggi', 'Terendah'];

// Rating pill tint — exact Figma colors (node 347:2662).
function ratingTone(rating: number): { pill: string; text: string } {
    if (rating >= 4.5) return { pill: 'bg-[rgba(15,118,110,0.09)]', text: 'text-[#0f766e]' };
    if (rating >= 4.0) return { pill: 'bg-[rgba(20,184,166,0.09)]', text: 'text-[#14b8a6]' };
    if (rating >= 3.0) return { pill: 'bg-[rgba(245,158,11,0.09)]', text: 'text-[#f59e0b]' };
    if (rating >= 2.0) return { pill: 'bg-[rgba(249,115,22,0.09)]', text: 'text-[#f97316]' };
    return { pill: 'bg-[rgba(239,68,68,0.09)]', text: 'text-[#ef4444]' };
}

function StarRow({ rating, size, className }: { rating: number; size: number; className?: string }) {
    const filled = Math.round(rating);
    return (
        <div className="flex items-center gap-px">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={size}
                    className={n <= filled ? (className ?? 'fill-[#f59e0b] text-[#f59e0b]') : 'fill-[#cbd5e1] text-[#cbd5e1]'}
                />
            ))}
        </div>
    );
}

export default function BranchReviewsPage() {
    return (
        <>
            <BranchTopBar title="Reviews" branchName="Keputih Branch" />

            <div className="flex w-full flex-col gap-6 px-10 pt-10 pb-10">
                {/* Page header */}
                <div className="flex flex-col gap-1">
                    <span className="text-[14px] leading-5 font-medium text-[#3e4947]">Feedback Pelanggan</span>
                    <h3 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                        Ulasan Pelanggan
                    </h3>
                </div>

                {/* Summary row */}
                <div className="flex items-stretch gap-4">
                    {/* Average rating */}
                    <div className="flex w-[180px] shrink-0 flex-col items-center justify-center gap-2 rounded-[12px] border border-[#e2e8f0] bg-white px-[40px] py-[28px]">
                        <span className="text-[56px] leading-[56px] font-bold text-[#181c1c]">{SUMMARY.average}</span>
                        <StarRow rating={SUMMARY.average} size={18} />
                        <span className="text-[13px] leading-[18px] text-[#6e7977]">{SUMMARY.total} ulasan</span>
                    </div>

                    {/* Distribution */}
                    <div className="flex flex-1 flex-col gap-[10px] rounded-[12px] border border-[#e2e8f0] bg-white px-[28px] py-[24px]">
                        <span className="text-[14px] leading-5 font-medium text-[#181c1c]">Distribusi Rating</span>
                        <div className="flex flex-col gap-[10px]">
                            {SUMMARY.distribution.map((row) => (
                                <div key={row.stars} className="flex items-center gap-3">
                                    <div className="flex w-[48px] shrink-0 items-center gap-1">
                                        <span className="text-[13px] leading-5 text-[#3e4947]">{row.stars}</span>
                                        <Star size={11} className="fill-[#f59e0b] text-[#f59e0b]" />
                                    </div>
                                    <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#f1f4f3]">
                                        <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                                    </div>
                                    <span className="w-[24px] shrink-0 text-right text-[12px] leading-4 text-[#6e7977]">
                                        {row.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Per Bintang chart */}
                    <div className="flex w-[220px] shrink-0 flex-col gap-3 rounded-[12px] border border-[#e2e8f0] bg-white px-[24px] py-[20px]">
                        <span className="text-[14px] leading-5 font-medium text-[#181c1c]">Per Bintang</span>
                        <div className="flex h-[120px] items-end justify-between gap-2">
                            {PER_BINTANG.map((bar) => (
                                <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                                    <div
                                        className="w-full rounded-t-[4px] bg-[#0f766e]"
                                        style={{ height: `${bar.pct}%` }}
                                    />
                                    <span className="text-[11px] leading-4 text-[#6e7977]">{bar.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews panel */}
                <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white">
                    {/* Panel header */}
                    <div className="flex items-center justify-between border-b border-[#e0e3e1] px-6 py-[18px]">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[20px] leading-7 font-semibold text-[#181c1c]">Semua Ulasan</h3>
                            <span className="rounded-full bg-[#f1f4f3] px-2 py-0.5 text-[13px] leading-[18px] text-[#3e4947]">
                                {SUMMARY.total}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative w-[200px]">
                                <Search
                                    size={14}
                                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#6e7977]"
                                />
                                <input
                                    type="text"
                                    placeholder="Cari ulasan..."
                                    className="w-full rounded-[8px] border border-[#e0e3e1] bg-white py-2 pr-3 pl-9 text-[13px] text-[#181c1c] outline-none placeholder:text-[#6e7977]"
                                />
                            </div>

                            {/* Rating filter */}
                            <div className="flex items-center gap-1 rounded-[8px] bg-[#f1f4f3] p-1">
                                <button
                                    type="button"
                                    className="rounded-[6px] bg-white px-2 py-1 text-[12px] leading-4 font-medium text-[#181c1c] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.08)]"
                                >
                                    Semua
                                </button>
                                {RATING_CHIPS.map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        className="flex items-center gap-1 rounded-[6px] px-2 py-1 text-[12px] leading-4 font-medium text-[#3e4947]"
                                    >
                                        {n}
                                        <Star size={11} className="fill-[#f59e0b] text-[#f59e0b]" />
                                    </button>
                                ))}
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-1 rounded-[8px] bg-[#f1f4f3] p-1">
                                {SORT_OPTIONS.map((label, i) => (
                                    <button
                                        key={label}
                                        type="button"
                                        className={`rounded-[6px] px-2 py-1 text-[12px] leading-4 font-medium ${
                                            i === 0
                                                ? 'bg-white text-[#181c1c] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.08)]'
                                                : 'text-[#3e4947]'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-2">
                        {REVIEWS.map((review, index) => {
                            const tone = ratingTone(review.rating);
                            const isLastRow = index >= REVIEWS.length - (REVIEWS.length % 2 === 0 ? 2 : 1);
                            return (
                                <article
                                    key={review.id}
                                    className={`flex flex-col gap-[14px] px-6 pt-6 pb-[25px] ${index % 2 === 0 ? 'border-r border-[#e0e3e1]' : ''} ${
                                        isLastRow ? '' : 'border-b border-[#e0e3e1]'
                                    }`}
                                >
                                    {/* Top: avatar + name/phone | rating pill + date */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-[10px]">
                                            <div
                                                className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] leading-[18px] font-semibold ${AVATAR_TONES[review.avatarTone]}`}
                                            >
                                                {review.initials}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] leading-5 font-medium text-[#181c1c]">
                                                    {review.name}
                                                </span>
                                                <span className="text-[12px] leading-4 text-[#6e7977]">
                                                    {review.phone}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end gap-1 pl-3">
                                            <div className={`flex items-center gap-1 rounded-full px-2 py-[3px] ${tone.pill}`}>
                                                <Star size={12} className={`fill-current ${tone.text}`} />
                                                <span className={`text-[13px] leading-[18px] font-bold ${tone.text}`}>
                                                    {review.rating.toFixed(1)}
                                                </span>
                                            </div>
                                            <span className="text-[12px] leading-4 text-[#6e7977]">{review.date}</span>
                                        </div>
                                    </div>

                                    {/* Meta: order id + service + weight */}
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-[4px] bg-[#f1f4f3] px-2 py-0.5 text-[12px] leading-4 text-[#6e7977]">
                                            {review.orderId}
                                        </span>
                                        <span className="text-[12px] leading-4 text-[#3e4947]">·</span>
                                        <span className="text-[12px] leading-4 text-[#3e4947]">{review.service}</span>
                                        <span className="text-[12px] leading-4 text-[#3e4947]">·</span>
                                        <span className="text-[12px] leading-4 text-[#3e4947]">{review.weight}</span>
                                    </div>

                                    {/* Body text */}
                                    <p className="line-clamp-3 text-[14px] leading-5 text-[#3e4947]">{review.text}</p>
                                </article>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-[#bdc9c6] px-6 py-3">
                        <span className="text-[13px] leading-5 text-[#3e4947]">Menampilkan 1–6 dari 12 ulasan</span>
                        <div className="flex items-center gap-1">
                            <button type="button" className="flex items-center justify-center rounded-[4px] p-1 opacity-30" disabled>
                                <ChevronLeft size={14} className="text-[#3e4947]" />
                            </button>
                            <button
                                type="button"
                                className="flex size-7 items-center justify-center rounded-[4px] bg-[#0f766e] text-[12px] leading-4 font-semibold text-[#a3faef]"
                            >
                                1
                            </button>
                            <button
                                type="button"
                                className="flex size-7 items-center justify-center rounded-[4px] text-[12px] leading-4 font-semibold text-[#3e4947]"
                            >
                                2
                            </button>
                            <button type="button" className="flex items-center justify-center rounded-[4px] p-1">
                                <ChevronRight size={14} className="text-[#3e4947]" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
