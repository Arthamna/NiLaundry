'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import BackButton from '@/components/ui/customer/BackButton';
import PaymentMethods from '@/components/ui/customer/PaymentMethods';
import PaymentVoucherSection, { type PaymentVoucher } from '@/components/ui/customer/PaymentVoucherSection';
import OrderSummaryCard, { type OrderServiceLine, type CourierLine } from '@/components/ui/customer/OrderSummaryCard';

const APPLIED_VOUCHER: PaymentVoucher = {
    amount: 'Rp 30.000',
    code: 'CUCI20',
    description: 'Diskon 20% · Cuci Setrika',
    expiry: '12 hari lagi',
};

const SERVICE_LINES: OrderServiceLine[] = [
    { service: 'Laundry', quantity: '100 kg', subtotal: 'Rp 100,000,000' },
    { service: 'Laundry', quantity: '100 kg', subtotal: 'Rp 100,000,000' },
    { service: 'Laundry', quantity: '100 kg', subtotal: 'Rp 100,000,000' },
];

const COURIER_LINES: CourierLine[] = [
    { label: 'Courier Pickup', subtotal: 'Rp 100,000,000' },
    { label: 'Courier Delivery', subtotal: 'Rp 100,000,000' },
];

const TOTAL = 'Rp 10,000,000,000,000';

const HEADING_CLASS = 'text-[32px] leading-[38px] font-bold tracking-[-0.6px] text-[#005c55]';

export default function PaymentPage() {
    const params = useParams<{ order_id: string }>();
    const router = useRouter();
    const orderId = params?.order_id ?? 'NL-2401';

    const [voucher, setVoucher] = useState<PaymentVoucher | null>(APPLIED_VOUCHER);
    const [expanded, setExpanded] = useState(false);

    // CTA reads "Pay Rp …" only when a voucher is applied and the list is collapsed (node 178-2162),
    // otherwise "Make Order" (nodes 178-3155 / 178-2972 / 178-3403).
    const showPay = voucher !== null && !expanded;

    const handlePay = () => {
        // TODO: wire to real payment / order creation seam.
        router.push('/customer/orders');
    };

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader name="Sarah Jenkins" activeVouchers={3} membership="Gold Member" />

            <div className="flex w-full flex-col gap-[32px]">
                <div className="flex w-full flex-col gap-[40px]">
                    <div className="flex w-full flex-col gap-[20px]">
                        <BackButton href={`/customer/orders/${orderId}`} label="← Kembali" />
                        <h1 className={HEADING_CLASS}>Payment Methods</h1>
                    </div>
                    <PaymentMethods />
                </div>

                <div className="flex w-full flex-col gap-[20px]">
                    <h2 className={HEADING_CLASS}>Voucher</h2>
                    <PaymentVoucherSection
                        voucher={voucher}
                        expanded={expanded}
                        onToggle={() => setExpanded((v) => !v)}
                        onRemove={() => setVoucher(null)}
                    />
                </div>

                <h2 className={HEADING_CLASS}>Order Details</h2>
                <OrderSummaryCard services={SERVICE_LINES} couriers={COURIER_LINES} total={TOTAL} />

                <button
                    type="button"
                    onClick={handlePay}
                    className="flex h-[40px] w-full items-center justify-center rounded-[6.75px] bg-[#009689] px-[113px] py-[8px] text-center text-[16px] leading-[17.5px] text-white transition-colors hover:bg-[#007e73]"
                >
                    {showPay ? (
                        <span className="font-black">
                            Pay <span className="font-normal">{TOTAL}</span>
                        </span>
                    ) : (
                        <span className="font-black">Make Order</span>
                    )}
                </button>
            </div>
        </div>
    );
}
