'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Phone } from 'lucide-react';

import BranchTopBar from '@/components/ui/branch/BranchTopBar';
import { AVATAR_TONES } from '@/components/ui/branch/avatarTones';
import {
    adminApi,
    getApiErrorMessage,
    getCurrentCabangId,
    type AdminPegawai,
} from '@/lib/api';
import { avatarToneFor, initialsOf } from '@/components/ui/branch/format';

export default function BranchStaffPage() {
    const cabangId = useMemo(() => getCurrentCabangId(), []);
    const [pegawai, setPegawai] = useState<AdminPegawai[]>([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cabangId == null) {
            setError('Sesi cabang tidak ditemukan.');
            return;
        }
        const controller = new AbortController();
        adminApi
            .listPegawai(cabangId, controller.signal)
            .then((rows) => {
                setPegawai(rows);
                setError(null);
            })
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            });
        return () => controller.abort();
    }, [cabangId]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return pegawai;
        return pegawai.filter(
            (p) =>
                p.nama.toLowerCase().includes(q) ||
                p.email.toLowerCase().includes(q) ||
                p.noTelp.toLowerCase().includes(q),
        );
    }, [pegawai, search]);

    return (
        <>
            <BranchTopBar title="Staffs" branchName={`Branch #${cabangId ?? '-'}`} />

            <div className="flex w-full flex-col gap-6 px-10 pt-10 pb-10">
                <div className="flex flex-col gap-1">
                    <span className="text-[14px] leading-5 font-medium text-[#3e4947]">Branch Personnel</span>
                    <h3 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-[#181c1c]">
                        Staff Management
                    </h3>
                </div>

                {error && (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}

                <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white">
                    <div className="flex h-[76px] items-center justify-between border-b border-[#e0e3e1] px-6">
                        <h4 className="text-[20px] leading-7 font-semibold text-[#181c1c]">Staff List</h4>
                        <div className="flex w-[256px] items-center gap-[13px] rounded-[8px] border border-[#bdc9c6] bg-[#f7faf8] px-[17px] py-[9px]">
                            <Search size={12} className="shrink-0 text-[#6b7280]" />
                            <input
                                type="text"
                                placeholder="Search Staff"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent text-[14px] text-[#181c1c] outline-none placeholder:text-[#6b7280]"
                            />
                        </div>
                    </div>

                    <div className="w-full overflow-auto">
                        <div className="flex w-full border-b border-[#bdc9c6] bg-[#f1f4f3]">
                            <HeaderCell width="w-[256px]">Staff Name</HeaderCell>
                            <HeaderCell width="w-[256px]">Email</HeaderCell>
                            <HeaderCell width="w-[256px]">Phone Number</HeaderCell>
                            <HeaderCell width="flex-1">Address</HeaderCell>
                        </div>

                        <div className="flex w-full flex-col">
                            {filtered.length === 0 && (
                                <div className="flex w-full justify-center py-10 text-[14px] text-[#3e4947]">
                                    Tidak ada pegawai.
                                </div>
                            )}
                            {filtered.map((member) => {
                                const tone = avatarToneFor(member.id);
                                return (
                                    <div
                                        key={member.id}
                                        className="flex h-[52px] w-full items-center border-b border-[#e0e3e1] last:border-b-0"
                                    >
                                        <div className="flex w-[256px] items-center gap-3 px-[15px]">
                                            <div
                                                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] leading-4 font-semibold ${AVATAR_TONES[tone]}`}
                                            >
                                                {initialsOf(member.nama)}
                                            </div>
                                            <span className="text-[14px] leading-5 font-medium text-[#181c1c]">
                                                {member.nama}
                                            </span>
                                        </div>
                                        <div className="flex w-[256px] px-[15px]">
                                            <span className="truncate text-[14px] leading-5 text-[#3e4947]">
                                                {member.email}
                                            </span>
                                        </div>
                                        <div className="flex w-[256px] items-center gap-2 px-[15px]">
                                            <Phone size={12} className="shrink-0 text-[#3e4947]" />
                                            <span className="text-[13px] leading-5 text-[#3e4947]">{member.noTelp}</span>
                                        </div>
                                        <div className="flex flex-1 px-[15px]">
                                            <span className="text-[13px] leading-5 text-[#3e4947]">
                                                {member.alamat}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
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
