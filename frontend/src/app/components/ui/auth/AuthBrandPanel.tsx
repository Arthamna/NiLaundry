import React from 'react';
import Link from 'next/link';
import { WashingMachine, CheckCircle2 } from 'lucide-react';

export interface BrandStat {
    value: string;
    label: string;
}

interface AuthBrandPanelProps {
    /** Heading lines, rendered stacked. */
    titleLines: string[];
    description: string;
    /** Stat blocks (login). Mutually exclusive with `features`. */
    stats?: BrandStat[];
    /** Feature checklist (register). Mutually exclusive with `stats`. */
    features?: string[];
    /** Shows the large logo badge above the heading (login only). */
    showBadge?: boolean;
}

export default function AuthBrandPanel({ titleLines, description, stats, features, showBadge = false }: AuthBrandPanelProps) {
    return (
        <aside className="relative hidden w-[45%] shrink-0 overflow-hidden bg-[linear-gradient(134.718deg,#0f766e_6.17%,#134e4a_54.38%,#0c3a37_93.83%)] lg:block">
            {/* Decorative blobs */}
            <div className="absolute left-[-110px] top-[-110px] size-[320px] rounded-full bg-[#5eead4] opacity-10" />
            <div className="absolute bottom-[-80px] right-[-40px] size-[300px] rounded-full bg-[#99f6e4] opacity-10" />
            <div className="absolute left-[14%] top-[28%] size-[10px] rounded-full bg-white/10" />
            <div className="absolute left-[30%] top-[41%] size-[20px] rounded-full bg-white/10" />
            <div className="absolute left-[45%] top-[56%] size-[30px] rounded-full bg-white/10" />
            <div className="absolute left-[60%] top-[29%] size-[10px] rounded-full bg-white/10" />
            <div className="absolute left-[75%] top-[41%] size-[20px] rounded-full bg-white/10" />

            {/* Top-left brand — links to landing page */}
            <Link href="/" aria-label="NiLaundry beranda" className="absolute left-[54px] top-[54px] flex items-center gap-[12px]">
                <div className="flex size-[58px] items-center justify-center rounded-[14px] bg-white/10 text-white backdrop-blur-sm transition-transform hover:scale-105">
                    <WashingMachine size={30} />
                </div>
                <p className="text-[29px] leading-[40px] font-extrabold text-[#e2e8f0]">NiLaundry</p>
            </Link>

            {/* Centered content */}
            <div className="absolute left-[54px] right-[54px] top-1/2 flex max-w-[640px] -translate-y-1/2 flex-col items-start gap-[28px]">
                {showBadge && (
                    <div className="flex size-[72px] items-center justify-center rounded-[18px] bg-white/10 text-white backdrop-blur-sm">
                        <WashingMachine size={38} />
                    </div>
                )}

                <div className="flex flex-col items-start">
                    <h2 className="text-[40px] leading-[48px] font-bold text-white">
                        {titleLines.map((line, i) => (
                            <React.Fragment key={line}>
                                {i > 0 && <br />}
                                {line}
                            </React.Fragment>
                        ))}
                    </h2>
                    <p className="pt-[14px] text-[18px] leading-[28px] text-[rgba(203,251,241,0.8)]">{description}</p>
                </div>

                {stats && (
                    <div className="flex items-start gap-[28px] pt-[10px]">
                        {stats.map(({ value, label }) => (
                            <div key={label} className="flex flex-col items-start gap-[2px]">
                                <p className="text-[28px] leading-[36px] font-bold text-white">{value}</p>
                                <p className="text-[13px] leading-[18px] text-[rgba(150,247,228,0.7)]">{label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {features && (
                    <ul className="flex flex-col items-start gap-[14px] pt-[7px]">
                        {features.map((feature) => (
                            <li key={feature} className="flex items-center gap-[14px]">
                                <CheckCircle2 size={22} className="shrink-0 text-[#5eead4]" />
                                <span className="text-[15px] leading-[22px] text-[#cbfbf1]">{feature}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer */}
            <p className="absolute bottom-[40px] left-[54px] text-[13px] leading-[18px] text-[rgba(150,247,228,0.5)]">
                © 2026 NiLaundry. Hak cipta dilindungi.
            </p>
        </aside>
    );
}
