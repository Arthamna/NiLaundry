import AuthBrandPanel from '@/components/ui/auth/AuthBrandPanel';
import LoginForm from '@/components/ui/auth/LoginForm';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen bg-white">
            <AuthBrandPanel
                showBadge
                titleLines={['Selamat datang', 'kembali!']}
                description="Platform manajemen laundry terpadu untuk tim Anda — dari pemesanan hingga pengiriman."
                stats={[
                    { value: '1.2K+', label: 'Pesanan/hari' },
                    { value: '98%', label: 'Kepuasan' },
                    { value: '5 Cab', label: 'Cabang aktif' },
                ]}
            />
            <section className="flex flex-1 flex-col items-center justify-center bg-[#f8fafc] px-8 py-12">
                <LoginForm />
            </section>
        </main>
    );
}
