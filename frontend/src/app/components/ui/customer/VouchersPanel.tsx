'use client';

import React from 'react';
import Link from 'next/link';
import { Ticket, Plus } from 'lucide-react';

interface Voucher {
    id?: number;
    code: string;
    title: string;
    description: string;
    expiresIn: string;
}

interface VouchersPanelProps {
    vouchers: Voucher[];
    onUse?: (id: number) => void;
    onAdd?: () => void;
}

const schemes = [
    {
        card: 'bg-[rgba(0,119,106,0.1)] border-[rgba(0,92,82,0.2)]',
        title: 'text-[#005c52]',
        desc: 'text-[#005047]',
        badge: 'border-[rgba(0,92,82,0.3)] text-[#005c52]',
        button: 'bg-[#005c52]',
    },
    {
        card: 'bg-[rgba(109,245,225,0.1)] border-[rgba(0,107,95,0.2)]',
        title: 'text-[#006b5f]',
        desc: 'text-[#005048]',
        badge: 'border-[rgba(0,107,95,0.3)] text-[#006b5f]',
        button: 'bg-[#006b5f]',
    },
];

export default function VouchersPanel({ vouchers, onUse, onAdd }: VouchersPanelProps) {
    return (
        <div className="flex flex-col gap-6 rounded-[12px] border border-[#bdc9c6] bg-white p-[25px]">
            <h3 className="flex items-center gap-2 text-[21px] leading-7 font-semibold text-[#181c1c]">
                <Ticket size={20} className="text-[#005c55]" /> My Vouchers
            </h3>

            <div className="flex flex-col gap-4">
                {vouchers.map((v, i) => {
                    const s = schemes[i % schemes.length];
                    return (
                        <div
                            key={v.code}
                            className={`relative flex flex-col gap-6 overflow-hidden rounded-[12px] border p-[17px] ${s.card}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-1">
                                    <h4 className={`text-[15px] leading-5 font-bold ${s.title}`}>{v.title}</h4>
                                    <p className={`text-[15px] leading-5 ${s.desc}`}>{v.description}</p>
                                </div>
                                <span className={`rounded border bg-white px-[9px] py-[5px] text-[11px] leading-[15px] font-bold ${s.badge}`}>
                                    {v.code}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] leading-[15px] text-[#6e7977]">{v.expiresIn}</p>
                                <button
                                    onClick={() => v.id != null && onUse?.(v.id)}
                                    className={`rounded-lg px-4 py-2 text-[13px] leading-4 font-semibold tracking-[0.6px] text-white ${s.button}`}
                                    aria-label="Use Voucher"
                                >
                                    Use Now
                                </button>
                            </div>
                        </div>
                    );
                })}

                <Link
                    href="/customer/vouchers/add"
                    onClick={onAdd}
                    className="flex w-full items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#bdc9c6] px-0.5 py-2.5 text-[15px] leading-5 font-medium text-[#6e7977] transition-colors hover:border-[#009689] hover:text-[#009689]"
                    aria-label="Add Voucher Code"
                >
                    <Plus size={14} /> Add Voucher Code
                </Link>
            </div>
        </div>
    );
}
