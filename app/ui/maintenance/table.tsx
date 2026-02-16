import { format } from 'date-fns';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';

const mockTasks = [
    {
        maintenance_id: 1,
        maintenance_type: 'HVAC Repair',
        scheduled_date: new Date('2023-10-25'),
        status: 'scheduled',
        resources: {
            resource_name: 'Conference Room A',
            buildings: { building_name: 'Main Building' }
        }
    },
    {
        maintenance_id: 2,
        maintenance_type: 'Projector Fix',
        scheduled_date: new Date('2023-10-26'),
        status: 'completed',
        resources: {
            resource_name: 'Lab 101',
            buildings: { building_name: 'Science Wing' }
        }
    },
    {
        maintenance_id: 3,
        maintenance_type: 'Plumbing',
        scheduled_date: new Date('2023-10-28'),
        status: 'pending',
        resources: {
            resource_name: 'Restroom 2F',
            buildings: { building_name: 'Main Building' }
        }
    }
];

export default async function MaintenanceTable() {
    const tasks = mockTasks;

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-zinc-50 p-2 md:pt-0 dark:bg-zinc-900">
                    <table className="hidden min-w-full text-zinc-900 md:table dark:text-zinc-100">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Resource
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Type
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Scheduled Date
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-zinc-950">
                            {tasks.map((task) => (
                                <tr
                                    key={task.maintenance_id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none border-zinc-200 dark:border-zinc-800"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p>{task.resources.resource_name}</p>
                                            <p className="text-xs text-zinc-500">{task.resources.buildings.building_name}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {task.maintenance_type}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {format(task.scheduled_date, 'PP')}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${task.status === 'completed' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                            task.status === 'cancelled' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <div className="flex gap-2">
                                            <div className="flex gap-2">
                                                <button className="text-green-600 hover:text-green-800" title="Complete"><CheckCircleIcon className="w-5" /></button>
                                                <button className="text-red-600 hover:text-red-800" title="Cancel"><XCircleIcon className="w-5" /></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Mobile View */}
                    <div className="md:hidden">
                        {tasks.map((task) => (
                            <div key={task.maintenance_id} className="mb-2 w-full rounded-md bg-white p-4 dark:bg-zinc-950">
                                <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                                    <p className="font-semibold">{task.resources.resource_name}</p>
                                    <p className="text-xs">{task.maintenance_type}</p>
                                </div>
                                <div className="pt-4 text-sm flex justify-between items-center">
                                    <p>{format(task.scheduled_date, 'PP')}</p>
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${task.status === 'completed' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                        task.status === 'cancelled' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                            'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                        }`}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
