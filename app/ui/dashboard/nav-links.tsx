'use client';

import {
    LayoutDashboard,
    Box,
    CalendarCheck,
    ClipboardList,
    Wrench,
    BarChart3,
    Users,
    History,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/app/ui/dashboard/sidebar-context';
import { useEffect, useState } from 'react';

// Map of links to display in the side navigation.
const links = [
    { name: 'Dashboard', href: '/overview', icon: LayoutDashboard },
    { name: 'Resources', href: '/admin/resources', icon: Box },
    { name: 'Resources', href: '/user/resources', icon: Box }, // User specific resources link
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'My Bookings', href: '/user/bookings', icon: CalendarCheck },
    { name: 'All Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Approvals', href: '/admin/approvals', icon: ClipboardList },
    { name: 'Approvals', href: '/approver/approvals', icon: ClipboardList }, // Approver specific link
    { name: 'History', href: '/approver/history', icon: History }, // Approver history link
    { name: 'Maintenance', href: '/admin/maintenance', icon: Wrench },
    { name: 'My Tasks', href: '/maintenance/maintenance', icon: Wrench }, // Maintenance specific link
    { name: 'Resources', href: '/maintenance/resources', icon: Box }, // Maintenance specific link
    { name: 'History', href: '/maintenance/history', icon: History }, // Maintenance specific link
];

export default function NavLinks({ role }: { role: string }) {
    const pathname = usePathname();
    const { isCollapsed, setMobileOpen } = useSidebar();

    // Determine roles for filtering
    const isAdmin = role === 'admin';
    const isUser = role === 'user';
    const isApprover = role === 'approver';
    const isMaintenance = role === 'maintenance';

    // Filter links based on passed role
    const filteredLinks = links.filter((link) => {
        // Dashboard link is always shown
        if (link.href === '/overview') return true;

        // Strict role-based filtering
        if (isAdmin) {
            // Admin sees everything starting with /admin
            return link.href.startsWith('/admin');
        }
        if (isUser) {
            // User only sees /user links
            return link.href.startsWith('/user');
        }
        if (isApprover) {
            // Approver only sees /approver links
            return link.href.startsWith('/approver');
        }
        if (isMaintenance) {
            // Maintenance only sees /maintenance links
            return link.href.startsWith('/maintenance');
        }
        return false;
    });

    return (
        <>
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

                return (
                    <Link
                        key={link.name}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        title={isCollapsed ? link.name : undefined}
                        className={cn(
                            'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-background p-3 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary md:flex-none md:justify-start md:p-2 md:px-3 transition-all duration-300 overflow-hidden whitespace-nowrap',
                            {
                                'bg-primary/10 text-primary font-semibold': pathname === href,
                                'justify-center px-2': isCollapsed,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className={cn("hidden md:block transition-all duration-300 opacity-100", isCollapsed && "opacity-0 w-0 overflow-hidden")}>
                            {link.name}
                        </p>
                    </Link>
                );
            })}
        </>
    );
}
