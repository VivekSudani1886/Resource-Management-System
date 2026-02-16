import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const [
            totalResources,
            totalBookings,
            pendingBookings,
            upcomingMaintenance
        ] = await Promise.all([
            prisma.resources.count(),
            prisma.bookings.count(),
            prisma.bookings.count({ where: { status: 'pending' } }),
            prisma.maintenance.count({ where: { status: 'scheduled' } })
        ]);

        // Simple monthly bookings chart data (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Group by month - Prisma doesn't support complex group by date out of the box easily without raw query or post-processing.
        // For simplicity, we'll just return the aggregates. 
        // Or we could do a raw query: 
        // await prisma.$queryRaw`SELECT EXTRACT(MONTH FROM start_datetime) as month, COUNT(*) as count FROM bookings ...`

        // Let's settle for summary stats for now as requested in "2 Dashboard".
        // "Simple charts (optional)"

        return NextResponse.json({
            totalResources,
            totalBookings,
            pendingBookings,
            upcomingMaintenance
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}
