import { fetchMaintenanceRequests } from '@/app/lib/maintenance-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';
import { CheckCircle2Icon, CalendarIcon, XCircleIcon } from 'lucide-react';
import MaintenanceDetailsModal from '@/app/ui/maintenance/maintenance-details-modal';

export default async function Page() {
    const allRequests = await fetchMaintenanceRequests();
    const completedRequests = allRequests.filter(req => req.status === 'completed' || req.status === 'cancelled');

    // Sort recent first
    completedRequests.sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());

    return (
        <div className="w-full space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Maintenance History</h1>

            <div className="grid gap-4">
                {completedRequests.length === 0 ? (
                    <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        <p>No historical maintenance records found.</p>
                    </div>
                ) : (
                    completedRequests.map((req) => (
                        <Card key={req.maintenance_id} className="opacity-80 hover:opacity-100 transition-opacity">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className={`p-2 rounded-full ${req.status === 'completed'
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
                                    }`}>
                                    {req.status === 'completed' ? <CheckCircle2Icon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-base">{req.maintenance_type}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {req.resources.resource_name} • {req.resources.buildings.building_name}
                                    </p>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border border-transparent shadow-sm ${req.status === 'completed' ? 'bg-green-600 text-white dark:bg-green-900 dark:text-green-100' :
                                        'bg-red-600 text-white dark:bg-red-900 dark:text-red-100'
                                    }`}>
                                    {(req.status || 'completed').charAt(0).toUpperCase() + (req.status || 'completed').slice(1)}
                                </span>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="h-4 w-4" />
                                            Scheduled: {new Date(req.scheduled_date).toLocaleDateString()}
                                        </div>
                                        {req.notes && (
                                            <div className="border-l pl-4 italic">
                                                "{req.notes}"
                                            </div>
                                        )}
                                    </div>
                                    <MaintenanceDetailsModal maintenance={req as any} iconOnly />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
