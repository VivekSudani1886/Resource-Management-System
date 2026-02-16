import { fetchMaintenanceStats, fetchMaintenanceRequests } from '@/app/lib/maintenance-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';
import {
    Wrench,
    CheckCircle2,
    Clock,
    AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default async function Page() {
    const stats = await fetchMaintenanceStats();
    const allRequests = await fetchMaintenanceRequests();

    // Sort by most recent for the dashboard view (reverse of the default ASC)
    const recentRequests = [...allRequests].reverse().slice(0, 5);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Maintenance Dashboard</h1>
                <Link href="/maintenance/maintenance">
                    <Button>
                        View All Requests
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Lifetime maintenance logs</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.scheduled}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                        <p className="text-xs text-muted-foreground">Successfully resolved</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6 flex flex-col gap-4">
                    <h3 className="font-semibold text-lg">Recent Activity</h3>
                    {recentRequests.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No recent scheduled maintenance.</p>
                    ) : (
                        <div className="space-y-4">
                            {recentRequests.map((req) => (
                                <div key={req.maintenance_id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${req.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {req.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="font-medium">{req.maintenance_type}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {req.resources.resource_name} • {req.resources.buildings.building_name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium capitalize">{req.status}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(req.scheduled_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
