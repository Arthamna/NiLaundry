'use client';

import React, { useEffect, useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import { pelangganApi, getApiErrorMessage, type UpdatePelangganInput } from '@/lib/api';

// The four editable fields map 1:1 to the Pelanggan / UpdatePelangganInput DTO.
type FieldKey = 'nama' | 'noTelp' | 'email' | 'alamat';

const FIELDS: { key: FieldKey; label: string }[] = [
    { key: 'nama', label: 'Nama' },
    { key: 'noTelp', label: 'Nomor Telepon' },
    { key: 'email', label: 'Email' },
    { key: 'alamat', label: 'Alamat' },
];

const EMPTY: Record<FieldKey, string> = { nama: '', noTelp: '', email: '', alamat: '' };

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="w-full text-[24px] leading-[22.828px] font-bold text-[#0f172b]">{children}</h2>;
}

export default function ProfileContent() {
    const [values, setValues] = useState<Record<FieldKey, string>>(EMPTY);
    const [editing, setEditing] = useState<Record<FieldKey, boolean>>({
        nama: false,
        noTelp: false,
        email: false,
        alamat: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // GET /pelanggan/me on mount.
    useEffect(() => {
        const controller = new AbortController();
        pelangganApi
            .getMe(controller.signal)
            .then((me) => setValues({ nama: me.nama, noTelp: me.noTelp, email: me.email, alamat: me.alamat }))
            .catch((e) => {
                if (!controller.signal.aborted) setError(getApiErrorMessage(e));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, []);

    // Toggle edit; on confirm PUT /pelanggan/me with just the changed field.
    async function handleEditClick(key: FieldKey) {
        if (!editing[key]) {
            setEditing((prev) => ({ ...prev, [key]: true }));
            return;
        }
        try {
            const input: UpdatePelangganInput = {};
            input[key] = values[key];
            await pelangganApi.updateMe(input);
            setEditing((prev) => ({ ...prev, [key]: false }));
            setError(null);
        } catch (e) {
            setError(getApiErrorMessage(e));
        }
    }

    return (
        <div className="flex w-full flex-col gap-[20px]">
            <section className="flex w-full flex-col gap-[12px]">
                <SectionTitle>Profile</SectionTitle>

                {error && (
                    <p role="alert" className="text-[14px] text-[#ba1a1a]">
                        {error}
                    </p>
                )}

                <div className="flex w-full flex-col gap-[20px] rounded-[12.75px] border border-[#bdc9c6] bg-white p-[15px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
                    {isLoading ? (
                        <p className="text-[14px] leading-[17.5px] text-[#62748e]">Memuat profil…</p>
                    ) : (
                        FIELDS.map(({ key, label }) => {
                            const isEditing = editing[key];
                            return (
                                <div key={key} className="flex items-center gap-[12px]">
                                    <span className="w-[130px] shrink-0 text-[14px] leading-[17.5px] text-[#0f172b]">
                                        {label}
                                    </span>
                                    <span className="shrink-0 text-[14px] leading-[17.5px] text-[#0f172b]">:</span>
                                    <div
                                        className={`flex flex-1 items-center rounded-[4px] border px-[8px] py-[2px] transition-colors ${
                                            isEditing ? 'border-[#009689] bg-[#f0fdfa]' : 'border-[#bdc9c6]'
                                        }`}
                                    >
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={values[key]}
                                                autoFocus
                                                aria-label={label}
                                                onChange={(e) =>
                                                    setValues((prev) => ({ ...prev, [key]: e.target.value }))
                                                }
                                                className="w-full bg-transparent text-[14px] leading-[17.5px] text-[#0f172b] outline-none"
                                            />
                                        ) : (
                                            <p className="text-[14px] leading-[17.5px] text-[#62748e]">
                                                {values[key]}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick(key)}
                                        aria-label={isEditing ? `Simpan ${label}` : `Ubah ${label}`}
                                        className={`flex size-[16px] shrink-0 items-center justify-center transition-colors ${
                                            isEditing
                                                ? 'text-[#009689] hover:text-[#007a70]'
                                                : 'text-[#62748e] hover:text-[#0f172b]'
                                        }`}
                                    >
                                        {isEditing ? <Check size={16} /> : <Pencil size={16} />}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </div>
    );
}
