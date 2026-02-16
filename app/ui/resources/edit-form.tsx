'use client';

import { updateResource } from '@/app/lib/resource-actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';

export default function EditResourceForm({ resource, buildings, types }: { resource: any; buildings: any[]; types: any[] }) {
    const updateResourceWithId = updateResource.bind(null, resource.resource_id);
    const initialState = { message: '', errors: {} };
    const [state, dispatch] = useActionState(updateResourceWithId, initialState);

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
                        defaultValue={resource.resource_name}
                        placeholder="e.g., Executive Conference Room A"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                    />
                </div>
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
                        defaultValue={resource.resource_type_id}
                        required
                    >
                        {types.map((type) => (
                            <option key={type.resource_type_id} value={type.resource_type_id}>
                                {type.type_name}
                            </option>
                        ))}
                    </select>
                </div>
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
                        defaultValue={resource.building_id}
                        required
                    >
                        {buildings.map((b) => (
                            <option key={b.building_id} value={b.building_id}>
                                {b.building_name}
                            </option>
                        ))}
                    </select>
                </div>
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
                        defaultValue={resource.floor_number}
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="capacity" className="mb-2 block text-sm font-medium text-foreground">
                        Capacity
                    </label>
                    <input
                        id="capacity"
                        name="capacity"
                        type="number"
                        defaultValue={resource.capacity || 0}
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                    />
                </div>
            </div>

            {/* Status */}
            <div className="mb-6">
                <label htmlFor="is_active" className="mb-2 block text-sm font-medium text-foreground">
                    Status
                </label>
                <div className="relative">
                    <select
                        id="is_active"
                        name="is_active"
                        className="peer block w-full cursor-pointer rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        defaultValue={resource.is_active ? 'active' : 'inactive'}
                        required
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
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
                    defaultValue={resource.description || ''}
                    className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/50">
                <Link
                    href="/admin/resources"
                >
                    <Button variant="ghost" type="button">Cancel</Button>
                </Link>
                <Button type="submit">Update Resource</Button>
            </div>
        </form>
    );
}
