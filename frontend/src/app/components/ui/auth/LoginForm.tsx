'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi, getApiErrorMessage } from '@/lib/api';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputClass =
        'h-[48px] w-full rounded-[12px] border border-[#e2e8f0] bg-white pl-[44px] pr-[16px] text-[15px] leading-[22px] text-[#0f172b] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#0f766e]';

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;
        setError(null);
        if (!email.trim() || !password) {
            setError('Email dan password wajib diisi.');
            return;
        }
        setIsSubmitting(true);
        try {
            const result = await authApi.login({ email: email.trim(), password });
            if (result.subjectType === 'pelanggan') {
                router.push('/customer/dashboard');
            } else if (result.role === 'superadmin') {
                router.push('/superadmin/dashboard');
            } else {
                router.push('/admin/dashboard');
            }
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-[440px] max-w-full">
            <h1 className="text-[34px] leading-[40px] font-bold text-[#0f172b]">Masuk</h1>
            <p className="pt-[6px] text-[16px] leading-[24px] text-[#62748e]">Masukkan kredensial Anda</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px] pt-[28px]">
                {/* Email */}
                <div className="flex flex-col gap-[8px]">
                    <label htmlFor="email" className="text-[15px] leading-[22px] font-medium text-[#314158]">
                        Email
                    </label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-[14px] top-[15px] text-[#94a3b8]" />
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="pelanggan@nilaundry.id"
                            autoComplete="email"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-[8px]">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-[15px] leading-[22px] font-medium text-[#314158]">
                            Password
                        </label>
                        <Link href="#" className="text-[13px] leading-[18px] font-medium text-[#0f766e]">
                            Lupa password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock size={18} className="absolute left-[14px] top-[15px] text-[#94a3b8]" />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className={`${inputClass} pr-[44px]`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                            className="absolute right-[14px] top-[15px] text-[#94a3b8] transition-colors hover:text-[#475569]"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <p role="alert" className="text-[14px] leading-[20px] font-medium text-[#dc2626]">
                        {error}
                    </p>
                )}

                {/* Submit */}
                <div className="pt-[6px]">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-[9px] rounded-[12px] bg-[#0f766e] py-[14px] text-[16px] leading-[24px] font-semibold text-white drop-shadow-[0px_1px_2px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#0d655e] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Memproses…' : 'Masuk'} <ArrowRight size={18} />
                    </button>
                </div>
            </form>

            <p className="pt-[28px] text-center text-[15px] leading-[22px] text-[#62748e]">
                Belum punya akun?{' '}
                <Link href="/register" className="text-[16px] font-semibold text-[#0f766e]">
                    Daftar sekarang
                </Link>
            </p>
        </div>
    );
}
