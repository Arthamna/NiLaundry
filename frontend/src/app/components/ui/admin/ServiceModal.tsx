'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';

import { BranchService } from '@/components/ui/admin/branchData';
import { superadminApi, getApiErrorMessage } from '@/lib/api';

interface ServiceModalProps {
    mode: 'add' | 'edit';
    cabangId: number;
    service?: BranchService;
    onClose: () => void;
    onSaved: () => void;
}

const LABEL = 'text-[13px] leading-[18px] font-medium text-[#181c1c]';
const FIELD =
    'h-[43px] w-full rounded-[8px] border border-[#e0e3e1] bg-white px-[15px] py-[11px] text-[14px] text-[#181c1c] placeholder:text-[#9ca3af] outline-none focus:border-[#005c55]';
const READONLY =
    'h-[43px] w-full rounded-[8px] border border-[#e0e3e1] bg-[#f7faf8] px-[15px] py-[11px] text-[14px] text-[#3e4947]';

// "Add Service" / "Edit Service" modal. A branch service is a tariff that links a
// catalogue layanan to this branch with a price-per-unit (createTarif/updateTarif).
export default function ServiceModal({ mode, cabangId, service, onClose, onSaved }: ServiceModalProps) {
    const isEdit = mode === 'edit';
    const [layanan, setLayanan] = useState<superadminApi.SuperLayanan[]>([]);
    const [layananId, setLayananId] = useState<number>(service?.idLayanan ?? 0);
    const [price, setPrice] = useState<string>(service?.hargaValue != null ? String(service.hargaValue) : '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit) return; // edit keeps the existing layanan
        const ac = new AbortController();
        superadminApi
            .listLayanan(ac.signal)
            .then((rows) => {
                const list = rows ?? [];
                setLayanan(list);
                if (list.length > 0) setLayananId((id) => id || list[0].id);
            })
            .catch((err) => {
                if (!ac.signal.aborted) setError(getApiErrorMessage(err));
            });
        return () => ac.abort();
    }, [isEdit]);

    const selected = useMemo(() => layanan.find((l) => l.id === layananId), [layanan, layananId]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const harga = Number(price);
        if (!Number.isFinite(harga) || harga <= 0) {
            setError('Enter a valid price per unit.');
            return;
        }
        setBusy(true);
        try {
            if (isEdit && service?.idTarif) {
                await superadminApi.updateTarif(cabangId, { idTarif: service.idTarif, hargaPerSatuan: harga });
            } else {
                if (!layananId) {
                    setError('Please select a service.');
                    setBusy(false);
                    return;
                }
                await superadminApi.createTarif(cabangId, { hargaPerSatuan: harga, layananIdLayanan: layananId });
            }
            onSaved();
        } catch (err) {
            setError(getApiErrorMessage(err));
            setBusy(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-[rgba(24,28,28,0.4)] backdrop-blur-[2px]"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label={isEdit ? 'Edit Service' : 'Add New Service'}
                className="relative z-10 w-[480px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[16px] bg-white shadow-[0px_20px_60px_0px_rgba(0,0,0,0.18)]"
            >
                <div className="flex items-center justify-between border-b border-[#e0e3e1] px-[28px] pt-[24px] pb-[21px]">
                    <div className="flex flex-col">
                        <h2 className="text-[18px] leading-[26px] font-bold text-[#181c1c]">
                            {isEdit ? 'Edit Service' : 'Add New Service'}
                        </h2>
                        {!isEdit && (
                            <p className="pt-[2px] text-[13px] leading-[18px] text-[#6e7977]">
                                Add a service tariff to this branch
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#f1f4f3] text-[#3e4947] transition-colors hover:bg-[#e5e9e7]"
                    >
                        <X size={14} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-[18px] px-[28px] pt-[24px] pb-[8px]">
                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="svc-name" className={LABEL}>
                                Service <span className="text-[#ef4444]">*</span>
                            </label>
                            {isEdit ? (
                                <div id="svc-name" className={READONLY}>
                                    {service?.name}
                                </div>
                            ) : (
                                <div className="relative">
                                    <select
                                        id="svc-name"
                                        value={layananId}
                                        onChange={(e) => setLayananId(Number(e.target.value))}
                                        className="h-[43px] w-full appearance-none rounded-[8px] border border-[#e0e3e1] bg-white pr-[40px] pl-[15px] text-[14px] text-[#181c1c] outline-none focus:border-[#005c55]"
                                    >
                                        {layanan.length === 0 && <option value={0}>Loading…</option>}
                                        {layanan.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                {l.nama}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={20}
                                        className="pointer-events-none absolute top-1/2 right-[11px] -translate-y-1/2 text-[#9ca3af]"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="svc-unit" className={LABEL}>
                                Unit
                            </label>
                            <div id="svc-unit" className={READONLY}>
                                {isEdit ? service?.unit : (selected?.satuan ?? '—')}
                            </div>
                        </div>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="svc-price" className={LABEL}>
                                Price per Unit <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                id="svc-price"
                                type="number"
                                min={0}
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="50000"
                                className={FIELD}
                            />
                        </div>

                        {error && <p className="text-[13px] text-[#b91c1c]">{error}</p>}
                    </div>

                    <div className="flex items-center justify-end px-[28px] pt-[16px] pb-[24px]">
                        <div className="flex items-center gap-[10px]">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-[8px] border border-[#bdc9c6] bg-white px-[21px] py-[11px] text-[14px] leading-[21px] font-semibold text-[#3e4947] transition-colors hover:bg-[#f1f4f3]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={busy}
                                className="flex items-center gap-[8px] rounded-[8px] bg-[#005c55] px-[20px] py-[10px] text-[14px] leading-[21px] font-semibold text-white transition-colors hover:bg-[#00514b] disabled:opacity-60"
                            >
                                {isEdit ? null : <Plus size={16} className="shrink-0" />}
                                {busy ? 'Saving…' : isEdit ? 'Save' : 'Add Service'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
