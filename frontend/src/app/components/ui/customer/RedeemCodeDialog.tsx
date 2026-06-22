'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { redeemVoucher } from '@/lib/vouchers';

export default function RedeemCodeDialog() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

    const close = () => router.push('/customer/vouchers');

    const handleRedeem = async () => {
        if (submitting || code.trim().length === 0) return;
        setSubmitting(true);
        setResult(null);
        const res = await redeemVoucher('', code);
        setSubmitting(false);
        setResult({ ok: res.success, message: res.message });
        // Only leave the dialog when the claim succeeded; the vouchers page
        // re-fetches owned vouchers on mount, so the new code shows up there.
        if (res.success) {
            router.push('/customer/vouchers');
        }
    };

    const canSubmit = !submitting && code.trim().length > 0;

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(24,28,28,0.4)] backdrop-blur-[2px]"
            onClick={close}
            role="presentation"
        >
            <div
                className="flex w-[400px] flex-col overflow-hidden rounded-[16px] border border-[#bdc9c6] bg-white"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="redeem-code-title"
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-[#bdc9c6] bg-[#f7faf8] px-[24px] pt-[16px] pb-[17px]">
                    <h2
                        id="redeem-code-title"
                        className="text-[20px] leading-[28px] font-semibold text-[#181c1c]"
                    >
                        Redeem Code
                    </h2>
                    <button
                        type="button"
                        onClick={close}
                        className="flex items-center justify-center rounded-full p-[4px] text-[#3e4947] transition-colors hover:bg-[#ebefed]"
                        aria-label="Close"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="flex flex-col gap-3 bg-[#f7faf8] p-[24px]">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            if (result) setResult(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRedeem();
                        }}
                        placeholder="XXXX-XXXX-XXXX"
                        className="w-full rounded-[6px] border border-[#bdc9c6] bg-white p-[13px] text-center text-[11px] leading-[16.5px] text-[#181c1c] placeholder:text-[#6e7977] focus:border-[#009689] focus:outline-none"
                    />
                    {result && (
                        <p
                            role={result.ok ? 'status' : 'alert'}
                            className={`text-[12px] leading-4 ${result.ok ? 'text-[#00776a]' : 'text-[#ba1a1a]'}`}
                        >
                            {result.message}
                        </p>
                    )}
                </div>

                {/* Drawer Footer (Actions) */}
                <div className="flex items-center justify-end gap-[8px] border-t border-[#bdc9c6] bg-[#f7faf8] px-[24px] pt-[17px] pb-[16px]">
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-[8px] px-[17px] py-[9px] text-[14px] leading-[20px] font-medium text-[#3e4947] transition-colors hover:bg-[#ebefed]"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleRedeem}
                        disabled={!canSubmit}
                        className="rounded-[8px] bg-[#005c55] px-[16px] pt-[8.5px] pb-[9.5px] text-[14px] leading-[20px] font-medium text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#004f49] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? 'Redeeming…' : 'Redeem'}
                    </button>
                </div>
            </div>
        </div>
    );
}
