'use client';

import { createResourceType } from '@/app/lib/resource-actions';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useToast } from '@/app/ui/toast';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

export default function CreateTypeForm() {
    // @ts-ignore
    const [state, dispatch] = useActionState(createResourceType, { message: '', success: false, errors: {} });
    const { showToast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (state?.success) {
            showToast('Resource Type created successfully!', 'success');
            formRef.current?.reset();
            setIsOpen(false);
        } else if (state?.message && !state?.success) {
            showToast(state.message, 'error');
            setIsOpen(true);
        }
    }, [state, showToast]);

    return (
        <div className="mb-8 rounded-xl bg-card p-6 shadow-sm border border-border transition-all">
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Add New Resource Type</h2>
                    <p className="text-xs text-muted-foreground mt-1">Add a new category before creating your resource if it doesn't already exist.</p>
                </div>
                <Button variant="ghost" size="icon" type="button">
                    {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                </Button>
            </div>

            {isOpen && (
                <form ref={formRef} action={dispatch} className="mt-6 animate-in slide-in-from-top-2 fade-in duration-200 block">
            
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-start">
                <div className="flex-1 w-full">
                    <label htmlFor="type_name" className="sr-only">
                        Resource Type Name
                    </label>
                    <input
                        id="type_name"
                        name="type_name"
                        type="text"
                        placeholder="e.g., Projector, Conference Room..."
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-describedby="name-error"
                    />
                    {state.errors?.type_name && (
                        <div id="name-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                            {state.errors.type_name.map((error: string) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    )}
                </div>
                <Button type="submit" className="w-full md:w-auto py-3">Add Type</Button>
            </div>
        </form>
            )}
        </div>
    );
}
