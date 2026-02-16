import { fetchPendingApprovals, approveBooking, rejectBooking } from '@/app/lib/booking-actions';
import { Button } from '@/app/ui/button';
import { CheckCircleIcon, XCircleIcon, CalendarIcon, UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import BookingDetailsModal from '@/app/ui/bookings/booking-details-modal';

export default async function Page() {
    const bookings = await fetchPendingApprovals();

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold text-foreground mb-6">Pending Approvals</h1>

            <div className="mt-6 flow-root">
                <div className="grid gap-4">
                    {bookings.length === 0 ? (
                        <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                            No pending approvals.
                        </div>
                    ) : (
                        bookings.map((booking) => (
                            <div key={booking.booking_id} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">{booking.resources.resource_name}</h3>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <UserIcon className="h-4 w-4" />
                                            <span>{booking.users_bookings_user_idTousers.name} ({booking.users_bookings_user_idTousers.email})</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>{format(booking.start_datetime, 'PP p')} - {format(booking.end_datetime, 'p')}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground pt-1">
                                        Requested on {format(booking.created_at || new Date(), 'PPP')}
                                    </p>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto">
                                    <BookingDetailsModal booking={booking as any} iconOnly />
                                    <form action={approveBooking.bind(null, booking.booking_id)} className="w-full md:w-auto">
                                        <Button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white gap-2">
                                            <CheckCircleIcon className="h-4 w-4" />
                                            Approve
                                        </Button>
                                    </form>
                                    <form action={rejectBooking.bind(null, booking.booking_id)} className="w-full md:w-auto">
                                        <Button type="submit" variant="destructive" className="w-full md:w-auto gap-2 bg-red-600 hover:bg-red-700">
                                            <XCircleIcon className="h-4 w-4" />
                                            Reject
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
