'use server';

import { Prisma as prisma } from './prisma';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchAdminDashboardData() {
    noStore();
    try {
        const totalUsers = await prisma.users.count();
        const totalResources = await prisma.resources.count();
        const pendingBookings = await prisma.bookings.count({
            where: { status: 'pending' },
        });
        const totalBookings = await prisma.bookings.count();

        // Get recent bookings
        const recentBookings = await prisma.bookings.findMany({
            take: 5,
            orderBy: { created_at: 'desc' },
            include: {
                users_bookings_user_idTousers: true,
                resources: true,
            },
        });

        return {
            totalUsers,
            totalResources,
            pendingBookings,
            totalBookings,
            recentBookings,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch admin dashboard data.');
    }
}

export async function fetchUserDashboardData(email: string) {
    noStore();
    try {
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) throw new Error("User not found");

        const myBookingsCount = await prisma.bookings.count({
            where: { user_id: user.user_id }
        });

        const myPendingcount = await prisma.bookings.count({
            where: { user_id: user.user_id, status: 'pending' }
        });

        const approvedBookings = await prisma.bookings.count({
            where: { user_id: user.user_id, status: 'approved' }
        });

        const recentBookings = await prisma.bookings.findMany({
            where: { user_id: user.user_id },
            take: 5,
            orderBy: { created_at: 'desc' },
            include: {
                resources: true,
            }
        });

        return {
            myBookingsCount,
            myPendingcount,
            approvedBookings,
            recentBookings
        };

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user dashboard data.');
    }
}

export async function fetchApproverDashboardData(email: string) {
    noStore();
    try {
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) throw new Error("User not found");

        const pendingApprovals = await prisma.bookings.count({
            where: { status: 'pending' }
        });

        const approvedByMe = await prisma.bookings.count({
            where: { approver_id: user.user_id }
        });

        const recentPendingBookings = await prisma.bookings.findMany({
            where: { status: 'pending' },
            take: 5,
            orderBy: { created_at: 'asc' },
            include: {
                users_bookings_user_idTousers: true,
                resources: true,
            },
        });

        return {
            pendingApprovals,
            approvedByMe,
            recentPendingBookings
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch approver dashboard data.');
    }
}
