'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type SidebarContextType = {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    isMobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
    toggleMobileSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => !prev);
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen((prev) => !prev);
    };

    const setMobileOpen = (open: boolean) => {
        setIsMobileOpen(open);
    };

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isMobileOpen, toggleMobileSidebar, setMobileOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
