'use client';

import React from 'react';
import Sidebar from '@/components/ui/customer/Sidebar';
import { SidebarProvider, useSidebar } from '@/lib/SidebarContext';

function ShellInner({ children }: { children: React.ReactNode }) {
    const { collapsed, ready } = useSidebar();
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main
                className={`flex min-h-screen flex-1 flex-col p-8 ${ready ? 'transition-[margin] duration-300 ease-in-out' : ''} ${
                    collapsed ? 'ml-20' : 'ml-[280px]'
                }`}
            >
                {children}
            </main>
        </div>
    );
}

export default function CustomerShell({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <ShellInner>{children}</ShellInner>
        </SidebarProvider>
    );
}
