'use client';

import { useActionState, useEffect, useRef } from 'react';
import { User, Lock, ArrowRight, Shield, BookOpen, ClipboardCheck, Wrench, AlertCircle } from 'lucide-react';
import { Button } from '@/app/ui/button';
import { authenticate } from '@/app/lib/actions';
import Link from 'next/link';

const roles = [
    {
        name: 'Admin',
        email: 'admin@rms.com',
        password: 'password',
        icon: Shield,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        name: 'Student',
        email: 'student1@rms.com',
        password: 'password',
        icon: BookOpen,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
    },
    {
        name: 'Approver',
        email: 'approver@rms.com',
        password: 'password',
        icon: ClipboardCheck,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
    {
        name: 'Maintenance',
        email: 'maint@rms.com',
        password: 'password',
        icon: Wrench,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
    },
];

export default function LoginContent() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const passwordRef = useRef<HTMLInputElement>(null);

    // Clear password field when there's an error
    useEffect(() => {
        if (errorMessage && passwordRef.current) {
            passwordRef.current.value = '';
            passwordRef.current.focus();
        }
    }, [errorMessage]);

    return (
        <div className="space-y-8 bg-card p-8 rounded-3xl border border-border/50 shadow-none">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome Back</h1>
                <p className="text-muted-foreground">Select a role or enter your credentials to continue.</p>
            </div>

            <form action={dispatch} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1" htmlFor="email">Email Address</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
                        <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <input
                            ref={passwordRef}
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                {errorMessage && (
                    <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    </div>
                )}

                <Button type="submit" className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                    Create an account
                </Link>
            </div>
        </div>
    );
}
