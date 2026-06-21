import React from 'react';
import BranchSidebar from '@/components/ui/branch/BranchSidebar';

export default function BranchShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <BranchSidebar />
            {/* Margin tracks the sidebar width: collapsed rail by default, shifts when the sidebar is hover-expanded. */}
            <main className="ml-20 flex min-h-screen min-w-0 flex-1 flex-col bg-[#f7faf8] transition-[margin] duration-300 ease-in-out peer-hover:ml-[280px]">
                {children}
            </main>
        </div>
    );
}
