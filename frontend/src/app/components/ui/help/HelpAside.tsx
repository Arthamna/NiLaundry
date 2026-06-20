import React from 'react';
import { MessageCircle, Phone, Mail, ChevronRight, Headset, Send, Video, BookOpen, FileText, ExternalLink } from 'lucide-react';

interface ContactItem {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    subtitle: string;
    badge?: string;
}

const CONTACTS: ContactItem[] = [
    { icon: <MessageCircle size={15} className="text-[#0f766e]" />, iconBg: 'bg-[#f0fdfa]', title: 'Live Chat', subtitle: 'Respons < 5 menit', badge: 'Online' },
    { icon: <Phone size={15} className="text-[#2563eb]" />, iconBg: 'bg-[#eff6ff]', title: 'Telepon', subtitle: 'Senin–Sabtu 08–21' },
    { icon: <Mail size={15} className="text-[#7c3aed]" />, iconBg: 'bg-[#f5f3ff]', title: 'Email', subtitle: 'Respons 1×24 jam' },
];

interface ResourceItem {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    subtitle: string;
}

const RESOURCES: ResourceItem[] = [
    { icon: <Video size={13} className="text-[#e11d48]" />, iconBg: 'bg-[#fff1f2]', title: 'Video Tutorial', subtitle: '24 video panduan' },
    { icon: <BookOpen size={13} className="text-[#d97706]" />, iconBg: 'bg-[#fffbeb]', title: 'Panduan Pengguna', subtitle: 'Dokumentasi lengkap' },
    { icon: <FileText size={13} className="text-[#2563eb]" />, iconBg: 'bg-[#eff6ff]', title: 'Kebijakan Layanan', subtitle: 'SLA & garansi' },
];

export default function HelpAside() {
    return (
        <div className="flex w-[412px] shrink-0 flex-col gap-[20px]">
            {/* Contact card */}
            <div className="rounded-[12.75px] border border-[#bdc9c6] bg-white p-[15px]">
                <h3 className="text-[12.25px] leading-[17.5px] font-bold text-[#0f172b]">Hubungi Kami</h3>
                <div className="flex flex-col gap-[7px] pt-[10.5px]">
                    {CONTACTS.map(({ icon, iconBg, title, subtitle, badge }) => (
                        <button key={title} type="button" className="flex items-center gap-[10.5px] rounded-[8.75px] p-[10.5px] text-left transition-colors hover:bg-[#f8fafc]">
                            <div className={`flex size-[28px] shrink-0 items-center justify-center rounded-[8.75px] ${iconBg}`}>{icon}</div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10.5px] leading-[14px] font-semibold text-[#1d293d]">{title}</p>
                                <p className="text-[10px] leading-[15px] font-medium text-[#90a1b9]">{subtitle}</p>
                            </div>
                            {badge && (
                                <span className="rounded-full bg-[#dcfce7] px-[7px] py-[1.75px] text-[9px] leading-[13.5px] font-bold text-[#16a34a]">
                                    {badge}
                                </span>
                            )}
                            <ChevronRight size={13} className="shrink-0 text-[#90a1b9]" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Support ticket card */}
            <div className="rounded-[12.75px] bg-[linear-gradient(162.488deg,#0f766e_0%,#134e4a_100%)] p-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-[7px]">
                    <Headset size={14} className="shrink-0 text-[#96f7e4]" />
                    <span className="text-[10.5px] leading-[14px] font-semibold text-[#96f7e4]">Tidak menemukan solusi?</span>
                </div>
                <p className="pt-[3.5px] text-[12.25px] leading-[17.5px] font-bold text-white">Kirim tiket ke tim support kami</p>
                <p className="pt-[10.5px] text-[10.5px] leading-[14px] text-[rgba(203,251,241,0.7)]">
                    Kami akan membantu Anda dalam 1×24 jam kerja.
                </p>
                <div className="flex flex-col items-center pt-[14px]">
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-[7px] rounded-[8.75px] bg-white py-[7px] transition-transform hover:scale-[1.02]"
                    >
                        <Send size={13} className="text-[#0f766e]" />
                        <span className="text-[10.5px] leading-[14px] font-bold text-[#0f766e]">Buat Tiket Bantuan</span>
                    </button>
                </div>
            </div>

            {/* Resources card */}
            <div className="rounded-[12.75px] border border-[#bdc9c6] bg-white p-[15px]">
                <h3 className="text-[12.25px] leading-[17.5px] font-bold text-[#0f172b]">Sumber Daya</h3>
                <div className="flex flex-col gap-[7px] pt-[10.5px]">
                    {RESOURCES.map(({ icon, iconBg, title, subtitle }) => (
                        <button key={title} type="button" className="flex items-center gap-[10.5px] rounded-[8.75px] p-[8.75px] text-left transition-colors hover:bg-[#f8fafc]">
                            <div className={`flex size-[24.5px] shrink-0 items-center justify-center rounded-[6.75px] ${iconBg}`}>{icon}</div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10.5px] leading-[14px] font-semibold text-[#1d293d]">{title}</p>
                                <p className="text-[10px] leading-[15px] font-medium text-[#90a1b9]">{subtitle}</p>
                            </div>
                            <ExternalLink size={12} className="shrink-0 text-[#90a1b9]" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
