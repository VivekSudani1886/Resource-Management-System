'use client';

import { createResource } from '@/app/lib/resource-actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { useToast } from '@/app/ui/toast';
import { useRouter } from 'next/navigation';

export default function Form({ buildings, types }: { buildings: any[], types: any[] }) {
    // @ts-ignore
    const [state, dispatch] = useActionState(createResource, { message: '', success: false, errors: {} });
    const { showToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            showToast('Resource created successfully!', 'success');
            setTimeout(() => {
                router.push('/admin/resources');
            }, 1000);
        } else if (state?.message && !state?.success) {
            showToast(state.message, 'error');
        }
    }, [state, showToast, router]);

    return (
        <form action={dispatch} className="rounded-xl bg-card p-6 shadow-sm border border-border">
            {/* Resource Name */}
            <div className="mb-6">
                <label htmlFor="resource_name" className="mb-2 block text-sm font-medium text-foreground">
                    Resource Name
                </label>
                <div className="relative mt-2">
                    <input
                        id="resource_name"
                        name="resource_name"
                        type="text"
                        placeholder="e.g., Executive Conference Room A"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-describedby="name-error"
                    />
                </div>
                {state.errors?.resource_name && (
                    <div id="name-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                        {state.errors.resource_name.map((error: string) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}
                <p className="mt-1 text-xs text-muted-foreground">Give your resource a clear, identifiable name.</p>
            </div>

            {/* Type */}
            <div className="mb-6">
                <label htmlFor="resource_type" className="mb-2 block text-sm font-medium text-foreground">
                    Resource Type
                </label>
                <div className="relative">
                    <select
                        id="resource_type_id"
                        name="resource_type_id"
                        className="peer block w-full cursor-pointer rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        defaultValue=""
                        aria-describedby="type-error"
                    >
                        <option value="" disabled className="text-muted-foreground">
                            Select a resource type...
                        </option>
                        {types.map((type) => (
                            <option key={type.resource_type_id} value={type.resource_type_id}>
                                {type.type_name}
                            </option>
                        ))}
                    </select>
                </div>
                {state.errors?.resource_type_id && (
                    <div id="type-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                        {state.errors.resource_type_id.map((error: string) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* Building */}
            <div className="mb-6">
                <label htmlFor="building" className="mb-2 block text-sm font-medium text-foreground">
                    Building
                </label>
                <div className="relative">
                    <select
                        id="building_id"
                        name="building_id"
                        className="peer block w-full cursor-pointer rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        defaultValue=""
                        aria-describedby="building-error"
                    >
                        <option value="" disabled>
                            Select a location...
                        </option>
                        {buildings.map((b) => (
                            <option key={b.building_id} value={b.building_id}>
                                {b.building_name}
                            </option>
                        ))}
                    </select>
                </div>
                {state.errors?.building_id && (
                    <div id="building-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                        {state.errors.building_id.map((error: string) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* Floor & Capacity */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-1">
                    <label htmlFor="floor_number" className="mb-2 block text-sm font-medium text-foreground">
                        Floor Number
                    </label>
                    <input
                        id="floor_number"
                        name="floor_number"
                        type="number"
                        placeholder="e.g., 3"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-describedby="floor-error"
                    />
                    {state.errors?.floor_number && (
                        <div id="floor-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                            {state.errors.floor_number.map((error: string) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <label htmlFor="capacity" className="mb-2 block text-sm font-medium text-foreground">
                        Capacity
                    </label>
                    <input
                        id="capacity"
                        name="capacity"
                        type="number"
                        placeholder="e.g., 12"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-describedby="capacity-error"
                    />
                    {state.errors?.capacity && (
                        <div id="capacity-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                            {state.errors.capacity.map((error: string) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="mb-8">
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-foreground">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe the amenities and features of this resource..."
                    className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/50">
                <div aria-live="polite" className="flex-1">
                </div>
                <Link
                    href="/admin/resources"
                >
                    <Button variant="ghost" type="button">Cancel</Button>
                </Link>
                <Button type="submit">Create Resource</Button>
            </div>
        </form>
    );
}
