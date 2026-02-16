import { fetchResources } from '@/app/lib/resource-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';

export default async function Page() {
    const resources = await fetchResources();

    return (
        <div className="w-full space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">Resource Inventory</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                    <Card key={resource.resource_id} className={!resource.is_active ? 'border-orange-200 bg-orange-50/20' : ''}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{resource.resource_name}</CardTitle>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${resource.is_active
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                    }`}>
                                    {resource.is_active ? 'Active' : 'Maintenance'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>
                                <span className="font-medium text-foreground">Location:</span> {resource.buildings.building_name}, Floor {resource.floor_number}
                            </p>
                            <p>
                                <span className="font-medium text-foreground">Type:</span> {resource.resource_types.type_name}
                            </p>
                            <p>
                                <span className="font-medium text-foreground">Capacity:</span> {resource.capacity || 'N/A'}
                            </p>
                            {resource.description && (
                                <p className="italic border-t pt-2 mt-2">
                                    "{resource.description}"
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
