'use client';

import { createBooking } from '@/app/lib/booking-actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useActionState, useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, ChevronDownIcon } from 'lucide-react';
import { useToast } from '@/app/ui/toast';
import { useRouter } from 'next/navigation';

export default function BookingForm({ resources, initialResourceId }: { resources: any[], initialResourceId?: string }) {
    // @ts-ignore
    const [state, dispatch] = useActionState(createBooking, { message: '', success: false, errors: {} });
    const { showToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            showToast('Booking request submitted successfully!', 'success');
            setTimeout(() => {
                router.push('/user/bookings');
            }, 1000);
        } else if (state?.message && !state?.success) {
            showToast(state.message, 'error');
        }
    }, [state, showToast, router]);

    // Simple controlled inputs for datetime validation hint could be added here
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    // Track selected resource for maintenance warning
    const [selectedResourceId, setSelectedResourceId] = useState(initialResourceId || '');
    const selectedResource = resources.find((r: any) => String(r.resource_id) === String(selectedResourceId));
    const isUnderMaintenance = selectedResource?.is_active === false;

    return (
        <form action={dispatch} className="rounded-xl bg-card p-6 shadow-sm border border-border">
            {/* Resource */}
            <div className="mb-6">
                <label htmlFor="resource_id" className="mb-2 block text-sm font-medium text-foreground">
                    Select Resource
                </label>
                <div className="relative">
                    <select
                        id="resource_id"
                        name="resource_id"
                        className="peer block w-full appearance-none cursor-pointer rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        defaultValue={initialResourceId || ""}
                        required
                        aria-describedby="resource-error"
                        onChange={(e) => setSelectedResourceId(e.target.value)}
                    >
                        <option value="" disabled>Choose a resource...</option>
                        {resources.map((res: any) => (
                            <option key={res.resource_id} value={res.resource_id}>
                                {res.resource_name} ({res.buildings.building_name})
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
                </div>
                {isUnderMaintenance && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>This resource is currently under maintenance and cannot be booked. Please select a different resource.</span>
                    </div>
                )}
                {state.errors?.resource_id && (
                    <div id="resource-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                        {state.errors.resource_id.map((error: string) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* Date and Time */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div>
                    <label htmlFor="start_datetime" className="mb-2 block text-sm font-medium text-foreground">
                        Start Time
                    </label>
                    <div className="relative">
                        <input
                            id="start_datetime"
                            name="start_datetime"
                            type="datetime-local"
                            className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            required
                            aria-describedby="start-error"
                            onChange={(e) => setStart(e.target.value)}
                        />
                        <CalendarIcon className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-muted-foreground opacity-50" />
                    </div>
                    {state.errors?.start_datetime && (
                        <div id="start-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                            {state.errors.start_datetime.map((error: string) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="end_datetime" className="mb-2 block text-sm font-medium text-foreground">
                        End Time
                    </label>
                    <div className="relative">
                        <input
                            id="end_datetime"
                            name="end_datetime"
                            type="datetime-local"
                            className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            required
                            aria-describedby="end-error"
                            onChange={(e) => setEnd(e.target.value)}
                        />
                        <ClockIcon className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-muted-foreground opacity-50" />
                    </div>
                    {state.errors?.end_datetime && (
                        <div id="end-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                            {state.errors.end_datetime.map((error: string) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/50">
                <div aria-live="polite" className="flex-1">
                    {state.message && (
                        <p className="text-sm text-red-500">{state.message}</p>
                    )}
                </div>
                <Link href="/user/bookings">
                    <Button variant="ghost" type="button">Cancel</Button>
                </Link>
                <Button type="submit">Request Booking</Button>
            </div>
        </form>
    );
}
