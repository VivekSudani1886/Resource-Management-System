import { fetchAllBookings } from '@/app/lib/booking-actions';
import { CalendarIcon, UserIcon, MapPinIcon } from 'lucide-react';
import BookingDetailsModal from '@/app/ui/bookings/booking-details-modal';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
} as const;

export default async function Page() {
    const bookings = await fetchAllBookings();

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold text-foreground mb-6">All Bookings</h1>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Resource</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Time Slot</th>
                                <th className="px-6 py-4">Booked Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {bookings.map((booking) => (
                                <tr key={booking.booking_id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border border-transparent shadow-sm ${booking.status === 'approved' ? 'bg-green-600 text-white dark:bg-green-900 dark:text-green-100' :
                                            booking.status === 'rejected' ? 'bg-red-600 text-white dark:bg-red-900 dark:text-red-100' :
                                                'bg-yellow-600 text-white dark:bg-yellow-900 dark:text-yellow-100'
                                            }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{booking.resources.resource_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                                            <span>{booking.users_bookings_user_idTousers.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {new Date(booking.start_datetime).toLocaleDateString()}
                                                <span className="text-muted-foreground ml-1">
                                                    {new Date(booking.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                    {new Date(booking.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <BookingDetailsModal booking={booking as any} iconOnly />
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No bookings found in the system.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
