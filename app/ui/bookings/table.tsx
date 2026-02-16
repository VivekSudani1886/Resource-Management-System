import { format } from 'date-fns';
import { auth } from '@/auth';

const mockBookings = [
    {
        booking_id: 1,
        start_datetime: new Date('2023-11-01T10:00:00'),
        end_datetime: new Date('2023-11-01T11:00:00'),
        status: 'approved',
        resources: { resource_name: 'Conference Room A', buildings: { building_name: 'Main Hall' } },
        users_bookings_user_idTousers: { name: 'Alice Admin', email: 'alice@example.com' }
    },
    {
        booking_id: 2,
        start_datetime: new Date('2023-11-02T14:00:00'),
        end_datetime: new Date('2023-11-02T15:30:00'),
        status: 'pending',
        resources: { resource_name: 'Projector 1', buildings: { building_name: 'Main Hall' } },
        users_bookings_user_idTousers: { name: 'Bob Approver', email: 'bob@example.com' }
    },
    {
        booking_id: 3,
        start_datetime: new Date('2023-11-03T09:00:00'),
        end_datetime: new Date('2023-11-03T17:00:00'),
        status: 'rejected',
        resources: { resource_name: 'Lab 3', buildings: { building_name: 'Science Wing' } },
        users_bookings_user_idTousers: { name: 'Student 1', email: 'student1@example.com' }
    }
];

export default async function BookingsTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const session = await auth();

    // Simple mock filter
    let bookings = mockBookings.filter(b =>
        b.resources.resource_name.toLowerCase().includes(query.toLowerCase())
    );

    // Filter by user role if needed for mock visual
    if (session?.user?.role === 'user') {
        // bookings = bookings.filter(b => b.users_bookings_user_idTousers.email === session.user.email);
    }

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
                                    Start Time
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    End Time
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Status
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
                                        {format(booking.start_datetime, 'PP p')}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {format(booking.end_datetime, 'PP p')}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${booking.status === 'approved' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                booking.status === 'rejected' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                    'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
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
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${booking.status === 'approved' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                            booking.status === 'rejected' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                            }`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="pt-4 text-sm">
                                    <p>Start: {format(booking.start_datetime, 'PP p')}</p>
                                    <p>End: {format(booking.end_datetime, 'PP p')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
