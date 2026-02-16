import { fetchMaintenanceRequests, updateMaintenanceStatus } from '@/app/lib/maintenance-actions';
import { fetchResources } from '@/app/lib/resource-actions';
import { Button } from '@/app/ui/button';
import { CreateTaskForm } from './create-task-form';
import MaintenanceDetailsModal from '@/app/ui/maintenance/maintenance-details-modal';

export default async function Page() {
    const tasks = await fetchMaintenanceRequests();
    const resources = await fetchResources();

    return (
        <div className="w-full space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">Maintenance Management</h1>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Schedule New Maintenance</h2>
                <CreateTaskForm resources={resources} />
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <h2 className="text-lg font-semibold p-6 pb-2">Scheduled Tasks</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4">Resource</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Scheduled Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action Taker</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                                <th className="px-6 py-4 text-center">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {tasks.map((task) => (
                                <tr key={task.maintenance_id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 font-medium">{task.resources.resource_name}</td>
                                    <td className="px-6 py-4">{task.maintenance_type}</td>
                                    <td className="px-6 py-4">{new Date(task.scheduled_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border border-transparent shadow-sm ${task.status === 'completed' ? 'bg-green-600 text-white dark:bg-green-900 dark:text-green-100' :
                                            task.status === 'cancelled' ? 'bg-red-600 text-white dark:bg-red-900 dark:text-red-100' :
                                                'bg-yellow-600 text-white dark:bg-yellow-900 dark:text-yellow-100'
                                            }`}>
                                            {(task.status || 'scheduled').charAt(0).toUpperCase() + (task.status || 'scheduled').slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium">
                                            {task.users_maintenance_completed_byTousers?.name || <span className="text-muted-foreground/50 italic">N/A</span>}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {task.status !== 'completed' && (
                                                <form action={async () => {
                                                    'use server';
                                                    await updateMaintenanceStatus(task.maintenance_id, 'completed');
                                                }}>
                                                    <Button variant="outline" size="sm" className="h-8 text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100">Complete</Button>
                                                </form>
                                            )}
                                            {task.status !== 'cancelled' && task.status !== 'completed' && (
                                                <form action={async () => {
                                                    'use server';
                                                    await updateMaintenanceStatus(task.maintenance_id, 'cancelled');
                                                }}>
                                                    <Button variant="outline" size="sm" className="h-8 text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100">Cancel</Button>
                                                </form>
                                            )}
                                            {task.status === 'completed' && (
                                                <form action={async () => {
                                                    'use server';
                                                    await updateMaintenanceStatus(task.maintenance_id, 'scheduled');
                                                }}>
                                                    <Button variant="outline" size="sm" className="h-8 text-xs">Reopen</Button>
                                                </form>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <MaintenanceDetailsModal maintenance={task as any} iconOnly />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
