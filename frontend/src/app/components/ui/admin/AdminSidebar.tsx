'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    WashingMachine,
    LayoutGrid,
    GitBranchPlus,
    Layers,
    Ticket,
    Users,
    Truck,
    BookUser,
    ClipboardList,
    CreditCard,
    LogOut,
} from 'lucide-react';

const navLinks = [
    { href: '/admin/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { href: '/admin/branches', icon: GitBranchPlus, label: 'Branches' },
    { href: '/admin/services', icon: Layers, label: 'Services' },
    { href: '/admin/vouchers', icon: Ticket, label: 'Vouchers' },
    { href: '/admin/staffs', icon: Users, label: 'Staffs' },
    { href: '/admin/couriers', icon: Truck, label: 'Couriers' },
    { href: '/admin/customers', icon: BookUser, label: 'Customers' },
    { href: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
];

// Labels are hidden while collapsed and fade in when the sidebar is hovered (expanded).
const labelClass =
    'min-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100';

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="group peer fixed inset-y-0 left-0 z-20 flex w-20 flex-col justify-between overflow-hidden border-r border-[#bdc9c6] bg-white px-4 py-6 transition-[width] duration-300 ease-in-out hover:w-[280px]">
            <div className="flex min-h-0 flex-1 flex-col">
                {/* Branding — links to dashboard */}
                <Link href="/admin/dashboard" className="flex w-full items-center gap-4 px-4 pb-8 text-left">
                    <div className="flex size-10 shrink-0 -translate-x-3 items-center justify-center rounded-lg bg-[#005c55] text-white transition-transform duration-300 ease-in-out group-hover:translate-x-0">
                        <WashingMachine size={20} />
                    </div>
                    <div className={labelClass}>
                        <h1 className="text-[20px] leading-7 font-semibold text-[#005c55]">NiLaundry</h1>
                        <p className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#6e7977]">
                            Admin Dashboard
                        </p>
                    </div>
                </Link>

                {/* Nav */}
                <nav className="flex flex-col gap-1 overflow-y-auto">
                    {navLinks.map(({ href, icon: Icon, label }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                title={label}
                                className={`flex items-center gap-4 rounded-lg py-2 text-[14px] leading-5 font-medium transition-colors duration-150 ${
                                    isActive
                                        ? 'border-l-2 border-[#005c55] bg-[#6df5e1] pl-[14px] pr-4 text-[#006f64]'
                                        : 'px-4 text-[#3e4947] hover:bg-gray-50'
                                }`}
                            >
                                <Icon size={18} className="shrink-0" />
                                <span className={labelClass}>{label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-1 border-t border-[#bdc9c6] pt-[9px]">
                <Link
                    href="/logout"
                    title="Logout"
                    className="flex items-center gap-4 rounded-lg px-4 py-2 text-[14px] leading-5 font-medium text-[#3e4947] transition-colors hover:bg-gray-50"
                >
                    <LogOut size={18} className="shrink-0" />
                    <span className={labelClass}>Logout</span>
                </Link>
            </div>
        </aside>
    );
}
