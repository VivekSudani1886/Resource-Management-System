'use client';

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { LayoutDashboard } from 'lucide-react';
import { useSidebar } from '@/app/ui/dashboard/sidebar-context';
import { cn } from '@/lib/utils';

export default function SideNav({ role }: { role: string }) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex h-full flex-col border-r bg-card/50 backdrop-blur-xl relative">
            <Link
                className={cn("flex h-16 items-center border-b bg-background/50 transition-all duration-300 overflow-hidden", isCollapsed ? "justify-center px-0" : "px-6")}
                href="/overview"
            >
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <div className="h-8 w-8 min-w-[2rem] rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <span className={cn("tracking-tight transition-all duration-300 whitespace-nowrap", isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto")}>ResourceSys</span>
                </div>
            </Link>

            <div className="flex grow flex-col justify-between space-y-2 px-3 py-4">
                <div className="space-y-1">
                    <NavLinks role={role} />
                </div>
            </div>

        </div>
    );
}
