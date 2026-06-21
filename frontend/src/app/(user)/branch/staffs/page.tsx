import React from 'react';
import { Search, Phone } from 'lucide-react';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import { AVATAR_TONES, AvatarTone } from '@/components/ui/branch/avatarTones';

interface StaffMember {
    id: string;
    initials: string;
    avatarTone: AvatarTone;
    name: string;
    role: string;
    phone: string;
    address: string;
}

const STAFF: StaffMember[] = [
    { id: '1', initials: 'AF', avatarTone: 'mint', name: 'Ahmad Fauzi', role: 'Kasir', phone: '+62 812-3456-7890', address: 'Jalan Keputih Perlimaan' },
    { id: '2', initials: 'SR', avatarTone: 'blue', name: 'Siti Rahayu', role: 'Operator', phone: '+62 813-4567-8901', address: 'Jalan Keputih Perlimaan' },
    { id: '3', initials: 'BS', avatarTone: 'amber', name: 'Budi Santoso', role: 'Operator', phone: '+62 814-5678-9012', address: 'Jalan Keputih Perlimaan' },
    { id: '4', initials: 'DK', avatarTone: 'gray', name: 'Dewi Kusuma', role: 'Kasir', phone: '+62 815-6789-0123', address: 'Jalan Keputih Perlimaan' },
    { id: '5', initials: 'EP', avatarTone: 'purple', name: 'Eko Prasetyo', role: 'Driver', phone: '+62 816-7890-1234', address: 'Jalan Keputih Perlimaan' },
    { id: '6', initials: 'FT', avatarTone: 'pink', name: 'Fitriani', role: 'Driver', phone: '+62 817-8901-2345', address: 'Jalan Keputih Perlimaan' },
    { id: '7', initials: 'GW', avatarTone: 'green', name: 'Gunawan', role: 'Operator', phone: '+62 818-9012-3456', address: 'Jalan Keputih Perlimaan' },
];

export default function BranchStaffPage() {
    return (
        <>
            <BranchTopBar title="Staffs" branchName="Keputih Branch" />

            <div className="flex w-full flex-col gap-6 px-10 pt-10 pb-10">
                {/* Page header */}
                <div className="flex flex-col gap-1">
                    <span className="text-[14px] leading-5 font-medium text-[#3e4947]">Branch Personnel</span>
                    <h3 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                        Staff Management
                    </h3>
                </div>

                {/* Staff card */}
                <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white">
                    {/* Card header */}
                    <div className="flex h-[76px] items-center justify-between border-b border-[#e0e3e1] px-6">
                        <h4 className="text-[20px] leading-7 font-semibold text-[#181c1c]">Daftar Staff</h4>
                        <div className="flex w-[256px] items-center gap-[13px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                            <Search size={12} className="shrink-0 text-[#6b7280]" />
                            <input
                                type="text"
                                placeholder="Cari Staff"
                                className="w-full bg-transparent text-[14px] text-[#181c1c] outline-none placeholder:text-[#6b7280]"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="w-full overflow-auto">
                        {/* Header row */}
                        <div className="flex w-full border-b border-[#bdc9c6] bg-[#f1f4f3]">
                            <HeaderCell width="w-[256px]">Nama Staff</HeaderCell>
                            <HeaderCell width="w-[256px]">Email</HeaderCell>
                            <HeaderCell width="w-[256px]">Nomor Telepon</HeaderCell>
                            <HeaderCell width="flex-1">Alamat</HeaderCell>
                        </div>

                        {/* Body */}
                        <div className="flex w-full flex-col">
                            {STAFF.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex h-[52px] w-full items-center border-b border-[#e0e3e1] last:border-b-0"
                                >
                                    <div className="flex w-[256px] items-center gap-3 px-[15px]">
                                        <div
                                            className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] leading-4 font-semibold ${AVATAR_TONES[member.avatarTone]}`}
                                        >
                                            {member.initials}
                                        </div>
                                        <span className="text-[14px] leading-5 font-medium text-[#181c1c]">
                                            {member.name}
                                        </span>
                                    </div>
                                    <div className="flex w-[256px] px-[15px]">
                                        <span className="text-[14px] leading-5 text-[#3e4947]">{member.role}</span>
                                    </div>
                                    <div className="flex w-[256px] items-center gap-2 px-[15px]">
                                        <Phone size={12} className="shrink-0 text-[#3e4947]" />
                                        <span className="text-[13px] leading-5 text-[#3e4947]">{member.phone}</span>
                                    </div>
                                    <div className="flex flex-1 px-[15px]">
                                        <span className="text-[13px] leading-5 text-[#3e4947]">{member.address}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

function HeaderCell({ width, children }: { width: string; children: React.ReactNode }) {
    return (
        <div className={`flex ${width} items-center p-3`}>
            <span className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947]">{children}</span>
        </div>
    );
}
