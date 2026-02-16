import { fetchResources } from '@/app/lib/resource-actions';
import { Box, MapPin, Users, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from '@/app/ui/button';

export default async function UserResourceGrid({ query }: { query: string }) {
    const resources = await fetchResources(query);

    if (!resources || resources.length === 0) {
        return (
            <div className="mt-6 p-12 text-center rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-muted-foreground">
                <p>No resources found matching "{query}".</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
            {resources.map((resource) => (
                <div key={resource.resource_id} className="group relative flex flex-col overflow-hidden rounded-xl bg-card border border-border shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
                    {/* Header with icon and status */}
                    <div className="p-6 pb-4 border-b border-border/50">
                        <div className="flex items-start justify-between mb-3">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                <Box className="h-6 w-6" />
                            </div>
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border shadow-sm ${resource.is_active
                                    ? 'bg-green-600 text-white border-transparent'
                                    : 'bg-red-600 text-white border-transparent'
                                }`}>
                                {resource.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <h3 className="font-bold text-xl text-foreground line-clamp-1 mb-1">
                            {resource.resource_name}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground">
                            {resource.resource_types?.type_name || 'Resource'}
                        </p>
                    </div>

                    {/* Details section */}
                    <div className="flex-1 p-6 pt-4 space-y-3">
                        {resource.buildings && (
                            <div className="flex items-start gap-3">
                                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-foreground">{resource.buildings.building_name}</p>
                                    <p className="text-muted-foreground">Floor {resource.floor_number}</p>
                                </div>
                            </div>
                        )}

                        {resource.capacity !== null && resource.capacity > 0 && (
                            <div className="flex items-center gap-3">
                                <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm text-foreground">
                                    <span className="font-semibold">{resource.capacity}</span> people capacity
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action button */}
                    <div className="p-6 pt-0">
                        <Link
                            href={`/user/bookings/create?resourceId=${resource.resource_id}`}
                            className={`inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold shadow-sm transition-all ${resource.is_active
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                                }`}
                            aria-disabled={!resource.is_active}
                            tabIndex={!resource.is_active ? -1 : undefined}
                            style={{ pointerEvents: !resource.is_active ? 'none' : 'auto' }}
                        >
                            {resource.is_active ? 'Book Now' : 'Unavailable'}
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
