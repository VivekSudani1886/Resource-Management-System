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
        success: <CheckCircle2 className="h-5 w-5 text-emerald-100" />,
        error: <AlertCircle className="h-5 w-5 text-red-100" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-100" />,
        info: <Info className="h-5 w-5 text-blue-100" />,
    };

    const styles = {
        success: 'bg-emerald-600 border-emerald-500/50 shadow-emerald-500/20',
        error: 'bg-rose-600 border-rose-500/50 shadow-rose-500/20',
        warning: 'bg-amber-600 border-amber-500/50 shadow-amber-500/20',
        info: 'bg-blue-600 border-blue-500/50 shadow-blue-500/20',
    };

    return (
        <div
            className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-xl border shadow-2xl pointer-events-auto transition-all duration-500 transform",
                isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
                styles[toast.type],
                "text-white backdrop-blur-md"
            )}
            style={{ minWidth: '320px', maxWidth: '450px' }}
        >
            <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                {icons[toast.type]}
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold tracking-tight leading-snug">
                    {toast.message}
                </p>
            </div>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onRemove(toast.id), 500);
                }}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/20 transition-all active:scale-95 group"
                aria-label="Close notification"
            >
                <X className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
            </button>
        </div>
    );
}

