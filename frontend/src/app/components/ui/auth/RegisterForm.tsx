'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, MapPin, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi, getApiErrorMessage } from '@/lib/api';

const inputClass =
    'h-[48px] w-full rounded-[12px] border border-[#e2e8f0] bg-white pl-[44px] pr-[16px] text-[15px] leading-[22px] text-[#0f172b] placeholder:text-[#90a1b9] outline-none transition-colors focus:border-[#0f766e]';

interface PlainFieldProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    autoComplete?: string;
    icon: React.ReactNode;
    value: string;
    onChange: (value: string) => void;
}

function PlainField({ id, label, type, placeholder, autoComplete, icon, value, onChange }: PlainFieldProps) {
    return (
        <div className="flex flex-col gap-[8px]">
            <label htmlFor={id} className="text-[15px] leading-[22px] font-medium text-[#314158]">
                {label}
            </label>
            <div className="relative">
                <span className="absolute left-[14px] top-[15px] text-[#94a3b8]">{icon}</span>
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputClass}
                />
            </div>
        </div>
    );
}

interface PasswordFieldProps {
    id: string;
    label: string;
    placeholder: string;
    autoComplete: string;
    value: string;
    onChange: (value: string) => void;
}

function PasswordField({ id, label, placeholder, autoComplete, value, onChange }: PasswordFieldProps) {
    const [show, setShow] = useState(false);
    return (
        <div className="flex flex-col gap-[8px]">
            <label htmlFor={id} className="text-[15px] leading-[22px] font-medium text-[#314158]">
                {label}
            </label>
            <div className="relative">
                <Lock size={18} className="absolute left-[14px] top-[15px] text-[#94a3b8]" />
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`${inputClass} pr-[44px]`}
                />
                <button
                    type="button"
                    onClick={() => setShow((prev) => !prev)}
                    aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
                    className="absolute right-[14px] top-[15px] text-[#94a3b8] transition-colors hover:text-[#475569]"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}

export default function RegisterForm() {
    const router = useRouter();
    const [nama, setNama] = useState('');
    const [noTelp, setNoTelp] = useState('');
    const [email, setEmail] = useState('');
    const [alamat, setAlamat] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;
        setError(null);

        if (!nama.trim() || !noTelp.trim() || !email.trim() || !alamat.trim() || !password) {
            setError('Semua field wajib diisi.');
            return;
        }
        if (password.length < 6) {
            setError('Password minimal 6 karakter.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Konfirmasi password tidak cocok.');
            return;
        }

        setIsSubmitting(true);
        try {
            await authApi.register({
                nama: nama.trim(),
                email: email.trim(),
                noTelp: noTelp.trim(),
                alamat: alamat.trim(),
                password,
            });
            router.push('/customer/dashboard');
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-[440px] max-w-full">
            <h1 className="text-[34px] leading-[40px] font-bold text-[#0f172b]">Buat Akun</h1>
            <p className="pt-[6px] text-[16px] leading-[24px] text-[#62748e]">Lengkapi informasi berikut untuk mendaftar</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px] pt-[24px]">
                <PlainField id="fullName" label="Nama Lengkap" type="text" placeholder="Budi Santoso" autoComplete="name" icon={<User size={18} />} value={nama} onChange={setNama} />
                <PlainField id="phone" label="Nomor HP" type="tel" placeholder="08xxxxxxxxxx" autoComplete="tel" icon={<Phone size={18} />} value={noTelp} onChange={setNoTelp} />
                <PlainField id="email" label="Email" type="email" placeholder="email@contoh.com" autoComplete="email" icon={<Mail size={18} />} value={email} onChange={setEmail} />
                <PlainField id="address" label="Alamat" type="text" placeholder="Jalan Gatot Subroto No. 50, Keputih, Surabaya, 11111" autoComplete="street-address" icon={<MapPin size={18} />} value={alamat} onChange={setAlamat} />
                <PasswordField id="password" label="Password" placeholder="Minimal 6 karakter" autoComplete="new-password" value={password} onChange={setPassword} />
                <PasswordField id="confirmPassword" label="Konfirmasi Password" placeholder="Ulangi password" autoComplete="new-password" value={confirmPassword} onChange={setConfirmPassword} />

                <p className="text-[13px] leading-[18px] text-[#62748e]">
                    Dengan mendaftar, Anda menyetujui{' '}
                    <Link href="#" className="font-medium text-[#0f766e]">
                        Syarat &amp; Ketentuan
                    </Link>{' '}
                    dan{' '}
                    <Link href="#" className="font-medium text-[#0f766e]">
                        Kebijakan Privasi
                    </Link>{' '}
                    NiLaundry.
                </p>

                {error && (
                    <p role="alert" className="text-[14px] leading-[20px] font-medium text-[#dc2626]">
                        {error}
                    </p>
                )}

                <div className="pt-[6px]">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-[9px] rounded-[12px] bg-[#0f766e] py-[14px] text-[16px] leading-[24px] font-semibold text-white drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#0d655e] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Memproses…' : 'Daftar Sekarang'} <ArrowRight size={18} />
                    </button>
                </div>
            </form>

            <p className="pt-[24px] text-center text-[15px] leading-[22px] text-[#62748e]">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-[16px] font-semibold text-[#0f766e]">
                    Masuk di sini
                </Link>
            </p>
        </div>
    );
}
