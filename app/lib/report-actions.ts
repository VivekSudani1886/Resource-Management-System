'use server';

import { Prisma as prisma } from './prisma';

export async function fetchReportStats() {
    try {
        const [
            totalResources,
            totalBookings,
            pendingBookings,
            activeMaintenance
        ] = await Promise.all([
            prisma.resources.count(),
            prisma.bookings.count(),
            prisma.bookings.count({
                where: { status: 'pending' },
            }),
            prisma.maintenance.count({
                where: { status: 'scheduled' },
            }),
        ]);

        return {
            totalResources,
            totalBookings,
            pendingBookings,
            activeMaintenance,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch report stats.');
    }
}

export async function fetchRecentCleanups() {
    try {
        const recentMaintenance = await prisma.maintenance.findMany({
            where: { status: 'completed' },
            take: 5,
            orderBy: { scheduled_date: 'desc' },
            include: { resources: true },
        });
        return recentMaintenance;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export async function fetchResourceUtilization() {
    try {
        const resourceCounts = await prisma.bookings.groupBy({
            by: ['resource_id'],
            _count: { booking_id: true },
            orderBy: { _count: { booking_id: 'desc' } },
            take: 5,
        });

        const resources = await Promise.all(
            resourceCounts.map(async (item) => {
                const resource = await prisma.resources.findUnique({
                    where: { resource_id: item.resource_id },
                    select: { resource_name: true, resource_types: { select: { type_name: true } } },
                });
                return {
                    name: resource?.resource_name || 'Unknown',
                    type: resource?.resource_types?.type_name || 'Unknown',
                    usage: item._count.booking_id,
                };
            })
        );
        return resources;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export async function fetchDetailedReportStats() {
    try {
        // 1. Most Popular Resource Type
        const popularTypeGroup = await prisma.bookings.groupBy({
            by: ['resource_id'],
            _count: { resource_id: true },
            orderBy: { _count: { resource_id: 'desc' } },
            take: 1,
        });

        let popularTypeName = 'N/A';
        if (popularTypeGroup.length > 0) {
            const resource = await prisma.resources.findUnique({
                where: { resource_id: popularTypeGroup[0].resource_id },
                include: { resource_types: true },
            });
            popularTypeName = resource?.resource_types?.type_name || 'N/A';
        }

        // 2. Most Active User
        const activeUserGroup = await prisma.bookings.groupBy({
            by: ['user_id'],
            _count: { user_id: true },
            orderBy: { _count: { user_id: 'desc' } },
            take: 1,
        });

        let topUser = 'N/A';
        if (activeUserGroup.length > 0) {
            const user = await prisma.users.findUnique({
                where: { user_id: activeUserGroup[0].user_id },
            });
            topUser = user?.name || 'N/A';
        }

        // 3. Completion Rate (Approved vs Total)
        const totalBookings = await prisma.bookings.count();
        const approvedBookings = await prisma.bookings.count({ where: { status: 'approved' } });
        const approvalRate = totalBookings > 0 ? Math.round((approvedBookings / totalBookings) * 100) : 0;

        // 4. Maintenance Health
        const totalMaintenance = await prisma.maintenance.count();
        const completedMaintenance = await prisma.maintenance.count({ where: { status: 'completed' } });
        const healthScore = totalMaintenance > 0 ? Math.round((completedMaintenance / totalMaintenance) * 100) : 100;

        return {
            popularTypeName,
            topUser,
            approvalRate,
            healthScore,
            totalBookings
        };
    } catch (error) {
        console.error('Database Error:', error);
        return {
            popularTypeName: 'Error',
            topUser: 'Error',
            approvalRate: 0,
            healthScore: 0,
            totalBookings: 0
        };
    }
}
