import React from 'react';
import Sidebar from '@/components/ui/customer/Sidebar';

export default function CustomerShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            {/* Margin tracks the sidebar width: collapsed rail by default, shifts when the sidebar is hover-expanded. */}
            <main className="ml-20 flex min-h-screen flex-1 flex-col p-8 transition-[margin] duration-300 ease-in-out peer-hover:ml-[280px]">
                {children}
            </main>
        </div>
    );
}
