'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
    collapsed: boolean;
    /** False until the persisted value has been read on the client. Used to skip the first-paint animation. */
    ready: boolean;
    toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
    collapsed: false,
    ready: false,
    toggle: () => {},
});

const STORAGE_KEY = 'nilaundry:sidebar-collapsed';

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [ready, setReady] = useState(false);

    // Read the persisted state after mount so server and client first render match (no hydration mismatch).
    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored !== null) setCollapsed(stored === 'true');
        setReady(true);
    }, []);

    // Persist on change (only once we've hydrated, so we don't clobber the stored value on first paint).
    useEffect(() => {
        if (ready) window.localStorage.setItem(STORAGE_KEY, String(collapsed));
    }, [collapsed, ready]);

    return (
        <SidebarContext.Provider value={{ collapsed, ready, toggle: () => setCollapsed((c) => !c) }}>
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => useContext(SidebarContext);
