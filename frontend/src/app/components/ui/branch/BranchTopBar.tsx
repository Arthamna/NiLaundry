'use client';

import React, { useEffect, useState } from 'react';
import { getCurrentCabangNama } from '@/lib/api';

interface BranchTopBarProps {
    title: string;
    /** Fallback label shown only until the branch name resolves from session. */
    branchName?: string;
}

export default function BranchTopBar({ title, branchName }: BranchTopBarProps) {
    // Read nama_cabang after mount: localStorage isn't available during SSR, so
    // deferring avoids a hydration mismatch on the branch label.
    const [cabangNama, setCabangNama] = useState<string | null>(null);
    useEffect(() => {
        setCabangNama(getCurrentCabangNama());
    }, []);

    const label = cabangNama ?? branchName ?? 'Branch';

    return (
        <header className="sticky top-0 z-10 flex h-[72px] w-full items-center justify-between border-b border-[#e0e3e1] bg-[rgba(247,250,248,0.8)] px-10 backdrop-blur-[6px]">
            <h2 className="text-[24px] leading-8 font-semibold tracking-[-0.6px] text-[#181c1c]">{title}</h2>
            <div className="rounded-[100px] border border-[#bdc9c6] px-3">
                <span className="text-[13px] leading-8 tracking-[-0.6px] text-black">{label}</span>
            </div>
        </header>
    );
}
