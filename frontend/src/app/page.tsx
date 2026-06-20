import Link from 'next/link';
import { WashingMachine, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(144.583deg,#0f766e_0%,#134e4a_60%,#0c3a37_100%)]">
            {/* Decorative blobs */}
            <div className="absolute left-[-112px] top-[-112px] size-[336px] rounded-full bg-[#5eead4] opacity-10" />
            <div className="absolute bottom-[-80px] right-[-120px] size-[280px] rounded-full bg-[#99f6e4] opacity-10" />
            <div className="absolute right-[120px] top-[196px] size-[168px] rounded-full bg-[#ccfbf1] opacity-5" />
            <div className="absolute left-[259px] top-[764px] size-[72px] rounded-full bg-[#ccfbf1] opacity-5" />
            {/* Decorative dots */}
            <div className="absolute left-[11%] top-[18%] size-[6px] rounded-full bg-white/15" />
            <div className="absolute left-[23%] top-[34%] size-[12px] rounded-full bg-white/15" />
            <div className="absolute left-[35%] top-[51%] size-[18px] rounded-full bg-white/15" />
            <div className="absolute left-[59%] top-[18%] size-[12px] rounded-full bg-white/15" />
            <div className="absolute left-[71%] top-[34%] size-[18px] rounded-full bg-white/15" />
            <div className="absolute left-[83%] top-[51%] size-[6px] rounded-full bg-white/15" />
            <div className="absolute left-[95%] top-[67%] size-[12px] rounded-full bg-white/15" />

            {/* Centered content */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-[64px] px-6">
                <div className="flex items-center gap-[20px]">
                    <Link
                        href="/"
                        aria-label="NiLaundry beranda"
                        className="flex size-[104px] shrink-0 items-center justify-center rounded-[24px] bg-white/10 text-white backdrop-blur-sm transition-transform hover:scale-105"
                    >
                        <WashingMachine size={56} />
                    </Link>
                    <div className="flex flex-col items-start">
                        <p className="text-[52px] leading-[64px] font-extrabold text-[#e2e8f0]">NiLaundry</p>
                        <p className="w-[300px] text-[20px] leading-[28px] tracking-[1.6px] text-white">
                            Standar Bersih Sempurna, Langsung di Depan Pintu.
                        </p>
                    </div>
                </div>

                <Link
                    href="/login"
                    className="flex items-center justify-center gap-[8px] rounded-[10px] bg-white px-[32px] py-[14px] text-[15px] leading-[22px] font-semibold text-[#0f172b] drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)] transition-transform hover:scale-105"
                >
                    Mulai Sekarang <ArrowRight size={18} />
                </Link>
            </div>
        </main>
    );
}
