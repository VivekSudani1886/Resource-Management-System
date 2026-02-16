'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { Eye, X, Calendar, User, Clock, MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface BookingDetailsModalProps {
    booking: {
        booking_id: number;
        status: string | null;
        start_datetime: string | Date;
        end_datetime: string | Date;
        created_at: string | Date | null;
        approved_at?: string | Date | null;
        resources: {
            resource_name: string;
            buildings: {
                building_name: string;
            };
        };
        users_bookings_user_idTousers: {
            name: string;
            email: string;
        };
        users_bookings_approver_idTousers?: {
            name: string;
            email: string;
        } | null;
    };
    iconOnly?: boolean;
}

export default function BookingDetailsModal({ booking, iconOnly = false }: BookingDetailsModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const statusColor =
        booking.status === 'approved' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' :
            booking.status === 'rejected' ? 'text-red-600 bg-red-100 dark:bg-red-900/30' :
                'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';

    const StatusIcon =
        booking.status === 'approved' ? CheckCircle2 :
            booking.status === 'rejected' ? XCircle :
                AlertCircle;

    return (
        <>
            {iconOnly ? (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                    title="View Details"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                    className="gap-2"
                >
                    <Eye className="h-4 w-4" />
                    View Details
                </Button>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

                    <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl p-6 border border-border/50 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors"
                        >
                            <X className="h-5 w-5 text-muted-foreground" />
                        </button>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <h2 className="text-xl font-bold">Booking Details</h2>
                                    <p className="text-sm text-muted-foreground">ID: #{booking.booking_id}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 uppercase ${statusColor}`}>
                                    <StatusIcon className="h-3.5 w-3.5" />
                                    {booking.status || 'Pending'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">{booking.resources.resource_name}</p>
                                        <p className="text-sm text-muted-foreground">{booking.resources.buildings.building_name}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">
                                            {format(new Date(booking.start_datetime), 'PPP')}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(booking.start_datetime), 'p')} - {format(new Date(booking.end_datetime), 'p')}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t my-4 py-4 space-y-4">
                                    <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                        <User className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Requested By</p>
                                            <p className="font-medium">{booking.users_bookings_user_idTousers.name}</p>
                                            <p className="text-sm text-muted-foreground">{booking.users_bookings_user_idTousers.email}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                On {booking.created_at ? format(new Date(booking.created_at), 'PPP p') : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {(booking.status === 'approved' || booking.status === 'rejected') && booking.users_bookings_approver_idTousers && (
                                        <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                            {booking.status === 'approved' ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                    {booking.status === 'approved' ? 'Approved By' : 'Rejected By'}
                                                </p>
                                                <p className="font-medium">{booking.users_bookings_approver_idTousers.name}</p>
                                                <p className="text-sm text-muted-foreground">{booking.users_bookings_approver_idTousers.email}</p>
                                                {booking.approved_at && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        On {format(new Date(booking.approved_at), 'PPP p')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
