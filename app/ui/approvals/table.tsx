import { format } from 'date-fns';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { Button } from '@/app/ui/button';

const mockPendingBookings = [
    {
        booking_id: 101,
        start_datetime: new Date('2023-11-05T10:00:00'),
        end_datetime: new Date('2023-11-05T12:00:00'),
        status: 'pending',
        resources: { resource_name: 'Conference Room B', buildings: { building_name: 'Main Hall' } },
        users_bookings_user_idTousers: { name: 'John Doe', email: 'john@example.com' }
    },
    {
        booking_id: 102,
        start_datetime: new Date('2023-11-06T13:00:00'),
        end_datetime: new Date('2023-11-06T14:30:00'),
        status: 'pending',
        resources: { resource_name: 'Lab 2', buildings: { building_name: 'Science Wing' } },
        users_bookings_user_idTousers: { name: 'Jane Smith', email: 'jane@example.com' }
    }
];

export default async function ApprovalsTable() {
    const bookings = mockPendingBookings;

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
                                    User
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Date
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-zinc-950">
                            {bookings.map((booking) => (
                                <tr
                                    key={booking.booking_id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none border-zinc-200 dark:border-zinc-800"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p>{booking.resources.resource_name}</p>
                                            <p className="text-xs text-zinc-500">{booking.resources.buildings.building_name}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {booking.users_bookings_user_idTousers.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {format(booking.start_datetime, 'PP p')} - {format(booking.end_datetime, 'p')}
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <Button type="button" size="icon" variant="outline" className="border-green-200 hover:bg-green-100 hover:text-green-600 dark:border-green-800 dark:hover:bg-green-900/30 dark:hover:text-green-400 text-green-600">
                                                <CheckCircleIcon className="w-5 h-5" />
                                            </Button>
                                            <Button type="button" size="icon" variant="outline" className="border-red-200 hover:bg-red-100 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-900/30 dark:hover:text-red-400 text-red-600">
                                                <XCircleIcon className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Mobile View */}
                    <div className="md:hidden">
                        {bookings.map((booking) => (
                            <div key={booking.booking_id} className="mb-2 w-full rounded-md bg-white p-4 dark:bg-zinc-950">
                                <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                                    <p className="font-semibold">{booking.resources.resource_name}</p>
                                </div>
                                <div className="pt-4 text-sm">
                                    <p>{booking.users_bookings_user_idTousers.name}</p>
                                    <p>{format(booking.start_datetime, 'PP p')}</p>
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <Button type="button" size="icon" variant="outline" className="border-green-200 hover:bg-green-100 hover:text-green-600 dark:border-green-800 dark:hover:bg-green-900/30 dark:hover:text-green-400 text-green-600">
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </Button>
                                    <Button type="button" size="icon" variant="outline" className="border-red-200 hover:bg-red-100 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-900/30 dark:hover:text-red-400 text-red-600">
                                        <XCircleIcon className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
