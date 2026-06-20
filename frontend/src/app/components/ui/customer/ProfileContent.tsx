'use client';

import React, { useEffect, useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import {
    // Theme light/dark is aborted for now — re-enable these when the feature returns.
    // getUserTheme,
    // saveUserTheme,
    getUserProfile,
    updateUserProfileField,
    // type Theme,
    type ProfileData,
} from '@/lib/userPreferences';

// TODO: replace with the authenticated user's id once auth is wired.
const USER_ID = 'current-user';

const FIELDS: { key: keyof ProfileData; label: string }[] = [
    { key: 'nama', label: 'Nama' },
    { key: 'nomorTelepon', label: 'Nomor Telepon' },
    { key: 'email', label: 'Email' },
    { key: 'alamat', label: 'Alamat' },
];

const INITIAL: ProfileData = {
    nama: 'Andini Pratama',
    nomorTelepon: '+62 812-3344-7788',
    email: 'SarahJenkins@gmail.com',
    alamat: 'Jalan Teknik Kimia No. 99, Keputih, Sukolilo, Surabaya, Jawa Timur',
};

// --- Theme (light/dark) aborted for now -------------------------------------
// function applyTheme(theme: Theme) {
//     document.documentElement.classList.toggle('dark', theme === 'dark');
// }
// ---------------------------------------------------------------------------

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="w-full text-[24px] leading-[22.828px] font-bold text-[#0f172b]">{children}</h2>;
}

export default function ProfileContent() {
    // --- Theme state aborted for now ---------------------------------------
    // const [theme, setTheme] = useState<Theme>('light');
    // -----------------------------------------------------------------------
    const [values, setValues] = useState<ProfileData>(INITIAL);
    const [editing, setEditing] = useState<Record<keyof ProfileData, boolean>>({
        nama: false,
        nomorTelepon: false,
        email: false,
        alamat: false,
    });

    // Load the user's saved profile on mount.
    useEffect(() => {
        let active = true;
        (async () => {
            // Theme loading aborted for now:
            // const savedTheme = await getUserTheme(USER_ID);
            // setTheme(savedTheme);
            // applyTheme(savedTheme);
            const savedProfile = await getUserProfile(USER_ID);
            if (!active) return;
            setValues((prev) => ({ ...prev, ...savedProfile }));
        })();
        return () => {
            active = false;
        };
    }, []);

    // --- Theme toggle aborted for now --------------------------------------
    // const isDark = theme === 'dark';
    // function handleToggleTheme() {
    //     const next: Theme = isDark ? 'light' : 'dark';
    //     setTheme(next);
    //     applyTheme(next);
    //     void saveUserTheme(USER_ID, next);
    // }
    // -----------------------------------------------------------------------

    async function handleEditClick(key: keyof ProfileData) {
        if (editing[key]) {
            // Check clicked — persist and lock the field.
            await updateUserProfileField(USER_ID, key, values[key]);
            setEditing((prev) => ({ ...prev, [key]: false }));
        } else {
            setEditing((prev) => ({ ...prev, [key]: true }));
        }
    }

    return (
        <div className="flex w-full flex-col gap-[20px]">
            {/* Profile */}
            <section className="flex w-full flex-col gap-[12px]">
                <SectionTitle>Profile</SectionTitle>
                <div className="flex w-full flex-col gap-[20px] rounded-[12.75px] border border-[#bdc9c6] bg-white p-[15px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)]">
                    {FIELDS.map(({ key, label }) => {
                        const isEditing = editing[key];
                        return (
                            <div key={key} className="flex items-center gap-[12px]">
                                <span className="w-[130px] shrink-0 text-[14px] leading-[17.5px] text-[#0f172b]">
                                    {label}
                                </span>
                                <span className="shrink-0 text-[14px] leading-[17.5px] text-[#0f172b] ">:</span>
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
                                            onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                                            className="w-full bg-transparent text-[14px] leading-[17.5px] text-[#0f172b] outline-none"
                                        />
                                    ) : (
                                        <p className="text-[14px] leading-[17.5px] text-[#62748e]">{values[key]}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleEditClick(key)}
                                    aria-label={isEditing ? `Simpan ${label}` : `Ubah ${label}`}
                                    className={`flex size-[16px] shrink-0 items-center justify-center transition-colors ${
                                        isEditing ? 'text-[#009689] hover:text-[#007a70]' : 'text-[#62748e] hover:text-[#0f172b]'
                                    }`}
                                >
                                    {isEditing ? <Check size={16} /> : <Pencil size={16} />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Preference — Theme light/dark aborted for now. Re-enable this section
                (and the theme state/effect/handler above) when the feature returns.
            <section className="flex w-full flex-col gap-[12px]">
                <SectionTitle>Preference</SectionTitle>
                <div className="flex w-full items-center rounded-[12.75px] border border-[#bdc9c6] bg-white p-[15px] drop-shadow-[0px_1px_1px_rgba(15,23,42,0.04)] dark:border-[#2a3a37] dark:bg-[#11201d]">
                    <div className="flex w-[115px] shrink-0 items-center justify-between text-[14px] leading-[17.5px] text-[#0f172b] dark:text-gray-200">
                        <span>Tema</span>
                        <span>:</span>
                    </div>
                    <div className="flex flex-1 items-center justify-start pl-[12px]">
                        <div className="flex items-center justify-center gap-[10px]">
                            <span className="text-[14px] leading-[17.5px] text-black dark:text-gray-200">Light</span>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={isDark}
                                aria-label="Tema gelap"
                                onClick={handleToggleTheme}
                                className={`flex h-[40px] w-[76px] items-center rounded-[20px] p-[2px] transition-colors duration-200 ${
                                    isDark ? 'bg-[#009689]' : 'bg-[#d6dedc]'
                                }`}
                            >
                                <span
                                    className={`size-[36px] rounded-[20px] bg-white shadow-sm transition-transform duration-200 ${
                                        isDark ? 'translate-x-[36px]' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                            <span className="text-[14px] leading-[17.5px] text-black dark:text-gray-200">Dark</span>
                        </div>
                    </div>
                </div>
            </section>
            */}
        </div>
    );
}
