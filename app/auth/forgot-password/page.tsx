'use client';

import { useActionState } from 'react';
import { requestPasswordReset } from '@/app/lib/password-actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { User, Mail, Calendar, ArrowRight, Shield, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [errorMessage, formAction, isPending] = useActionState(
        requestPasswordReset,
        undefined
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side: Form */}
                <div className="bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden p-8">
                    <div className="space-y-2 mb-8">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Forgot Password</h1>
                        <p className="text-muted-foreground">Verify your identity to reset your password.</p>
                    </div>

                    <form action={formAction} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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

                        {/* Birthdate */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1" htmlFor="birthdate">Birthdate (Verification)</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <input
                                    id="birthdate"
                                    name="birthdate"
                                    type="date"
                                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4" disabled={isPending}>
                            {isPending ? 'Verifying...' : 'Verify & Reset'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground mt-6">
                        Remember your password?{' '}
                        <Link href="/auth/login" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Right Side: Visual Content */}
                <div className="hidden lg:flex flex-col justify-center space-y-6 text-primary p-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                            <Shield className="h-3 w-3" /> Secure Account Recovery
                        </div>
                        <h2 className="text-5xl font-extrabold tracking-tighter leading-tight text-foreground">
                            Regain <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Access</span> Instantly
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                            Verify your identity securely using your registered details and get back to managing your resources.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
