import Form from '@/app/ui/resources/create-form';
import CreateTypeForm from '@/app/ui/resources/create-type-form';
import CreateBuildingForm from '@/app/ui/resources/create-building-form';
import { fetchBuildings, fetchResourceTypes } from '@/app/lib/resource-actions';

export default async function Page() {
    const [buildings, types] = await Promise.all([
        fetchBuildings(),
        fetchResourceTypes()
    ]);

    return (
        <main>
            <h1 className="mb-4 text-xl md:text-2xl text-foreground">Create Resource</h1>
            
            <CreateBuildingForm />
            <CreateTypeForm />

            <Form buildings={buildings} types={types} />
        </main>
    );
}
