'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PaymentMethod {
    id: string;
    label: string;
    src: string;
    width: number;
    height: number;
    imgClass: string;
}

const METHODS: PaymentMethod[] = [
    { id: 'qris', label: 'QRIS', src: '/payment/qris.png', width: 156, height: 57, imgClass: 'h-[40px]' },
    { id: 'gopay', label: 'GoPay', src: '/payment/gopay.png', width: 201, height: 45, imgClass: 'h-[26px]' },
    { id: 'mastercard', label: 'Mastercard', src: '/payment/mastercard.png', width: 97, height: 75, imgClass: 'h-[44px]' },
    { id: 'ovo', label: 'OVO', src: '/payment/ovo.png', width: 162, height: 51, imgClass: 'h-[30px]' },
];

export default function PaymentMethods() {
    const [selected, setSelected] = useState('qris');

    return (
        <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full items-center justify-between rounded-[12.75px] border-2 border-[#bdc9c6] bg-white px-[12.5px] py-[14px]">
                {METHODS.map((m) => {
                    const isSelected = selected === m.id;
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelected(m.id)}
                            aria-pressed={isSelected}
                            className={`flex h-[100px] w-[180px] items-center justify-center rounded-[4px] border py-[2px] pr-[2px] pl-[8px] transition-colors ${
                                isSelected ? 'border-[#018a7e]' : 'border-[#bdc9c6]'
                            }`}
                        >
                            <Image
                                src={m.src}
                                alt={m.label}
                                width={m.width}
                                height={m.height}
                                className={`${m.imgClass} w-auto object-contain`}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
