'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const icons = {
        success: <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />,
        error: <AlertCircle className="h-5 w-5 text-rose-500 dark:text-rose-400" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
        info: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
    };

    const styles = {
        success: 'bg-background/80 border-emerald-500/30 shadow-[0_4px_24px_rgba(16,185,129,0.2)]',
        error: 'bg-background/80 border-rose-500/30 shadow-[0_4px_24px_rgba(244,63,94,0.2)]',
        warning: 'bg-background/80 border-amber-500/30 shadow-[0_4px_24px_rgba(245,158,11,0.2)]',
        info: 'bg-background/80 border-blue-500/30 shadow-[0_4px_24px_rgba(59,130,246,0.2)]',
    };

    const iconBgStyles = {
        success: 'bg-emerald-500/10',
        error: 'bg-rose-500/10',
        warning: 'bg-amber-500/10',
        info: 'bg-blue-500/10',
    };

    return (
        <div
            className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-xl border pointer-events-auto transition-all duration-500 transform backdrop-blur-xl",
                isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95",
                styles[toast.type]
            )}
            style={{ minWidth: '320px', maxWidth: '450px' }}
        >
            <div className={cn("flex-shrink-0 p-2 rounded-xl backdrop-blur-sm transition-colors", iconBgStyles[toast.type])}>
                {icons[toast.type]}
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold tracking-tight text-foreground leading-snug">
                    {toast.message}
                </p>
            </div>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onRemove(toast.id), 500);
                }}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors active:scale-95 group"
                aria-label="Close notification"
            >
                <X className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
        </div>
    );
}

