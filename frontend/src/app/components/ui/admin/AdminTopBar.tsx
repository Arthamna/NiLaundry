import React from 'react';

interface AdminTopBarProps {
    title: string;
    /** Role pill shown on the right (e.g. "Super Admin"). */
    role?: string;
}

export default function AdminTopBar({ title, role = 'Super Admin' }: AdminTopBarProps) {
    return (
        <header className="sticky top-0 z-10 flex h-[72px] w-full items-center justify-between border-b border-[#e0e3e1] bg-[rgba(247,250,248,0.8)] px-10 backdrop-blur-[6px]">
            <h2 className="text-[24px] leading-8 font-semibold tracking-[-0.6px] text-[#181c1c]">{title}</h2>
            <div className="flex h-8 items-center justify-center rounded-[100px] border border-[#bdc9c6] px-4">
                <span className="text-[13px] leading-8 tracking-[-0.6px] text-black">{role}</span>
            </div>
        </header>
    );
}
