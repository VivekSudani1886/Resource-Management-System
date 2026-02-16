import BookingForm from '@/app/ui/bookings/create-form';
import { fetchResources } from '@/app/lib/resource-actions';

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{
        resourceId?: string;
    }>;
}) {
    const params = await searchParams;
    const resourceId = params?.resourceId;
    const resources = await fetchResources(); // Retrieve all resources

    return (
        <main className="max-w-2xl mx-auto">
            <h1 className="mb-4 text-xl md:text-2xl text-foreground font-bold">New Booking Request</h1>
            <p className="mb-8 text-muted-foreground">Select a resource and time slot to request a reservation.</p>
            <BookingForm resources={resources} initialResourceId={resourceId} />
        </main>
    );
}
