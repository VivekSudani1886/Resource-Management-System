'use server';

import { Prisma as prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function fetchNotifications() {
    const session = await auth();
    if (!session?.user?.email) return [];

    const user = await prisma.users.findUnique({
        where: { email: session.user.email }
    });

    if (!user) return [];

    try {
        const notifications = await (prisma as any).notifications.findMany({
            where: { user_id: user.user_id },
            orderBy: { created_at: 'desc' },
            take: 10
        });
        return notifications;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export async function markAsRead(notificationId: number) {
    try {
        await (prisma as any).notifications.update({
            where: { notification_id: notificationId },
            data: { is_read: true }
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Database Error:', error);
        return { success: false };
    }
}

export async function createNotification(userId: number, title: string, message: string, type: string = 'info') {
    try {
        await (prisma as any).notifications.create({
            data: {
                user_id: userId,
                title,
                message,
                type,
                created_at: new Date()
            }
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Database Error:', error);
        return { success: false };
    }
}
