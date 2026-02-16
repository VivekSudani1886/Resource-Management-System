'use server';

import { Prisma as prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';

const MaintenanceSchema = z.object({
    resource_id: z.coerce.number().min(1, 'Resource is required'),
    maintenance_type: z.string().min(1, 'Maintenance Type is required'),
    scheduled_date: z.string().or(z.date()).transform((val) => new Date(val)),
    notes: z.string().optional(),
    status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
});

const CreateMaintenance = MaintenanceSchema;

export async function fetchMaintenanceRequests() {
    try {
        const requests = await prisma.maintenance.findMany({
            include: {
                resources: {
                    include: {
                        buildings: true,
                        resource_types: true,
                    }
                },
                users_maintenance_created_byTousers: true,
                users_maintenance_completed_byTousers: true,
            },
            orderBy: { scheduled_date: 'asc' },
        });
        return requests;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch maintenance requests.');
    }
}

export async function fetchMaintenanceStats() {
    try {
        const total = await prisma.maintenance.count();
        const scheduled = await prisma.maintenance.count({ where: { status: 'scheduled' } });
        const completed = await prisma.maintenance.count({ where: { status: 'completed' } });
        return { total, scheduled, completed };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch maintenance stats.');
    }
}

export async function createMaintenanceRequest(prevState: any, formData: FormData) {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return { message: 'Authentication required' };
    }

    const user = await prisma.users.findUnique({ where: { email: userEmail } });
    if (!user) return { message: 'User not found' };

    const rawFormData = {
        resource_id: formData.get('resource_id'),
        maintenance_type: formData.get('maintenance_type'),
        scheduled_date: formData.get('scheduled_date'),
        notes: formData.get('notes'),
        status: formData.get('status') || 'scheduled',
    };

    const validatedFields = CreateMaintenance.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Maintenance Request.',
        };
    }

    const { resource_id, maintenance_type, scheduled_date, notes, status } = validatedFields.data;

    try {
        await prisma.maintenance.create({
            data: {
                resource_id,
                maintenance_type,
                scheduled_date,
                notes,
                status: status as any,
                created_by: user.user_id,
            },
        });

        // If scheduled, mark resource as inactive
        if (status === 'scheduled') {
            await prisma.resources.update({
                where: { resource_id },
                data: { is_active: false }
            });
        }
    } catch (error) {
        console.error(error);
        return {
            message: 'Database Error: Failed to Create Maintenance Request.',
        };
    }

    revalidatePath('/maintenance');
    revalidatePath('/maintenance/maintenance');
    return { message: 'Maintenance Request Created Successfully' };
}

export async function updateMaintenanceStatus(id: number, status: 'scheduled' | 'completed' | 'cancelled') {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
        throw new Error('Authentication required');
    }

    const user = await prisma.users.findUnique({ where: { email: userEmail } });
    if (!user) throw new Error('User not found');

    try {
        const updateData: any = { status };

        // If completing or cancelling, record who did it and when
        if (status === 'completed' || status === 'cancelled') {
            updateData.completed_by = user.user_id;
            updateData.completed_at = new Date();
        }

        const maintenance = await prisma.maintenance.update({
            where: { maintenance_id: id },
            data: updateData,
            include: { resources: true }
        });

        // Side effects on resource status
        if (status === 'completed' || status === 'cancelled') {
            await prisma.resources.update({
                where: { resource_id: maintenance.resource_id },
                data: { is_active: true }
            });
        }
        else if (status === 'scheduled') {
            await prisma.resources.update({
                where: { resource_id: maintenance.resource_id },
                data: { is_active: false }
            });
        }

        revalidatePath('/maintenance');
        revalidatePath('/maintenance/maintenance');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update maintenance status.');
    }
}

export async function deleteMaintenanceRequest(id: number) {
    try {
        await prisma.maintenance.delete({
            where: { maintenance_id: id },
        });
        revalidatePath('/maintenance/maintenance');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Maintenance Request.' };
    }
}
