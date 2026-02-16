'use client';

import { useActionState } from 'react';
import { resetPassword } from '@/app/lib/password-actions';
import { Button } from '@/app/ui/button';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Shield, AlertCircle, KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [errorMessage, formAction, isPending] = useActionState(
        resetPassword,
        undefined
    );

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="p-6 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">Invalid or missing reset token.</span>
                    <Link href="/auth/login" className="ml-4 underline hover:text-destructive/80">Back to Login</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side: Form */}
                <div className="bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden p-8">
                    <div className="space-y-2 mb-8">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Set New Password</h1>
                        <p className="text-muted-foreground">Choose a strong password for your account.</p>
                    </div>

                    <form action={formAction} className="space-y-4">
                        <input type="hidden" name="token" value={token} />

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1" htmlFor="password">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter new password"
                                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${errorMessage.includes('successfully') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                                <AlertCircle className="h-4 w-4" />
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4" disabled={isPending}>
                            {isPending ? 'Resetting...' : 'Reset Password'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground mt-6">
                        <Link href="/auth/login" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Right Side: Visual Content */}
                <div className="hidden lg:flex flex-col justify-center space-y-6 text-primary p-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                            <KeyRound className="h-3 w-3" /> Security First
                        </div>
                        <h2 className="text-5xl font-extrabold tracking-tighter leading-tight text-foreground">
                            Protect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Digital Assets</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                            Create a strong, unique password to ensure the safety and integrity of your resource management data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
