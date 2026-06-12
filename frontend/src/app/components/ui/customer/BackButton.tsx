'use client';

import React from 'react';
import Link from 'next/link';

interface BackButtonProps {
    href: string;
    label?: string;
}

export default function BackButton({ href, label = '<- Kembali' }: BackButtonProps) {
    return (
        <Link
            href={href}
            className="inline-flex h-[40px] w-fit items-center justify-center self-start rounded-full bg-[#f41313] px-[12px] py-[5px] text-[16px] leading-[16.5px] font-semibold text-white"
        >
            {label}
        </Link>
    );
}
