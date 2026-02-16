'use server';

import { Prisma as prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import { createNotification } from './notification-actions';

const BookingSchema = z.object({
    resource_id: z.coerce.number().min(1, 'Resource is required'),
    start_datetime: z.string().min(1, 'Start Time is required'),
    end_datetime: z.string().min(1, 'End Time is required'),
});

const CreateBooking = BookingSchema;

export async function fetchUserBookings(userId: number) {
    try {
        const bookings = await prisma.bookings.findMany({
            where: { user_id: userId },
            include: {
                resources: {
                    include: { buildings: true, resource_types: true }
                },
                users_bookings_user_idTousers: true,
                users_bookings_approver_idTousers: true,
            },
            orderBy: { created_at: 'desc' },
        });
        return bookings;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user bookings.');
    }
}

export async function fetchPendingApprovals() {
    try {
        const bookings = await prisma.bookings.findMany({
            where: { status: 'pending' },
            include: {
                resources: {
                    include: { buildings: true }
                },
                users_bookings_user_idTousers: true
            },
            orderBy: { created_at: 'asc' }
        });
        return bookings;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch pending approvals.');
    }
}

export async function createBooking(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { message: 'Authentication required' };
    }

    // Fetch user id from email
    const user = await prisma.users.findUnique({ where: { email: session.user.email } });
    if (!user) return { message: 'User not found' };

    const validatedFields = CreateBooking.safeParse({
        resource_id: formData.get('resource_id'),
        start_datetime: formData.get('start_datetime'),
        end_datetime: formData.get('end_datetime'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Booking.',
        };
    }

    const { resource_id, start_datetime, end_datetime } = validatedFields.data;

    // Basic validation: End > Start
    if (new Date(end_datetime) <= new Date(start_datetime)) {
        return { message: 'End time must be after start time.' };
    }

    try {
        // Check for conflicts
        const conflicts = await prisma.bookings.findMany({
            where: {
                resource_id: resource_id,
                status: { in: ['approved', 'pending'] },
                AND: [
                    {
                        start_datetime: {
                            lt: new Date(end_datetime)
                        }
                    },
                    {
                        end_datetime: {
                            gt: new Date(start_datetime)
                        }
                    }
                ]
            }
        });

        if (conflicts.length > 0) {
            return { message: 'Resource is not available for the selected time slot.' };
        }

        const booking = await prisma.bookings.create({
            data: {
                user_id: user.user_id,
                resource_id: resource_id,
                start_datetime: new Date(start_datetime),
                end_datetime: new Date(end_datetime),
                status: 'pending', // Default to pending
                created_at: new Date(),
            },
            include: { resources: true }
        });

        // Notify User
        await createNotification(
            user.user_id,
            'Booking Submitted',
            `Your booking request for ${booking.resources.resource_name} has been submitted and is pending approval.`,
            'info'
        );

        // Notify all approvers
        const approvers = await prisma.users.findMany({ where: { role: 'approver' } });
        for (const approver of approvers) {
            await createNotification(
                approver.user_id,
                'New Booking Request',
                `${user.name} requested ${booking.resources.resource_name} for ${new Date(start_datetime).toLocaleString()}.`,
                'warning'
            );
        }

    } catch (error) {
        console.error(error);
        return {
            message: 'Database Error: Failed to Create Booking.',
        };
    }

    revalidatePath('/user/bookings');
    return { success: true, message: 'Booking request submitted successfully!' };
}


export async function approveBooking(id: number) {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return { message: 'Authentication required' };
    }

    const user = await prisma.users.findUnique({ where: { email: userEmail } });
    if (!user) return { message: 'User not found' };

    try {
        const booking = await prisma.bookings.update({
            where: { booking_id: id },
            data: {
                status: 'approved',
                approver_id: user.user_id,
                approved_at: new Date()
            },
            include: { resources: true }
        });

        // Notify User
        await createNotification(
            booking.user_id,
            'Booking Approved',
            `Your booking for ${booking.resources.resource_name} has been approved.`,
            'success'
        );

        revalidatePath('/approver/approvals');
        revalidatePath('/approver');
    } catch (error) {
        return { message: 'Database Error: Failed to Approve Booking.' };
    }
}

export async function rejectBooking(id: number) {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return { message: 'Authentication required' };
    }

    const user = await prisma.users.findUnique({ where: { email: userEmail } });
    if (!user) return { message: 'User not found' };

    try {
        const booking = await prisma.bookings.update({
            where: { booking_id: id },
            data: {
                status: 'rejected',
                approver_id: user.user_id,
                approved_at: new Date()
            },
            include: { resources: true }
        });

        // Notify User
        await createNotification(
            booking.user_id,
            'Booking Rejected',
            `Your booking for ${booking.resources.resource_name} was unfortunately rejected.`,
            'error'
        );

        revalidatePath('/approver/approvals');
        revalidatePath('/approver');
    } catch (error) {
        return { message: 'Database Error: Failed to Reject Booking.' };
    }
}
export async function fetchAllBookings(query?: string) {
    try {
        const bookings = await prisma.bookings.findMany({
            where: query
                ? {
                    OR: [
                        { resources: { resource_name: { contains: query, mode: 'insensitive' } } },
                        { users_bookings_user_idTousers: { name: { contains: query, mode: 'insensitive' } } }
                    ]
                }
                : {},
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
        console.error('Database Error:', error);
        throw new Error('Failed to fetch all bookings.');
    }
}

export async function fetchApproverHistory() {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
        throw new Error('Authentication required');
    }

    const user = await prisma.users.findUnique({ where: { email: userEmail } });
    if (!user) throw new Error('User not found');

    try {
        const bookings = await prisma.bookings.findMany({
            where: { approver_id: user.user_id },
            include: {
                resources: {
                    include: { buildings: true }
                },
                users_bookings_user_idTousers: true,
                users_bookings_approver_idTousers: true
            },
            orderBy: { created_at: 'desc' }
        });
        return bookings;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch approver history.');
    }
}
