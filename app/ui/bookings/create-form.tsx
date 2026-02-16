'use client';

import { createBooking } from '@/app/lib/booking-actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useActionState, useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon } from 'lucide-react';
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
                        className="peer block w-full cursor-pointer rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        defaultValue={initialResourceId || ""}
                        required
                        aria-describedby="resource-error"
                    >
                        <option value="" disabled>Choose a resource...</option>
                        {resources.map((res) => (
                            <option key={res.resource_id} value={res.resource_id}>
                                {res.resource_name} ({res.buildings.building_name})
                            </option>
                        ))}
                    </select>
                </div>
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
