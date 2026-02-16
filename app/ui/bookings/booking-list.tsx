'use client';

import { Calendar, Clock, MapPin } from 'lucide-react';

const bookings = [
    {
        id: 1,
        title: 'Project Kickoff',
        resource: 'Conference Room A',
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        date: '2024-02-15',
        status: 'approved',
        user: 'Alice Johnson'
    },
    {
        id: 2,
        title: 'Development Sprint Planning',
        resource: 'Conference Room B',
        startTime: '2:00 PM',
        endTime: '4:00 PM',
        date: '2024-02-15',
        status: 'pending',
        user: 'Bob Smith'
    },
    {
        id: 3,
        title: 'Client Demo',
        resource: 'Projector #3',
        startTime: '11:30 AM',
        endTime: '12:30 PM',
        date: '2024-02-16',
        status: 'approved',
        user: 'Charlie Brown'
    },
    {
        id: 4,
        title: 'Team Sync',
        resource: 'Conference Room A',
        startTime: '09:00 AM',
        endTime: '09:30 AM',
        date: '2024-02-17',
        status: 'cancelled',
        user: 'Diana Prince'
    },
];

export default function BookingList() {
    return (
        <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">Upcoming Bookings</h3>
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border pb-6 last:border-0 last:pb-0 gap-4">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">{booking.title}</h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {booking.resource}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {booking.date} | {booking.startTime} - {booking.endTime}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Booked by: {booking.user}</p>
                                </div>
                            </div>
                            <div className="shrink-0 flex items-center">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                                    ${booking.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
