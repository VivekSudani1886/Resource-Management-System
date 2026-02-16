import { fetchApproverDashboardData } from '@/app/lib/dashboard-actions';
import { auth } from '@/auth';
import { Card } from '@/app/ui/card';
import { CheckCircleIcon, ClockIcon, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';

export default async function Page() {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return <div>Please log in to view the dashboard.</div>;
    }

    const { pendingApprovals, approvedByMe, recentPendingBookings } = await fetchApproverDashboardData(userEmail);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Approver Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session?.user?.name || 'Approver'}!</p>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Pending Approvals</h3>
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">{pendingApprovals}</div>
                        <p className="text-xs text-muted-foreground">Waiting for review</p>
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Approved by Me</h3>
                        <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">{approvedByMe}</div>
                        <p className="text-xs text-muted-foreground">Total processed requests</p>
                    </div>
                </div>
            </div>

            {/* Recent Pending Bookings */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="font-semibold leading-none tracking-tight">Recent Pending Requests</h3>
                    <p className="text-sm text-muted-foreground">Action required for these bookings.</p>
                </div>
                <div className="p-6 pt-0">
                    <div className="space-y-4">
                        {recentPendingBookings.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No pending requests at the moment.</p>
                        ) : (
                            recentPendingBookings.map((booking: any) => (
                                <div key={booking.booking_id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{booking.resources?.resource_name || 'Resource'}</p>
                                        <div className="text-xs text-muted-foreground">
                                            <p>Requested by: {booking.users_bookings_user_idTousers?.name}</p>
                                            <p>{format(new Date(booking.start_datetime), 'PP p')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                            Pending
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
