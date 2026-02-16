import { fetchResources } from '@/app/lib/resource-actions';
import { createMaintenanceRequest } from '@/app/lib/maintenance-actions';
import { Button } from '@/app/ui/button';
import { Label } from '@/app/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';
import Link from 'next/link';

export default async function Page() {
    const resources = await fetchResources();

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Log Maintenance Request</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createMaintenanceRequest} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="resource_id">Resource</Label>
                            <select
                                name="resource_id"
                                id="resource_id"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="">Select a resource...</option>
                                {resources.map((resource) => (
                                    <option key={resource.resource_id} value={resource.resource_id}>
                                        {resource.resource_name} ({resource.buildings.building_name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="maintenance_type">Maintenance Type</Label>
                            <select
                                name="maintenance_type"
                                id="maintenance_type"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="">Select type...</option>
                                <option value="Repair">Repair</option>
                                <option value="Inspection">Inspection</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Replacement">Replacement</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="scheduled_date">Scheduled Date</Label>
                            <input
                                type="date"
                                name="scheduled_date"
                                id="scheduled_date"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                name="notes"
                                id="notes"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Describe the issue..."
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/maintenance/maintenance">
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                            <Button type="submit">Submit Request</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
