import React from 'react';

export interface PaymentRow {
    id: string;
    invoiceId: string;
    customerName: string;
    customerPhone: string;
    date: string;
    method: string;
    amount: string;
}

// Exact Figma dot fills per payment method (dashboard node 347:3676).
const METHOD_DOT: Record<string, string> = {
    QRIS: 'bg-[#0f766e]',
    CASH: 'bg-[#f59e0b]',
    BANK: 'bg-[#f59e0b]',
    TRANSFER: 'bg-[#0ea5e9]',
    GOPAY: 'bg-[#0ea5e9]',
    OVO: 'bg-[#a855f7]',
};

const COL = {
    invoice: 'basis-0 grow min-w-[130px]',
    customer: 'basis-0 grow-[2] min-w-[180px]',
    date: 'basis-0 grow min-w-[140px]',
    method: 'basis-0 grow min-w-[120px]',
    amount: 'basis-0 grow min-w-[120px]',
};

export default function RecentPaymentsTable({ rows }: { rows: PaymentRow[] }) {
    return (
        <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex w-full items-center justify-between border-b border-[#e0e3e1] bg-white px-6 py-5">
                <h3 className="text-[20px] leading-7 font-semibold text-[#181c1c]">Recent Payment</h3>
                <button
                    type="button"
                    className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#005c55] hover:underline"
                    onClick={() => {window.location.href = '/branch/reports'}}>
                    View All
                </button>
            </div>

            <div className="w-full overflow-auto">
                <div className="flex w-full border-b border-[#bdc9c6] bg-[#f1f4f3]">
                    <HeaderCell className={COL.invoice}>Invoice ID</HeaderCell>
                    <HeaderCell className={COL.customer}>Customer</HeaderCell>
                    <HeaderCell className={COL.date}>Date</HeaderCell>
                    <HeaderCell className={COL.method}>Method</HeaderCell>
                    <HeaderCell className={COL.amount} alignRight>
                        Amount
                    </HeaderCell>
                </div>

                <div className="flex w-full flex-col">
                    {rows.length === 0 && (
                        <div className="flex w-full justify-center py-10 text-[14px] text-[#3e4947]">
                            Belum ada pembayaran.
                        </div>
                    )}
                    {rows.map((row) => (
                        <div
                            key={row.id}
                            className="flex w-full items-center border-b border-[#e0e3e1] last:border-b-0"
                        >
                            <div className={`flex items-center px-6 py-4 ${COL.invoice}`}>
                                <span className="font-mono text-[14px] leading-5 text-[#6e7977]">
                                    {row.invoiceId}
                                </span>
                            </div>
                            <div className={`flex flex-col justify-center px-6 py-4 ${COL.customer}`}>
                                <p className="truncate text-[14px] leading-5 font-medium text-[#181c1c]">
                                    {row.customerName}
                                </p>
                                <p className="truncate text-[12px] leading-4 text-[#6e7977]">
                                    {row.customerPhone}
                                </p>
                            </div>
                            <div className={`flex items-center px-6 py-4 ${COL.date}`}>
                                <span className="text-[14px] leading-5 text-[#3e4947]">{row.date}</span>
                            </div>
                            <div className={`flex items-center gap-2 px-6 py-4 ${COL.method}`}>
                                <span
                                    className={`size-[8px] shrink-0 rounded-full ${METHOD_DOT[row.method] ?? 'bg-[#6e7977]'}`}
                                />
                                <span className="text-[14px] leading-5 text-[#181c1c]">{row.method}</span>
                            </div>
                            <div className={`flex items-center justify-end px-6 py-4 ${COL.amount}`}>
                                <span className="text-right text-[14px] leading-5 font-semibold text-[#181c1c]">
                                    {row.amount}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HeaderCell({
    className,
    alignRight = false,
    children,
}: {
    className: string;
    alignRight?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className={`flex items-center px-6 py-3 ${alignRight ? 'justify-end' : ''} ${className}`}>
            <span className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947] uppercase">
                {children}
            </span>
        </div>
    );
}
