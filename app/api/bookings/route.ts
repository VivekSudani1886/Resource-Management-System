import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get('resource_id');
    const userId = searchParams.get('user_id'); // Admin/Self can filter by user

    // RLS logic: Regular users see only their own bookings or approved bookings for availability checking?
    // Requirement: "User: View history". "Prevent overlapping". 
    // Probably need to return all future bookings to frontend for overlap check or handle it in backend.
    // Let's allow fetching by resource_id to see availability.

    try {
        const where: any = {};
        if (resourceId) where.resource_id = parseInt(resourceId);
        if (userId) {
            // Only admin or the user themselves can view their specific bookings list
            if (session.user.role !== 'admin' && parseInt(session.user.id) !== parseInt(userId)) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
            where.user_id = parseInt(userId);
        } else if (session.user.role === 'user') {
            // If no filter, user sees only their own? Or we want to show all for availability?
            // Usually "My Bookings" vs "Resource Availability".
            // Let's assume this endpoint is general.
            // If specifically asking for "my bookings", client sends user_id.
            // If asking for resource schedule, client sends resource_id.
            // If no params, admin/approver might see all.
            if (session.user.role === 'user' && !resourceId) {
                where.user_id = parseInt(session.user.id);
            }
        }

        const bookings = await prisma.bookings.findMany({
            where,
            include: {
                resources: true,
                users_bookings_user_idTousers: { select: { name: true, email: true } }
            },
            orderBy: { start_datetime: 'desc' }
        });
        return NextResponse.json(bookings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { resource_id, start_datetime, end_datetime } = await req.json();
        const start = new Date(start_datetime);
        const end = new Date(end_datetime);

        if (start >= end) {
            return NextResponse.json({ error: 'Invalid time range' }, { status: 400 });
        }

        // Check for overlaps
        // Status: pending or approved. Rejected doesn't count.
        const overlap = await prisma.bookings.findFirst({
            where: {
                resource_id: parseInt(resource_id),
                status: { not: 'rejected' },
                OR: [
                    {
                        start_datetime: { lt: end },
                        end_datetime: { gt: start }
                    }
                ]
            }
        });

        if (overlap) {
            return NextResponse.json({ error: 'Resource is already booked for this time slot' }, { status: 409 });
        }

        const booking = await prisma.bookings.create({
            data: {
                resource_id: parseInt(resource_id),
                user_id: parseInt(session.user.id),
                start_datetime: start,
                end_datetime: end,
                status: 'pending',
            }
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
