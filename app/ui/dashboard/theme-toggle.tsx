'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-background/50 border border-border/50 shadow-sm animate-pulse" />;
    }

    return (
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500",
                "bg-background/80 border border-border/50 backdrop-blur-sm shadow-sm hover:shadow-md",
                "hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-primary/20",
                "dark:bg-slate-900/80 dark:border-slate-800"
            )}
            aria-label="Toggle theme"
        >
            <div className="relative h-5 w-5 flex items-center justify-center overflow-hidden">
                <Sun
                    className={cn(
                        "h-full w-full transition-all duration-500 transform",
                        "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
                        theme === 'dark' ? "translate-y-10 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"
                    )}
                />
                <Moon
                    className={cn(
                        "absolute h-full w-full transition-all duration-500 transform",
                        "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]",
                        theme === 'dark' ? "translate-y-0 rotate-0 opacity-100" : "-translate-y-10 -rotate-90 opacity-0"
                    )}
                />
            </div>

            {/* Hover effect background ring */}
            <div className={cn(
                "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none",
                theme === 'dark' ? "bg-indigo-400" : "bg-amber-500"
            )} />

            <span className="sr-only">Toggle theme</span>
        </button>
    );
}

