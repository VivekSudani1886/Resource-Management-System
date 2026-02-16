'use client';

import {
    LayoutDashboard,
    Box,
    CalendarCheck,
    ClipboardList,
    Wrench,
    BarChart3,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/app/ui/dashboard/sidebar-context';
import { Button } from '@/app/ui/button';

// Links configuration
const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resources', href: '/dashboard/resources', icon: Box },
    { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarCheck },
    { name: 'Approvals', href: '/dashboard/approvals', icon: ClipboardList },
    { name: 'Maintenance', href: '/dashboard/maintenance', icon: Wrench },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
];

export default function MobileMenu() {
    const pathname = usePathname();
    const { isMobileOpen, setMobileOpen } = useSidebar();

    if (!isMobileOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 md:hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setMobileOpen(false)}
            />

            {/* Floating Card */}
            <div className="relative z-50 w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-popover/95 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 slide-in-from-top-10">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
                    <span className="text-lg font-bold tracking-tight text-foreground">Menu</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-muted"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Links */}
                <nav className="flex flex-col p-2">
                    {links.map((link) => {
                        const LinkIcon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <div className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-background"
                                )}>
                                    <LinkIcon className="h-4 w-4" />
                                </div>
                                <span className="text-base">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / CTA (Optional, adding a pseudo 'Sign Out' or similar could go here if requested, keeping simple for now) */}
                <div className="bg-muted/30 p-4 text-center text-xs text-muted-foreground">
                    ResourceSys Mobile
                </div>
            </div>
        </div>
    );
}
