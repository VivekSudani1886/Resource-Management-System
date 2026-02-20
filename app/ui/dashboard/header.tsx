'use client';

import { Bell, Search, User, PanelLeft } from 'lucide-react';
import { ModeToggle } from '@/app/ui/dashboard/theme-toggle';
import { UserDropdown } from '@/app/ui/dashboard/user-dropdown';
import { useSidebar } from '@/app/ui/dashboard/sidebar-context';
import { Button } from '@/app/ui/button';
import { Breadcrumbs } from '@/app/ui/dashboard/breadcrumbs';
import { NotificationsDropdown } from '@/app/ui/dashboard/notifications-dropdown';

export default function Header({ user }: { user: any }) {
    const { toggleSidebar, toggleMobileSidebar } = useSidebar();

    const handleToggle = () => {
        // We can check window width or just toggle both?
        // Simpler: If hidden (mobile), toggle mobile. If visible (desktop), toggle desktop.
        // But checking visibility requires ref/effect.
        // Let's rely on CSS media query logic if possible? No.
        // Let's just create a handler expecting window availability.
        if (window.innerWidth < 768) {
            toggleMobileSidebar();
        } else {
            toggleSidebar();
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/60 px-6 backdrop-blur-xl transition-all">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleToggle} className="text-muted-foreground hover:text-foreground">
                    <PanelLeft className="h-5 w-5" />
                </Button>
                <div className="flex flex-col">
                    <Breadcrumbs />
                    <h2 className="text-lg font-semibold text-foreground tracking-tight md:hidden">ResourceSys</h2>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar - Modern & Responsive */}
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="h-10 w-64 rounded-xl border border-border/50 bg-background/50 px-10 py-2 text-sm outline-none placeholder:text-muted-foreground focus:w-80 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <NotificationsDropdown />
                </div>

                {/* User Dropdown */}
                <UserDropdown user={user} />
            </div>
        </header>
    );
}
