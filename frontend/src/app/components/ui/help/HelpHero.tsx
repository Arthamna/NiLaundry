import React from 'react';
import { Sparkles, Search } from 'lucide-react';

interface HeroStat {
    value: string;
    label: string;
}

const STATS: HeroStat[] = [
    { value: '47', label: 'Artikel' },
    { value: '<2j', label: 'Respons avg' },
    { value: '98%', label: 'Terpecahkan' },
];

export default function HelpHero() {
    return (
        <div className="relative h-[216px] w-full overflow-hidden rounded-[14px] bg-[linear-gradient(168.577deg,#0f766e_0%,#134e4a_100%)]">
            {/* Decorative blobs */}
            <div className="absolute right-[-42px] top-[-42px] size-[168px] rounded-full bg-[#5eead4] opacity-10" />
            <div className="absolute left-[436px] top-[104px] size-[112px] rounded-full bg-white opacity-5" />

            {/* Left content */}
            <div className="absolute left-[28px] top-[35px] flex max-w-[504px] flex-col gap-[14px]">
                <div className="flex items-center gap-[7px]">
                    <Sparkles size={20} className="text-[#96f7e4]" />
                    <span className="text-[12.25px] leading-[17.5px] font-medium text-[#96f7e4]">Pusat Bantuan NiLaundry</span>
                </div>
                <h2 className="text-[26.25px] leading-[31.5px] font-bold text-white">Ada yang bisa kami bantu?</h2>
                <p className="text-[12.25px] leading-[17.5px] text-[rgba(203,251,241,0.8)]">
                    Cari jawaban dari ratusan artikel bantuan kami
                </p>
                <div className="flex w-[392px] max-w-full items-center gap-[7px] rounded-[12.75px] bg-[rgba(255,255,255,0.15)] px-[14px] py-[8.75px]">
                    <Search size={16} className="shrink-0 text-white/70" />
                    <input
                        type="text"
                        placeholder="Cari artikel, FAQ, atau topik bantuan…"
                        className="w-full bg-transparent text-[12.25px] leading-[17.5px] text-white placeholder:text-[rgba(255,255,255,0.5)] outline-none"
                    />
                </div>
            </div>

            {/* Right stats */}
            <div className="absolute right-[24px] top-[20px] flex w-[90px] flex-col gap-[7px]">
                {STATS.map(({ value, label }) => (
                    <div key={label} className="flex flex-col items-center rounded-[12.75px] bg-[rgba(255,255,255,0.1)] px-[14px] py-[7px]">
                        <p className="text-[15.75px] leading-[24.5px] font-bold text-white">{value}</p>
                        <p className="text-[10px] leading-[15px] text-[rgba(150,247,228,0.7)]">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
