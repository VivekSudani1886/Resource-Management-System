'use server';

import { Prisma as prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function fetchApprovals(status?: string) {
    try {
        const bookings = await prisma.bookings.findMany({
            where: status ? { status: status as any } : {},
            include: {
                resources: {
                    include: { buildings: true }
                },
                users_bookings_user_idTousers: true,
                users_bookings_approver_idTousers: true,
            },
            orderBy: { created_at: 'desc' },
        });
        return bookings;
    } catch (error) {
        throw new Error('Failed to fetch approvals.');
    }
}

export async function approveBooking(id: number) {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
        throw new Error('Authentication required');
    }

    const user = await prisma.users.findUnique({ where: { email: userEmail } });
    if (!user) throw new Error('User not found');

    try {
        await prisma.bookings.update({
            where: { booking_id: id },
            data: {
                status: 'approved',
                approver_id: user.user_id,
                approved_at: new Date(),
            },
        });
        revalidatePath('/admin/approvals');
    } catch (error) {
        console.error('Failed to approve booking:', error);
        throw new Error(`Failed to approve booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function rejectBooking(id: number) {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
        throw new Error('Authentication required');
    }

    const user = await prisma.users.findUnique({ where: { email: userEmail } });
    if (!user) throw new Error('User not found');

    try {
        await prisma.bookings.update({
            where: { booking_id: id },
            data: {
                status: 'rejected',
                approver_id: user.user_id,
                approved_at: new Date(),
            },
        });
        revalidatePath('/admin/approvals');
    } catch (error) {
        throw new Error('Failed to reject booking.');
    }
}
