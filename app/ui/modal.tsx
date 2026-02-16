'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Modal({ children }: { children: React.ReactNode }) {
    const overlay = useRef(null);
    const wrapper = useRef(null);
    const router = useRouter();

    const onDismiss = () => {
        router.back();
    };

    const onClick = (e: React.MouseEvent) => {
        if (e.target === overlay.current || e.target === wrapper.current) {
            if (onDismiss) onDismiss();
        }
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onDismiss();
    };

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onKeyDown]);

    return (
        <div
            ref={overlay}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClick}
        >
            <div
                ref={wrapper}
                className="relative w-full max-w-lg bg-background rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 border border-border/50 max-h-[90vh] overflow-y-auto"
            >
                <button
                    onClick={onDismiss}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors z-10"
                >
                    <X className="h-5 w-5 text-muted-foreground" />
                </button>
                {children}
            </div>
        </div>
    );
}
