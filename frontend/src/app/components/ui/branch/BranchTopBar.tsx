import React from 'react';

interface BranchTopBarProps {
    title: string;
    branchName: string;
}

export default function BranchTopBar({ title, branchName }: BranchTopBarProps) {
    return (
        <header className="sticky top-0 z-10 flex h-[72px] w-full items-center justify-between border-b border-[#e0e3e1] bg-[rgba(247,250,248,0.8)] px-10 backdrop-blur-[6px]">
            <h2 className="text-[24px] leading-8 font-semibold tracking-[-0.6px] text-[#181c1c]">{title}</h2>
            <div className="rounded-[100px] border border-[#bdc9c6] px-3">
                <span className="text-[13px] leading-8 tracking-[-0.6px] text-black">{branchName}</span>
            </div>
        </header>
    );
}
