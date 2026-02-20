'use client';

import {
    LayoutDashboard,
    Box,
    CalendarCheck,
    ClipboardList,
    Wrench,
    BarChart3,
    X,
    Users,
    History
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/app/ui/dashboard/sidebar-context';
import { Button } from '@/app/ui/button';

// Links configuration
const links = [
    { name: 'Dashboard', href: '/overview', icon: LayoutDashboard },
    { name: 'Resources', href: '/admin/resources', icon: Box },
    { name: 'Resources', href: '/user/resources', icon: Box },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'My Bookings', href: '/user/bookings', icon: CalendarCheck },
    { name: 'All Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Approvals', href: '/admin/approvals', icon: ClipboardList },
    { name: 'Approvals', href: '/approver/approvals', icon: ClipboardList },
    { name: 'History', href: '/approver/history', icon: History },
    { name: 'Maintenance', href: '/admin/maintenance', icon: Wrench },
    { name: 'My Tasks', href: '/maintenance/maintenance', icon: Wrench },
    { name: 'Resources', href: '/maintenance/resources', icon: Box },
    { name: 'History', href: '/maintenance/history', icon: History },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
];

export default function MobileMenu({ role }: { role: string }) {
    const pathname = usePathname();
    const { isMobileOpen, setMobileOpen } = useSidebar();

    // Determine roles for filtering
    const isAdmin = role === 'admin';
    const isUser = role === 'user';
    const isApprover = role === 'approver';
    const isMaintenance = role === 'maintenance';

    // Filter links based on passed role
    const filteredLinks = links.filter((link) => {
        if (link.href === '/overview') return true;

        if (isAdmin) return link.href.startsWith('/admin');
        if (isUser) return link.href.startsWith('/user');
        if (isApprover) return link.href.startsWith('/approver');
        if (isMaintenance) return link.href.startsWith('/maintenance');
        return false;
    });

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
                    {filteredLinks.map((link) => {
                        const LinkIcon = link.icon;
                        let href = link.href;

                        // Dynamic Dashboard Link
                        if (link.href === '/overview') {
                            if (isAdmin) href = '/admin';
                            else if (isUser) href = '/user';
                            else if (isApprover) href = '/approver';
                            else if (isMaintenance) href = '/maintenance';
                        }
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={`${link.name}-${href}`}
                                href={href}
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
