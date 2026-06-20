import AuthBrandPanel from '@/components/ui/auth/AuthBrandPanel';
import RegisterForm from '@/components/ui/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen bg-white">
            <AuthBrandPanel
                titleLines={['Bergabung', 'bersama kami!']}
                description="Daftarkan akun Anda dan nikmati kemudahan mengelola laundry setiap hari."
                features={[
                    'Kelola pesanan laundry kapan saja',
                    'Notifikasi real-time status cucian',
                    'Voucher & promo eksklusif member',
                    'Riwayat transaksi lengkap',
                ]}
            />
            <section className="flex flex-1 flex-col items-center justify-center bg-[#f8fafc] px-8 py-12">
                <RegisterForm />
            </section>
        </main>
    );
}
