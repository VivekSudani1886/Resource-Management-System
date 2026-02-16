import EditResourceForm from '@/app/ui/resources/edit-form';
import { fetchResourceById, fetchBuildings, fetchResourceTypes } from '@/app/lib/resource-actions';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const resourceId = Number(id);
    const [resource, buildings, types] = await Promise.all([
        fetchResourceById(resourceId),
        fetchBuildings(),
        fetchResourceTypes()
    ]);

    if (!resource) {
        notFound();
    }

    return (
        <main>
            <h1 className="mb-4 text-xl md:text-2xl text-foreground">Edit Resource</h1>
            <EditResourceForm resource={resource} buildings={buildings} types={types} />
        </main>
    );
}
