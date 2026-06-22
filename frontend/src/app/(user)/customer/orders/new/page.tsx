'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Trash2, Plus, Bike } from 'lucide-react';
import DashboardHeader from '@/components/ui/customer/DashboardHeader';
import BackButton from '@/components/ui/customer/BackButton';
import { createPesananFromItems } from '@/lib/orders';
<<<<<<< Updated upstream
import {
    pesananApi,
    getApiErrorMessage,
    type KatalogCabang,
    type KatalogService,
} from '@/lib/api';
=======
import { kurirApi, getApiErrorMessage, getCurrentPelangganId, type Kurir } from '@/lib/api';
>>>>>>> Stashed changes

// The branch + service catalog is fetched live from GET /katalog (tarif joined
// with cabang + layanan). The tarifId / cabangId are the real DB ids, so the
// POST /pelanggan/{id}/pesanan payload is valid.

// Payment method is chosen at the payment step; the order is created with a
// placeholder and pembayaran status 'pending' (CUSTOMER_ENDPOINT.md > Add New Order).
const DEFAULT_METODE_PEMBAYARAN = 'pending';

const formatRp = (n: number) => new Intl.NumberFormat('id-ID').format(n);

interface OrderItemState {
    id: number;
    tarifId: number;
    quantity: string;
    notes: string;
}

type SendMethod = 'pickup' | 'dropoff';
type ReturnMethod = 'delivery' | 'selfpickup';

function MethodOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-[50px] flex-1 items-center justify-center rounded-[4px] px-[8px] text-[14px] leading-[17.5px] transition-colors ${
                selected ? 'border-2 border-[#00bba7] text-black' : 'border border-[#bdc9c6] text-[#bdc9c6] hover:text-[#8a979f]'
            }`}
        >
            {label}
        </button>
    );
}

function OrderItemCard({
    item,
    services,
    subtotal,
    onChange,
    onRemove,
}: {
    item: OrderItemState;
    services: KatalogService[];
    subtotal: number;
    onChange: (next: OrderItemState) => void;
    onRemove: () => void;
}) {
    const satuan = services.find((s) => s.tarifId === item.tarifId)?.satuan ?? 'kg';
    return (
        <div className="flex w-full flex-col gap-[10px] rounded-[12.75px] border-2 border-[#bdc9c6] bg-white p-[12.5px]">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-[36px]">
                    <div className="flex items-center gap-[12px]">
                        <span className="text-[14px] leading-[17.5px] text-[#0f172b]">Service :</span>
                        <div className="relative w-[400px]">
                            <select
                                value={item.tarifId}
                                onChange={(e) => onChange({ ...item, tarifId: Number(e.target.value) })}
                                aria-label="Service"
                                className="w-full appearance-none rounded-[4px] border border-[#bdc9c6] py-[2px] pl-[8px] pr-[28px] text-[14px] leading-[16.5px] text-[#62748e] outline-none focus:border-[#00bba7]"
                            >
                                {services.map((s) => (
                                    <option key={s.tarifId} value={s.tarifId}>
                                        {s.namaLayanan} (Rp {formatRp(s.hargaPerSatuan)}/{s.satuan})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={24} className="pointer-events-none absolute right-[2px] top-1/2 -translate-y-1/2 text-[#62748e]" />
                        </div>
                    </div>
                    <div className="flex h-[28px] w-[191px] items-center justify-between">
                        <span className="text-[14px] leading-[17.5px] text-[#0f172b]">Quantity :</span>
                        <div className="flex h-full items-center gap-[4px]">
                            <input
                                type="number"
                                min={0}
                                value={item.quantity}
                                onChange={(e) => onChange({ ...item, quantity: e.target.value })}
                                aria-label="Quantity"
                                className="h-full w-[88px] rounded-[4px] border border-[#bdc9c6] px-[8px] text-[14px] text-[#62748e] outline-none focus:border-[#00bba7]"
                            />
                            <span className="text-[14px] leading-[16.5px] text-[#62748e]">{satuan}</span>
                        </div>
                    </div>
                </div>
                <div className="flex h-[28px] items-center gap-[10px]">
                    <span className="text-[14px] leading-[17.5px] text-[#0f172b]">Subtotal :</span>
                    <span className="text-[14px] leading-[16.5px] text-[#62748e]">Rp {formatRp(subtotal)}</span>
                </div>
            </div>

            <div className="h-px w-full rounded-[1px] bg-[#bdc9c6]" />

            <div className="flex w-full flex-col gap-[10px]">
                <span className="text-[14px] leading-[17.5px] text-[#0f172b]">Notes :</span>
                <textarea
                    value={item.notes}
                    onChange={(e) => onChange({ ...item, notes: e.target.value })}
                    aria-label="Notes"
                    className="h-[56px] w-full resize-none rounded-[4px] border border-[#bdc9c6] p-[8px] text-[14px] text-[#0f172b] outline-none focus:border-[#00bba7]"
                />
            </div>

            <div className="h-px w-full rounded-[1px] bg-[#bdc9c6]" />

            <button
                type="button"
                onClick={onRemove}
                className="flex h-[40px] w-full items-center justify-center gap-[10px] rounded-[6.75px] border border-[#f41313] py-[8px] text-[12px] leading-[17.5px] text-[#f41313] transition-colors hover:bg-[#fef2f2]"
            >
                <Trash2 size={20} /> Remove item
            </button>
        </div>
    );
}

let nextId = 0;

export default function NewOrderPage() {
    const router = useRouter();
    const [branches, setBranches] = useState<KatalogCabang[]>([]);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [catalogError, setCatalogError] = useState<string | null>(null);

    const [cabangId, setCabangId] = useState<number | null>(null);
    const [sendMethod, setSendMethod] = useState<SendMethod>('pickup');
    const [returnMethod, setReturnMethod] = useState<ReturnMethod>('selfpickup');
    const [items, setItems] = useState<OrderItemState[]>([]);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // A voucher id passed from the dashboard "Use Now" flow; forwarded to the
    // payment step so it is auto-applied there.
    const [voucherParam, setVoucherParam] = useState<string | null>(null);

    useEffect(() => {
        setVoucherParam(new URLSearchParams(window.location.search).get('voucher'));
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        pesananApi
            .getKatalog(controller.signal)
            .then((data) => {
                setBranches(data);
                if (data.length > 0) setCabangId(data[0].cabangId);
            })
            .catch((e) => {
                if (!controller.signal.aborted) setCatalogError(getApiErrorMessage(e));
            })
            .finally(() => {
                if (!controller.signal.aborted) setCatalogLoading(false);
            });
        return () => controller.abort();
    }, []);

    const branch = branches.find((b) => b.cabangId === cabangId) ?? null;
    const services = branch?.services ?? [];
    const priceOf = (tarifId: number) => services.find((s) => s.tarifId === tarifId)?.hargaPerSatuan ?? 0;

    const subtotals = items.map((it) => priceOf(it.tarifId) * (Number(it.quantity) || 0));
    const total = subtotals.reduce((sum, v) => sum + v, 0);

    function updateItem(id: number, next: OrderItemState) {
        setItems((prev) => prev.map((it) => (it.id === id ? next : it)));
    }
    function removeItem(id: number) {
        setItems((prev) => prev.filter((it) => it.id !== id));
    }
    function addItem() {
        if (services.length === 0) return;
        setItems((prev) => [...prev, { id: nextId++, tarifId: services[0].tarifId, quantity: '', notes: '' }]);
    }

    // Switching branch remaps each line to the same service slot at the new branch
    // (catalog order is identical across branches) so tarifId stays valid.
    function changeBranch(nextCabangId: number) {
        const prevBranch = branch;
        const next = branches.find((b) => b.cabangId === nextCabangId) ?? null;
        if (next) {
            setItems((prev) =>
                prev.map((it) => {
                    const slot = prevBranch ? prevBranch.services.findIndex((s) => s.tarifId === it.tarifId) : -1;
                    const mapped = next.services[slot] ?? next.services[0];
                    return mapped ? { ...it, tarifId: mapped.tarifId } : it;
                }),
            );
        }
        setCabangId(nextCabangId);
    }

    async function handleMakeOrder() {
        if (cabangId == null) {
            setError('Pilih cabang terlebih dahulu.');
            return;
        }
        const validItems = items
            .map((it) => ({ tarifId: it.tarifId, kuantitas: Number(it.quantity) || 0, catatan: it.notes.trim() || undefined }))
            .filter((it) => it.kuantitas >= 1);

        if (validItems.length === 0) {
            setError('Tambahkan minimal satu item dengan kuantitas ≥ 1.');
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            const created = await createPesananFromItems({
                cabangId,
                catatan: notes.trim() || undefined,
                metodePembayaran: DEFAULT_METODE_PEMBAYARAN,
                // Send/return method → backend scenario fields; these drive the
                // auto-assigned default status and the order-detail timeline.
                jenisAmbil: sendMethod === 'pickup' ? 'pickup' : 'walkin',
                jenisAntar: returnMethod === 'delivery' ? 'delivery' : 'walkin',
                items: validItems,
            });
            // New orders start unpaid → send the customer to the payment step,
            // forwarding a pre-selected voucher when one came from "Use Now".
            const q = voucherParam ? `?voucher=${encodeURIComponent(voucherParam)}` : '';
            router.push(`/customer/orders/${created.id}/payment${q}`);
        } catch (e) {
            setError(getApiErrorMessage(e));
            setSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col gap-[50px]">
            <DashboardHeader />

            <div className="flex w-full flex-col gap-[40px]">
                <div className="flex w-full flex-col gap-[20px]">
                    <BackButton href="/customer/orders" label="← Kembali" />
                    <h1 className="text-[32px] leading-[38px] font-bold tracking-[-0.6px] text-[#005c55]">Create New Order</h1>
                </div>

                {catalogLoading ? (
                    <p className="text-[15px] text-[#62748e]">Memuat katalog layanan…</p>
                ) : catalogError ? (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {catalogError}
                    </p>
                ) : branches.length === 0 ? (
                    <p className="text-[15px] text-[#62748e]">Belum ada layanan yang tersedia.</p>
                ) : (
                    <>
                        {/* Branch + delivery method */}
                        <div className="flex w-full flex-col gap-[10px] rounded-[12.75px] border-2 border-[#bdc9c6] bg-white p-[12.5px]">
                            <p className="text-[16px] leading-[17.5px] font-bold text-[#0f172b]">Select Branch</p>
                            <div className="relative w-full">
                                <select
                                    value={cabangId ?? ''}
                                    onChange={(e) => changeBranch(Number(e.target.value))}
                                    aria-label="Select branch"
                                    className="w-full appearance-none rounded-[4px] border border-[#bdc9c6] py-[2px] pl-[8px] pr-[32px] text-[14px] leading-[16.5px] text-[#62748e] outline-none focus:border-[#00bba7]"
                                >
                                    {branches.map((b) => (
                                        <option key={b.cabangId} value={b.cabangId}>
                                            {b.nama} — {b.alamat}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={24} className="pointer-events-none absolute right-[2px] top-1/2 -translate-y-1/2 text-[#62748e]" />
                            </div>

                            <div className="h-px w-full rounded-[1px] bg-[#bdc9c6]" />

                            {/* Send/return method maps to jenisAmbil/jenisAntar on the order and
                                determines the delivery scenario + the auto-assigned default status. */}
                            <p className="text-[14px] leading-[17.5px] font-bold text-[#0f172b]">How will you send your laundry?</p>
                            <div className="flex w-full items-center gap-[46px]">
                                <MethodOption label="Courier Pickup" selected={sendMethod === 'pickup'} onClick={() => setSendMethod('pickup')} />
                                <MethodOption label="Drop-off Myself" selected={sendMethod === 'dropoff'} onClick={() => setSendMethod('dropoff')} />
                            </div>

                            <p className="text-[14px] leading-[17.5px] font-bold text-[#0f172b]">How do you want to get it back?</p>
                            <div className="flex w-full items-center gap-[46px]">
                                <MethodOption label="Courier Delivery" selected={returnMethod === 'delivery'} onClick={() => setReturnMethod('delivery')} />
                                <MethodOption label="Self Pick-up" selected={returnMethod === 'selfpickup'} onClick={() => setReturnMethod('selfpickup')} />
                            </div>
                        </div>

                        {/* Items */}
                        {items.map((item, i) => (
                            <OrderItemCard
                                key={item.id}
                                item={item}
                                services={services}
                                subtotal={subtotals[i]}
                                onChange={(next) => updateItem(item.id, next)}
                                onRemove={() => removeItem(item.id)}
                            />
                        ))}

                        {/* Add item */}
                        <button
                            type="button"
                            onClick={addItem}
                            className="flex w-full items-center justify-center gap-[8px] rounded-[12px] border border-[#bdc9c6] bg-white py-[16px] text-[15px] leading-[20px] font-medium text-[#bdc9c6] transition-colors hover:text-[#8a979f]"
                        >
                            <Plus size={20} /> Add New Item
                        </button>

                        {/* Order-level note */}
                        <div className="flex w-full flex-col gap-[10px] rounded-[12.75px] border-2 border-[#bdc9c6] bg-white p-[12.5px]">
                            <span className="text-[14px] leading-[17.5px] font-bold text-[#0f172b]">Order Notes (optional)</span>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                aria-label="Order notes"
                                placeholder="Catatan untuk seluruh pesanan…"
                                className="h-[56px] w-full resize-none rounded-[4px] border border-[#bdc9c6] p-[8px] text-[14px] text-[#0f172b] outline-none focus:border-[#00bba7]"
                            />
                        </div>

                        {error && (
                            <p role="alert" className="text-[14px] text-[#ba1a1a]">
                                {error}
                            </p>
                        )}

                        {/* Total + submit */}
                        <div className="flex w-full flex-col gap-[8px]">
                            <div className="flex w-full items-start justify-between text-[20px] leading-[38px] tracking-[-0.6px] text-[#005c55]">
                                <p className="font-medium">Total :</p>
                                <p className="font-normal">Rp {formatRp(total)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleMakeOrder}
                                disabled={submitting}
                                className="flex h-[40px] w-full items-center justify-center rounded-[6.75px] bg-[#009689] px-[113px] py-[8px] text-[16px] leading-[17.5px] font-bold text-white transition-colors hover:bg-[#007a70] disabled:opacity-60"
                            >
                                {submitting ? 'Memproses…' : 'Make Order'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
