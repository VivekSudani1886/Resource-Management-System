import { fetchResourceById, deleteResource } from '@/app/lib/resource-actions';
import { notFound } from 'next/navigation';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from 'lucide-react';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const resourceId = Number(id);
    const resource = await fetchResourceById(resourceId);

    if (!resource) {
        notFound();
    }

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Resource Details</h1>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/resources/${resourceId}/edit`}>
                        <Button className="flex items-center gap-2">
                            <PencilIcon className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
                        </Button>
                    </Link>
                    <form action={async () => {
                        "use server";
                        await deleteResource(resourceId);
                    }}>
                        <Button variant="destructive" className="flex items-center gap-2">
                            <TrashIcon className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
                        </Button>
                    </form>
                </div>
            </div>

            <div className="mt-6 rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Resource Name</h3>
                        <p className="text-lg font-semibold">{resource.resource_name}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                        <p className="text-lg">{resource.resource_types?.type_name}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Building</h3>
                        <p className="text-lg">{resource.buildings?.building_name}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Floor</h3>
                        <p className="text-lg">{resource.floor_number}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Capacity</h3>
                        <p className="text-lg">{resource.capacity}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${resource.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {resource.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                <div className="mt-8 space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <div className="rounded-md bg-muted/50 p-4 text-sm">
                        {resource.description || 'No description provided.'}
                    </div>
                </div>
            </div>
        </div>
    );
}
