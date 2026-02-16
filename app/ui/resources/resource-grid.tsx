import { fetchResources, deleteResource } from '@/app/lib/resource-actions';
import { Box, MapPin, Users, Building2, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

export default async function ResourceGrid({ query }: { query: string }) {
    const resources = await fetchResources(query);

    if (!resources || resources.length === 0) {
        return (
            <div className="mt-6 p-12 text-center rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-muted-foreground">
                <p>No resources found matching "{query}".</p>
                <Link href="/admin/resources/create" className="text-primary hover:underline mt-2 inline-block">
                    Create a new resource
                </Link>
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

                    {/* Action buttons */}
                    <div className="p-6 pt-0 space-y-2">
                        <Link
                            href={`/admin/resources/${resource.resource_id}`}
                            className="inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all hover:shadow-md"
                        >
                            View Details
                        </Link>
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/admin/resources/${resource.resource_id}/edit`}
                                className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                <PencilIcon className="h-4 w-4" />
                                Edit
                            </Link>
                            <form action={deleteResource.bind(null, resource.resource_id)}>
                                <button
                                    type="submit"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

