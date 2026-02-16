import { fetchApprovals, approveBooking, rejectBooking } from '@/app/lib/approval-actions';
import { CheckCircleIcon, XCircleIcon, ClockIcon, EyeIcon } from 'lucide-react';
import { Button } from '@/app/ui/button';
import BookingDetailsModal from '@/app/ui/bookings/booking-details-modal';

export default async function Page() {
    // Fetch ALL bookings, not just pending, so we can change status later if needed
    // However, the function 'fetchApprovals' in previous steps was taking a status arg.
    // Let's call it without status to get all?
    // Checking approval-actions.ts: fetchApprovals(status?: string). If status undefined -> empty where clause -> gets all.
    const approvals = await fetchApprovals();

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold text-foreground mb-6">Manage Approvals</h1>
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                {approvals.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No bookings found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4">Resource</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Approver</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {approvals.map((booking) => (
                                    <tr key={booking.booking_id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 font-medium">{booking.resources.resource_name}</td>
                                        <td className="px-6 py-4">{booking.users_bookings_user_idTousers.name}</td>
                                        <td className="px-6 py-4">
                                            {new Date(booking.start_datetime).toLocaleDateString()} <br />
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(booking.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                {new Date(booking.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border border-transparent shadow-sm ${booking.status === 'approved' ? 'bg-green-600 text-white dark:bg-green-900 dark:text-green-100' :
                                                booking.status === 'rejected' ? 'bg-red-600 text-white dark:bg-red-900 dark:text-red-100' :
                                                    'bg-yellow-600 text-white dark:bg-yellow-900 dark:text-yellow-100'
                                                }`}>
                                                {(booking.status || 'pending').charAt(0).toUpperCase() + (booking.status || 'pending').slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium">
                                                {booking.users_bookings_approver_idTousers?.name || <span className="text-muted-foreground/50 italic">N/A</span>}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                {/* Buttons depending on status */}
                                                {booking.status !== 'approved' && (
                                                    <form action={async () => {
                                                        'use server';
                                                        await approveBooking(booking.booking_id);
                                                    }}>
                                                        <button
                                                            className="group inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-green-100 text-muted-foreground hover:text-green-600 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircleIcon className="h-5 w-5" />
                                                        </button>
                                                    </form>
                                                )}

                                                {booking.status !== 'rejected' && (
                                                    <form action={async () => {
                                                        'use server';
                                                        await rejectBooking(booking.booking_id);
                                                    }}>
                                                        <button
                                                            className="group inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircleIcon className="h-5 w-5" />
                                                        </button>
                                                    </form>
                                                )}
                                                <BookingDetailsModal booking={booking as any} iconOnly />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
