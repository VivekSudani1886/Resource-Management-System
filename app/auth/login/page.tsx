'use client';

import { Shield } from 'lucide-react';
import LoginContent from '@/app/ui/login-content';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side: Login Form */}
                <div className="bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
                    <LoginContent />
                </div>

                {/* Right Side: Visual Content */}
                <div className="hidden lg:flex flex-col justify-center space-y-6 text-primary p-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                            <Shield className="h-3 w-3" /> System Overview
                        </div>
                        <h2 className="text-5xl font-extrabold tracking-tighter leading-tight text-foreground">
                            Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Resource</span> Management
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                            Seamlessly manage assets, track bookings, and oversee maintenance with our intuitive dashboards tailored for every role.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-xl">
                            <div className="text-3xl font-bold text-foreground">15+</div>
                            <div className="text-sm text-muted-foreground uppercase font-bold tracking-widest mt-1">Resources</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-primary shadow-2xl shadow-primary/30">
                            <div className="text-3xl font-bold text-primary-foreground">24/7</div>
                            <div className="text-sm text-primary-foreground/80 uppercase font-bold tracking-widest mt-1">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
