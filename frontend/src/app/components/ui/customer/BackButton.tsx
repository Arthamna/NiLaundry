'use client';

import React from 'react';
import Link from 'next/link';

interface BackButtonProps {
    href: string;
    label?: string;
    /**
     * When provided, the button intercepts the click and runs this handler
     * instead of navigating via <Link>. Used by the payment page so it can
     * await the order cancel before leaving (otherwise the next page
     * re-fetches the order before the cancel commits and it still reads as
     * active). The handler owns navigation; `href` is the no-JS fallback.
     */
    onClick?: () => void;
    disabled?: boolean;
}

const BUTTON_CLASS =
    'inline-flex h-[40px] w-fit items-center justify-center self-start rounded-full bg-[#f41313] px-[12px] py-[5px] text-[16px] leading-[16.5px] font-semibold text-white disabled:opacity-60';

export default function BackButton({ href, label = '<- Kembali', onClick, disabled }: BackButtonProps) {
    if (onClick) {
        return (
            <button type="button" onClick={onClick} disabled={disabled} className={BUTTON_CLASS}>
                {label}
            </button>
        );
    }
    return (
        <Link href={href} className={BUTTON_CLASS}>
            {label}
        </Link>
    );
}
