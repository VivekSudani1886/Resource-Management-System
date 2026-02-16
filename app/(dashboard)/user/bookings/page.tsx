import { fetchUserBookings } from '@/app/lib/booking-actions';
import { auth } from '@/auth';
import { Prisma as prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { PlusIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { format } from 'date-fns';
import BookingDetailsModal from '@/app/ui/bookings/booking-details-modal';

export default async function Page() {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return <div>Please log in.</div>;
    }

    // Get user ID
    const user = await prisma.users.findUnique({ where: { email: userEmail } });
    if (!user) return <div>User not found.</div>;

    const bookings = await fetchUserBookings(user.user_id);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
                <Link href="/user/bookings/create">
                    <Button className="flex items-center gap-2">
                        <PlusIcon className="h-4 w-4" />
                        New Booking
                    </Button>
                </Link>
            </div>

            <div className="mt-8 flow-root">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.length === 0 ? (
                        <div className="col-span-full text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                            No bookings found. Start by creating one!
                        </div>
                    ) : (
                        bookings.map((booking) => (
                            <div key={booking.booking_id} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-lg ${(booking.status || 'pending') === 'approved' ? 'bg-green-100 text-green-700' :
                                    (booking.status || 'pending') === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {(booking.status || 'pending').toUpperCase()}
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{booking.resources.resource_name}</h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>{format(booking.start_datetime, 'PPP')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="h-4 w-4" />
                                        <span>
                                            {format(booking.start_datetime, 'p')} - {format(booking.end_datetime, 'p')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <span className="bg-muted px-2 py-1 rounded text-xs">{booking.resources.buildings.building_name}</span>
                                        <span className="bg-muted px-2 py-1 rounded text-xs">{booking.resources.resource_types.type_name}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <BookingDetailsModal booking={booking as any} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
