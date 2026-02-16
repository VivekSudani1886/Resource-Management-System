'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import { authenticate } from '@/app/lib/actions';
import { AtSign, Key, Loader2 } from 'lucide-react';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useToast } from '@/app/ui/toast';

export default function LoginForm() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const formRef = useRef<HTMLFormElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    // Reset only password field and show toast when there's an error
    useEffect(() => {
        if (errorMessage) {
            showToast(errorMessage, 'error');
            if (passwordRef.current) {
                passwordRef.current.value = '';
                passwordRef.current.focus();
            }
        }
    }, [errorMessage, showToast]);

    return (
        <form ref={formRef} action={dispatch} className="space-y-3">
            <div className="flex-1 rounded-lg bg-card px-6 pb-4 pt-8 shadow-md border border-border">
                <h1 className="mb-3 text-2xl font-bold text-foreground">
                    Please log in to continue.
                </h1>
                <div className="w-full space-y-4">
                    <div>
                        <label
                            className="mb-2 block text-xs font-medium text-foreground uppercase tracking-wider"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-lg border border-input bg-background py-3 pl-10 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                required
                            />
                            <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label
                                className="block text-xs font-medium text-foreground uppercase tracking-wider"
                                htmlFor="password"
                            >
                                Password
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                ref={passwordRef}
                                className="peer block w-full rounded-lg border border-input bg-background py-3 pl-10 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter your secure password"
                                required
                                minLength={6}
                            />
                            <Key className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors" />
                        </div>
                        <div className="mt-2 flex justify-end">
                            <Link href="/auth/forgot-password" className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <LoginButton />
                </div>
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                </div>
                <div className="mt-4 text-center">
                    <Link href="/auth/register" className="text-sm text-primary hover:underline font-medium">
                        Create an account
                    </Link>
                </div>
            </div>
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            aria-disabled={pending}
            disabled={pending}
        >
            {pending ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
            Log in
        </Button>
    );
}
