'use client';

import { useSidebar } from '@/app/ui/dashboard/sidebar-context';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import MobileMenu from '@/app/ui/dashboard/mobile-menu';

export default function SidebarWrapper({ children }: { children: ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <>
            {/* Desktop Sidebar */}
            <div
                className={cn(
                    "hidden flex-none border-r border-border/50 transition-all duration-300 ease-in-out md:block",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                {children}
            </div>

            {/* Mobile Menu (Floating Card) */}
            <MobileMenu />
        </>
    );
}
