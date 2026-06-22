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
    BANK: 'bg-[#f59e0b]',
    GOPAY: 'bg-[#0ea5e9]',
    OVO: 'bg-[#a855f7]',
};

export default function RecentPaymentsTable({ rows }: { rows: PaymentRow[] }) {
    return (
        <section className="flex w-full flex-col overflow-clip rounded-[12px] border border-[#bdc9c6] bg-white p-px shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            {/* Card header */}
            <div className="flex w-full items-center justify-between border-b border-[#e0e3e1] bg-white px-6 pt-6 pb-[25px]">
                <h3 className="text-[20px] leading-7 font-semibold text-[#181c1c]">Recent Payment</h3>
                <button
                    type="button"
                    className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#005c55]"
                >
                    View All
                </button>
            </div>

            {/* Table */}
            <div className="w-full overflow-auto">
                {/* Header row */}
                <div className="flex w-full justify-center border-b border-[#bdc9c6] bg-[#f1f4f3]">
                    <HeaderCell width="w-[144px]">Invoice ID</HeaderCell>
                    <HeaderCell width="w-[200px]">Customer</HeaderCell>
                    <HeaderCell width="w-[256px]">Date</HeaderCell>
                    <HeaderCell width="w-[144px]">Method</HeaderCell>
                    <HeaderCell width="w-[200px]" align="items-end">
                        Amount
                    </HeaderCell>
                </div>

                {/* Body */}
                <div className="flex w-full flex-col">
                    {rows.map((row) => (
                        <div key={row.id} className="flex w-full justify-center border-b border-[#f1f5f9]">
                            <div className="flex w-[144px] flex-col justify-center px-4 py-[16.5px]">
                                <span className="font-mono text-[14px] leading-5 text-[#6e7977]">
                                    {row.invoiceId}
                                </span>
                            </div>
                            <div className="flex w-[200px] flex-col px-4 py-[18.5px]">
                                <p className="text-[14px] leading-5 font-medium text-[#181c1c]">
                                    {row.customerName}
                                </p>
                                <p className="text-[12px] leading-4 text-[#6e7977]">{row.customerPhone}</p>
                            </div>
                            <div className="flex w-[256px] flex-col px-4 pt-[26px] pb-[27px]">
                                <span className="text-[14px] leading-5 text-[#3e4947]">{row.date}</span>
                            </div>
                            <div className="flex w-[144px] items-center gap-[6px] pl-4">
                                <span
                                    className={`size-[8px] shrink-0 rounded-full ${METHOD_DOT[row.method] ?? 'bg-[#6e7977]'}`}
                                />
                                <span className="text-[14px] leading-5 text-[#181c1c]">{row.method}</span>
                            </div>
                            <div className="flex w-[200px] flex-col items-end justify-center px-4 pt-[26px] pb-[27px]">
                                <span className="text-right text-[14px] leading-5 font-medium text-[#181c1c]">
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
    width,
    align = 'items-start',
    children,
}: {
    width: string;
    align?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={`flex ${width} flex-col justify-center ${align} px-4 py-3`}>
            <span className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#3e4947]">{children}</span>
        </div>
    );
}
