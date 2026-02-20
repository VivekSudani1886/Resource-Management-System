import { auth } from '@/auth';
import { Prisma as prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    const session = await auth();

    if (session?.user?.role !== 'approver' && session?.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { booking_id, status } = await req.json();

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updatedBooking = await prisma.bookings.update({
            where: { booking_id: parseInt(booking_id) },
            data: {
                status,
                approver_id: parseInt(session.user.id),
            }
        });

        return NextResponse.json(updatedBooking);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}
