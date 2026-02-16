import Form from '@/app/ui/resources/create-form';
import { fetchBuildings, fetchResourceTypes } from '@/app/lib/resource-actions';

export default async function Page() {
    const [buildings, types] = await Promise.all([
        fetchBuildings(),
        fetchResourceTypes()
    ]);

    return (
        <main>
            <h1 className="mb-4 text-xl md:text-2xl text-foreground">Create Resource</h1>
            <Form buildings={buildings} types={types} />
        </main>
    );
}
