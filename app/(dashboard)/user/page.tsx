import { fetchUserDashboardData } from '@/app/lib/dashboard-actions';
import { auth } from '@/auth';
import { Card } from '@/app/ui/card';
import { CalendarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function Page() {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return <div>Please log in to view your dashboard.</div>;
    }

    const { myBookingsCount, myPendingcount, approvedBookings, recentBookings } = await fetchUserDashboardData(userEmail);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session?.user?.name || 'User'}!</p>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">My Bookings</h3>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">{myBookingsCount}</div>
                        <p className="text-xs text-muted-foreground">Total requests made</p>
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Pending</h3>
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">{myPendingcount}</div>
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Approved</h3>
                        <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">{approvedBookings}</div>
                        <p className="text-xs text-muted-foreground">Ready to use</p>
                    </div>
                </div>
            </div>

            {/* My Recent Bookings */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="font-semibold leading-none tracking-tight">My Recent Requests</h3>
                    <p className="text-sm text-muted-foreground">Status of your recent bookings.</p>
                </div>
                <div className="p-6 pt-0">
                    <div className="space-y-4">
                        {recentBookings.length === 0 ? (
                            <p className="text-sm text-muted-foreground">You haven't made any bookings yet.</p>
                        ) : (
                            recentBookings.map((booking: any) => (
                                <div key={booking.booking_id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{booking.resources?.resource_name || 'Resource'}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(booking.start_datetime).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
