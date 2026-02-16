'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, KeyRound, ChevronDown, UserCircle } from 'lucide-react';
import { Button } from '@/app/ui/button';
import { logout } from '@/app/lib/actions';
import { usePathname } from 'next/navigation';

const userDataMapping = {
    admin: { name: 'Admin User', email: 'admin@rms.com' },
    user: { name: 'Student One', email: 'student1@rms.com' },
    approver: { name: 'Staff Approver', email: 'approver@rms.com' },
    maintenance: { name: 'Maintenance Guy', email: 'maint@rms.com' },
};

export function UserDropdown({ user }: { user?: { name?: string | null, email?: string | null, role?: string } }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const displayUser = {
        name: user?.name || 'User',
        email: user?.email || 'user@example.com',
        role: user?.role || 'user'
    };


    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-3 hover:bg-accent/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                </div>
                <div className="hidden sm:flex flex-col items-start text-left">
                    <span className="text-sm font-medium leading-none capitalize">{displayUser.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{displayUser.role}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-border bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="flex flex-col space-y-1 p-2">
                        <div className="px-3 py-2 mb-1 border-b border-border/50">
                            <p className="text-sm font-semibold text-foreground">{displayUser.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{displayUser.email}</p>
                        </div>

                        <div className="space-y-1">
                            <Link
                                href={`/${displayUser.role || 'user'}/profile`}
                                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted group-hover:bg-primary/20 transition-colors">
                                    <UserCircle className="h-4 w-4" />
                                </div>
                                <span>My Profile</span>
                            </Link>

                            <Link
                                href={`/${displayUser.role || 'user'}/profile/change-password`}
                                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted group-hover:bg-primary/20 transition-colors">
                                    <KeyRound className="h-4 w-4" />
                                </div>
                                <span>Change Password</span>
                            </Link>
                        </div>

                        <div className="h-px bg-border/50 my-2" />

                        <form
                            action={logout}
                        >
                            <button
                                type="submit"
                                onClick={() => {
                                    localStorage.removeItem('rms-user-role');
                                }}
                                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                                    <LogOut className="h-4 w-4" />
                                </div>
                                <span>Sign Out</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
