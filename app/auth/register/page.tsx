'use client';

import { useActionState, useEffect, useRef } from 'react';
import { registerUser } from '@/app/lib/user-actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { User, Mail, Lock, AlertCircle, Shield, ArrowRight, Calendar } from 'lucide-react';
import { useToast } from '@/app/ui/toast';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const initialState = { message: null, errors: {} };
    // @ts-ignore
    const [state, dispatch] = useActionState(registerUser, initialState);
    const { showToast } = useToast();
    const router = useRouter();
    const hasShownToast = useRef(false);

    // Show success toast when registration is successful
    useEffect(() => {
        if (state?.success && !hasShownToast.current) {
            hasShownToast.current = true;
            showToast('Registration successful! Please log in.', 'success');
            // Redirect after showing toast
            setTimeout(() => {
                router.push('/auth/login');
            }, 1500);
        }
    }, [state?.success, showToast, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side: Register Form */}
                <div className="bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden p-8">
                    <div className="space-y-2 mb-8">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Create Account</h1>
                        <p className="text-muted-foreground">Enter your details to register for access.</p>
                    </div>

                    <form action={dispatch} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1" htmlFor="name">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                                    required
                                />
                            </div>
                            {state.errors?.name && state.errors.name.map((error: string) => (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1" key={error}>
                                    <AlertCircle className="h-3 w-3" /> {error}
                                </p>
                            ))}
                        </div>

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
                            {state.errors?.email && state.errors.email.map((error: string) => (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1" key={error}>
                                    <AlertCircle className="h-3 w-3" /> {error}
                                </p>
                            ))}
                        </div>

                        {/* Birthdate */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1" htmlFor="birthdate">Date of Birth</label>
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
                            {state.errors?.birthdate && state.errors.birthdate.map((error: string) => (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1" key={error}>
                                    <AlertCircle className="h-3 w-3" /> {error}
                                </p>
                            ))}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1" htmlFor="password">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Create a password"
                                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                />
                            </div>
                            {state.errors?.password && state.errors.password.map((error: string) => (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1" key={error}>
                                    <AlertCircle className="h-3 w-3" /> {error}
                                </p>
                            ))}
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
                                    placeholder="Confirm your password"
                                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                />
                            </div>
                            {state.errors?.confirmPassword && state.errors.confirmPassword.map((error: string) => (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1" key={error}>
                                    <AlertCircle className="h-3 w-3" /> {error}
                                </p>
                            ))}
                        </div>

                        {state.message && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <p>{state.message}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Right Side: Visual Content */}
                <div className="hidden lg:flex flex-col justify-center space-y-6 text-primary p-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                            <Shield className="h-3 w-3" /> Join the Network
                        </div>
                        <h2 className="text-5xl font-extrabold tracking-tighter leading-tight text-foreground">
                            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Journey</span> Today
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                            Create your account to access resources, manage bookings, and collaborate with your team efficiently.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
