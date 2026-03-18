'use client';

import { createBuilding } from '@/app/lib/resource-actions';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useToast } from '@/app/ui/toast';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

export default function CreateBuildingForm() {
    // @ts-ignore
    const [state, dispatch] = useActionState(createBuilding, { message: '', success: false, errors: {} });
    const { showToast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (state?.success) {
            showToast('Building created successfully!', 'success');
            formRef.current?.reset();
            setIsOpen(false);
        } else if (state?.message && !state?.success) {
            showToast(state.message, 'error');
            setIsOpen(true);
        }
    }, [state, showToast]);

    return (
        <div className="mb-4 rounded-xl bg-card p-6 shadow-sm border border-border transition-all">
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Add New Building</h2>
                    <p className="text-xs text-muted-foreground mt-1">Add a new building location before creating resources if it doesn't exist.</p>
                </div>
                <Button variant="ghost" size="icon" type="button">
                    {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                </Button>
            </div>
            
            {isOpen && (
                <form ref={formRef} action={dispatch} className="mt-6 animate-in slide-in-from-top-2 fade-in duration-200 block">
            
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-start">
                <div className="flex-1 w-full relative">
                    <label htmlFor="building_name" className="sr-only">
                        Building Name
                    </label>
                    <input
                        id="building_name"
                        name="building_name"
                        type="text"
                        placeholder="Building Name (e.g. Science Block)"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-describedby="bname-error"
                    />
                    {state.errors?.building_name && (
                        <div id="bname-error" aria-live="polite" className="mt-2 text-sm text-red-500 absolute">
                            {state.errors.building_name.map((error: string) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="flex-1 w-full relative">
                    <label htmlFor="building_number" className="sr-only">
                        Building Code
                    </label>
                    <input
                        id="building_number"
                        name="building_number"
                        type="text"
                        placeholder="Code/Number (e.g. SB-01)"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-describedby="bcode-error"
                    />
                    {state.errors?.building_number && (
                        <div id="bcode-error" aria-live="polite" className="mt-2 text-sm text-red-500 absolute">
                            {state.errors.building_number.map((error: string) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-full md:w-32 relative">
                    <label htmlFor="total_floors" className="sr-only">
                        Floors
                    </label>
                    <input
                        id="total_floors"
                        name="total_floors"
                        type="number"
                        min="1"
                        placeholder="Floors"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-describedby="bfloors-error"
                    />
                    {state.errors?.total_floors && (
                        <div id="bfloors-error" aria-live="polite" className="mt-2 text-sm text-red-500 absolute">
                            {state.errors.total_floors.map((error: string) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    )}
                </div>

                <Button type="submit" className="w-full md:w-auto py-3">Add Building</Button>
            </div>
        </form>
            )}
        </div>
    );
}
