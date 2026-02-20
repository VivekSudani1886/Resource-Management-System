'use client';

import { createMaintenanceRequest } from '@/app/lib/maintenance-actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';

export default function CreateMaintenanceForm({ resources }: { resources: any[] }) {
    const initialState = { message: '', errors: {} };
    const [state, dispatch] = useActionState(createMaintenanceRequest, initialState);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={dispatch} className="space-y-6">
                    <div className="grid gap-2">
                        <label htmlFor="resource_id" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Resource
                        </label>
                        <select
                            name="resource_id"
                            id="resource_id"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="">Select a resource...</option>
                            {resources.map((resource) => (
                                <option key={resource.resource_id} value={resource.resource_id}>
                                    {resource.resource_name} ({resource.buildings.building_name})
                                </option>
                            ))}
                        </select>
                        {state.errors?.resource_id && (
                            <p className="text-sm text-red-500">{state.errors.resource_id[0]}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="maintenance_type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Maintenance Type
                        </label>
                        <select
                            name="maintenance_type"
                            id="maintenance_type"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="">Select type...</option>
                            <option value="Repair">Repair</option>
                            <option value="Inspection">Inspection</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Replacement">Replacement</option>
                            <option value="Other">Other</option>
                        </select>
                        {state.errors?.maintenance_type && (
                            <p className="text-sm text-red-500">{state.errors.maintenance_type[0]}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="scheduled_date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Scheduled Date
                        </label>
                        <input
                            type="date"
                            name="scheduled_date"
                            id="scheduled_date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />
                        {state.errors?.scheduled_date && (
                            <p className="text-sm text-red-500">{state.errors.scheduled_date[0]}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="notes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            id="notes"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe the issue..."
                        />
                        {state.errors?.notes && (
                            <p className="text-sm text-red-500">{state.errors.notes[0]}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        {state.message && (
                            <p className={`text-sm ${state.message.includes('Successfully') ? 'text-green-500' : 'text-red-500'}`}>
                                {state.message}
                            </p>
                        )}
                        <div className="flex justify-end gap-4">
                            <Link href="/maintenance/maintenance">
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                            <Button type="submit">Submit Request</Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
