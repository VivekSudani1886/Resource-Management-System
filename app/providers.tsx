'use client';

import { ThemeProvider } from './theme-provider';
import { ToastProvider } from './ui/toast';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ToastProvider>
                {children}
            </ToastProvider>
        </ThemeProvider>
    );
}
