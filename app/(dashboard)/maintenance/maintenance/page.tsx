import { fetchMaintenanceRequests, updateMaintenanceStatus } from '@/app/lib/maintenance-actions';
import { Button } from '@/app/ui/button';
import { PenToolIcon, AlertTriangleIcon, CheckCircle2Icon, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import MaintenanceDetailsModal from '@/app/ui/maintenance/maintenance-details-modal';

async function MarkResolved({ id }: { id: number }) {
    async function action() {
        'use server';
        await updateMaintenanceStatus(id, 'completed');
    }

    return (
        <form action={action}>
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900">
                Mark Resolved
            </Button>
        </form>
    );
}

export default async function Page() {
    const maintenanceRequests = await fetchMaintenanceRequests();

    // Sort so pending ones are first
    maintenanceRequests.sort((a, b) => {
        if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
        if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;
        return new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime();
    });

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Maintenance Requests</h1>
                <Link href="/maintenance/maintenance/create">
                    <Button variant="default" className="gap-2">
                        <PenToolIcon className="h-4 w-4" />
                        Log Maintenance
                    </Button>
                </Link>
            </div>

            <div className="mt-8 grid gap-4">
                {maintenanceRequests.length === 0 ? (
                    <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        <CheckCircle2Icon className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
                        <p>All systems operational. No maintenance requests found.</p>
                    </div>
                ) : (
                    maintenanceRequests.map((req) => (
                        <div key={req.maintenance_id} className={`rounded-xl border p-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${req.status === 'completed'
                            ? 'bg-card border-border opacity-75'
                            : 'border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900'
                            }`}>
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full ${req.status === 'completed'
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400'
                                    }`}>
                                    {req.status === 'completed' ? <CheckCircle2Icon className="h-6 w-6" /> : <AlertTriangleIcon className="h-6 w-6" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg">{req.maintenance_type}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border border-transparent shadow-sm ${req.status === 'completed' ? 'bg-green-600 text-white dark:bg-green-900 dark:text-green-100' :
                                                req.status === 'cancelled' ? 'bg-red-600 text-white dark:bg-red-900 dark:text-red-100' :
                                                    'bg-yellow-600 text-white dark:bg-yellow-900 dark:text-yellow-100'
                                            }`}>
                                            {(req.status || 'scheduled').charAt(0).toUpperCase() + (req.status || 'scheduled').slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {req.resources.resource_name} • {req.resources.buildings.building_name}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="h-3.5 w-3.5" />
                                            {new Date(req.scheduled_date).toLocaleDateString()}
                                        </div>
                                        {req.notes && (
                                            <span className="italic">"{req.notes}"</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {req.status === 'scheduled' && (
                                <div className="flex gap-2">
                                    <MaintenanceDetailsModal maintenance={req as any} iconOnly />
                                    <MarkResolved id={req.maintenance_id} />
                                </div>
                            )}
                            {req.status !== 'scheduled' && (
                                <MaintenanceDetailsModal maintenance={req as any} iconOnly />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
