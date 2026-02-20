import { fetchResources } from '@/app/lib/resource-actions';
import CreateMaintenanceForm from '@/app/ui/maintenance/create-form';

export default async function Page() {
    const resources = await fetchResources();

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Log Maintenance Request</h1>
            <CreateMaintenanceForm resources={resources} />
        </div>
    );
}

