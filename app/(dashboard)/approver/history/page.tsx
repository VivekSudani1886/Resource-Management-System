
import { fetchApproverHistory } from '@/app/lib/booking-actions';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import BookingDetailsModal from '@/app/ui/bookings/booking-details-modal';

export default async function Page() {
    const bookings = await fetchApproverHistory();

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold text-foreground mb-6">Approval History</h1>

            <div className="mt-6 flow-root">
                <div className="grid gap-4">
                    {bookings.length === 0 ? (
                        <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                            No approval history found.
                        </div>
                    ) : (
                        bookings.map((booking: any) => (
                            <div key={booking.booking_id} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">{booking.resources.resource_name}</h3>
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${booking.status === 'approved' ? 'border-transparent bg-green-100 text-green-800' :
                                            booking.status === 'rejected' ? 'border-transparent bg-red-100 text-red-800' :
                                                'border-transparent bg-secondary text-secondary-foreground'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <p>User: <span className="font-medium text-foreground">{booking.users_bookings_user_idTousers.name}</span> ({booking.users_bookings_user_idTousers.email})</p>
                                        <p>Time: {format(new Date(booking.start_datetime), 'PP p')} - {format(new Date(booking.end_datetime), 'p')}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                                    <span>Requested: {format(new Date(booking.created_at), 'PP')}</span>
                                    <span className="flex items-center gap-1">
                                        {booking.status === 'approved' && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                                        {booking.status === 'rejected' && <XCircle className="h-3 w-3 text-red-600" />}
                                        {booking.status === 'pending' && <Clock className="h-3 w-3 text-yellow-600" />}
                                        Action taken by you
                                    </span>
                                </div>
                                <div className="ml-auto">
                                    <BookingDetailsModal booking={booking as any} iconOnly />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
