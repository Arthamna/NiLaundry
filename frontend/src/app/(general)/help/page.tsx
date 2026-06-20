import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import HelpHero from '@/components/ui/help/HelpHero';
import FaqAccordion from '@/components/ui/help/FaqAccordion';
import HelpAside from '@/components/ui/help/HelpAside';

const FAQ_SECTIONS = [
    {
        title: 'Pertanyaan Umum — Pemesanan & Layanan',
        questions: [
            'Berapa lama estimasi pengerjaan laundry reguler?',
            'Bisakah saya menambahkan item setelah pesanan dibuat?',
            'Apa yang terjadi jika pakaian saya rusak saat proses laundry?',
            'Apakah bisa laundry khusus untuk pakaian tertentu?',
        ],
    },
    {
        title: 'Pertanyaan Umum — Pembayaran',
        questions: [
            'Apakah bisa bayar setelah laundry selesai?',
            'Apakah QRIS selalu tersedia?',
            'Bagaimana jika pembayaran gagal atau terpotong ganda?',
        ],
    },
    {
        title: 'Pertanyaan Umum — Pengiriman & Kurir',
        questions: [
            'Berapa radius area penjemputan?',
            'Bisa minta penjemputan pada hari yang sama?',
            'Bagaimana jika kurir tidak datang sesuai jadwal?',
        ],
    },
    {
        title: 'Pertanyaan Umum — Voucher & Promo',
        questions: [
            'Bisakah menggunakan lebih dari satu voucher sekaligus?',
            'Voucher saya tidak bisa digunakan, kenapa?',
            'Bagaimana cara mendapatkan voucher gratis?',
        ],
    },
    {
        title: 'Pertanyaan Umum — Akun & Profil',
        questions: [
            'Bagaimana cara mengganti nomor HP yang terdaftar?',
            'Apakah akun bisa digunakan di beberapa perangkat?',
        ],
    },
    {
        title: 'Pertanyaan Umum — Teknis & Aplikasi',
        questions: [
            'Kenapa halaman loading sangat lama?',
            'Data pesanan saya hilang setelah update, apa yang harus dilakukan?',
        ],
    },
];

export default function HelpPage() {
    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name="Sarah Jenkins" activeVouchers={3} />

            <div className="flex flex-col gap-[20px]">
                <HelpHero />

                <div className="flex items-start justify-between gap-[20px]">
                    <div className="flex flex-1 flex-col gap-[10px]">
                        {FAQ_SECTIONS.map(({ title, questions }) => (
                            <FaqAccordion key={title} title={title} questions={questions} />
                        ))}
                    </div>
                    <HelpAside />
                </div>
            </div>
        </div>
    );
}
