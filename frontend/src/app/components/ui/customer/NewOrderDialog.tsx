'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createOrder } from '@/lib/orders';

// TODO: replace with the authenticated user's id once auth is wired.
const USER_ID = 'current-user';

const SERVICES = ['Cuci Setrika Reguler', 'Cuci Kering', 'Setrika Saja', 'Express (6 Jam)'];

export default function NewOrderDialog() {
    const [open, setOpen] = useState(false);
    const [service, setService] = useState(SERVICES[0]);
    const [pickupAddress, setPickupAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function reset() {
        setService(SERVICES[0]);
        setPickupAddress('');
        setNotes('');
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        await createOrder(USER_ID, { service, pickupAddress, notes });
        setSubmitting(false);
        setOpen(false);
        reset();
    }

    const inputClass =
        'w-full rounded-[8.75px] border border-[#e2e8f0] bg-white px-[12px] py-[9px] text-[12.25px] leading-[17.5px] text-[#0f172b] placeholder:text-[#90a1b9] outline-none transition-colors focus:border-[#0f766e]';

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-[7px] rounded-[8.75px] bg-[#0f766e] px-[16px] py-[9px] text-[12.25px] leading-[17.5px] font-semibold text-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#0d655e]"
            >
                <Plus size={16} /> Place New Order
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <button type="button" aria-label="Tutup" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40" />

                    {/* Dialog */}
                    <div role="dialog" aria-modal="true" aria-label="Buat pesanan baru" className="relative z-10 w-[440px] max-w-full rounded-[12.75px] bg-white p-[20px] shadow-[0px_10px_30px_rgba(0,0,0,0.15)]">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[18px] leading-[24px] font-bold text-[#0f172b]">Buat Pesanan Baru</h2>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Tutup"
                                className="flex size-8 items-center justify-center rounded-full text-[#62748e] transition-colors hover:bg-[#f1f5f9]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-[14px] pt-[16px]">
                            <div className="flex flex-col gap-[5.25px]">
                                <label htmlFor="service" className="text-[12.25px] leading-[17.5px] font-medium text-[#314158]">
                                    Layanan
                                </label>
                                <select id="service" value={service} onChange={(e) => setService(e.target.value)} className={inputClass}>
                                    {SERVICES.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-[5.25px]">
                                <label htmlFor="pickupAddress" className="text-[12.25px] leading-[17.5px] font-medium text-[#314158]">
                                    Alamat Penjemputan
                                </label>
                                <input
                                    id="pickupAddress"
                                    type="text"
                                    required
                                    value={pickupAddress}
                                    onChange={(e) => setPickupAddress(e.target.value)}
                                    placeholder="Masukkan alamat penjemputan"
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex flex-col gap-[5.25px]">
                                <label htmlFor="notes" className="text-[12.25px] leading-[17.5px] font-medium text-[#314158]">
                                    Catatan (opsional)
                                </label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Instruksi khusus untuk kurir / laundry"
                                    className={`${inputClass} resize-none`}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-[10px] pt-[4px]">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="rounded-[8.75px] border border-[#bdc9c6] px-[16px] py-[9px] text-[12.25px] leading-[17.5px] font-semibold text-[#3e4947] transition-colors hover:bg-[#f1f5f9]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-[8.75px] bg-[#0f766e] px-[16px] py-[9px] text-[12.25px] leading-[17.5px] font-semibold text-white transition-colors hover:bg-[#0d655e] disabled:opacity-60"
                                >
                                    {submitting ? 'Memproses…' : 'Buat Pesanan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
