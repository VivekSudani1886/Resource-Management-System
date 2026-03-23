import BookingForm from '@/app/ui/bookings/create-form';
import { fetchResources } from '@/app/lib/resource-actions';
import { fetchResourcesUnderMaintenance } from '@/app/lib/maintenance-actions';
import { AlertCircle, Wrench } from 'lucide-react';

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{
        resourceId?: string;
    }>;
}) {
    const params = await searchParams;
    const resourceId = params?.resourceId;
    const resources = await fetchResources();
    const underMaintenance = await fetchResourcesUnderMaintenance();

    return (
        <main className="max-w-2xl mx-auto">
            <h1 className="mb-4 text-xl md:text-2xl text-foreground font-bold">New Booking Request</h1>
            <p className="mb-8 text-muted-foreground">Select a resource and time slot to request a reservation.</p>

            {underMaintenance.length > 0 && (
                <div className="mb-8 rounded-xl bg-card border border-border shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4 bg-destructive/10 border-b border-destructive/20">
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-foreground">Resources Under Maintenance</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">These resources are currently unavailable for booking.</p>
                        </div>
                    </div>
                    <div className="divide-y divide-border">
                        {underMaintenance.map((resource: any) => {
                            const latestMaintenance = resource.maintenance?.[0];
                            return (
                                <div key={resource.resource_id} className="flex items-start gap-4 px-5 py-4">
                                    <div className="mt-1 h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                                        <Wrench className="h-4 w-4 text-destructive" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-foreground">{resource.resource_name}</p>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {resource.buildings?.building_name} • Floor {resource.floor_number}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                                                Under Maintenance
                                            </span>
                                            {latestMaintenance && (
                                                <>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                                                        Type: {latestMaintenance.maintenance_type}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                                                        Scheduled: {new Date(latestMaintenance.scheduled_date).toLocaleDateString()}
                                                    </span>
                                                </>
                                            )}
                                            {resource.resource_types && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                                                    {resource.resource_types.type_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <BookingForm resources={resources} initialResourceId={resourceId} />
        </main>
    );
}
