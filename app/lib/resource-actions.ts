'use server';

import { Prisma as prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const ResourceSchema = z.object({
    resource_name: z.string().min(1, 'Resource Name is required'),
    building_id: z.coerce.number().min(1, 'Building is required'),
    resource_type_id: z.coerce.number().min(1, 'Resource Type is required'),
    floor_number: z.coerce.number(),
    capacity: z.coerce.number().optional(),
    description: z.string().optional(),
    is_active: z.string().optional(),
});

const CreateResource = ResourceSchema;
const UpdateResource = ResourceSchema.partial();

export async function fetchResources(query?: string) {
    try {
        console.log('Fetching resources...');
        const resources = await prisma.resources.findMany({
            where: query
                ? {
                    resource_name: { contains: query, mode: 'insensitive' },
                }
                : {},
            include: {
                buildings: true,
                resource_types: true,
            },
            orderBy: { resource_name: 'asc' },
        });
        return resources;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch resources.');
    }
}

export async function fetchBuildings() {
    try {
        const buildings = await prisma.buildings.findMany({
            orderBy: { building_name: 'asc' },
        });
        return buildings;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch buildings.');
    }
}

export async function fetchResourceTypes() {
    try {
        const types = await prisma.resource_types.findMany({
            orderBy: { type_name: 'asc' },
        });
        return types;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch resource types.');
    }
}

export async function fetchResourceById(id: number) {
    try {
        const resource = await prisma.resources.findUnique({
            where: { resource_id: id },
            include: {
                buildings: true,
                resource_types: true,
            },
        });
        return resource;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch resource.');
    }
}

export async function createResource(prevState: any, formData: FormData) {
    const validatedFields = CreateResource.safeParse({
        resource_name: formData.get('resource_name'),
        building_id: formData.get('building_id'),
        resource_type_id: formData.get('resource_type_id'),
        floor_number: formData.get('floor_number'),
        capacity: formData.get('capacity'),
        description: formData.get('description'),
        is_active: formData.get('is_active') || undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Resource.',
        };
    }

    const { resource_name, building_id, resource_type_id, floor_number, capacity, description, is_active } = validatedFields.data;
    const isActive = is_active === 'active';

    try {
        await prisma.resources.create({
            data: {
                resource_name,
                building_id,
                resource_type_id,
                floor_number,
                capacity: capacity || 0,
                description,
                is_active: isActive,
            },
        });
    } catch (error) {
        console.error(error);
        return {
            message: 'Database Error: Failed to Create Resource.',
        };
    }

    revalidatePath('/admin/resources');
    redirect('/admin/resources');
}

export async function updateResource(id: number, prevState: any, formData: FormData) {
    const validatedFields = UpdateResource.safeParse({
        resource_name: formData.get('resource_name'),
        building_id: formData.get('building_id'),
        resource_type_id: formData.get('resource_type_id'),
        floor_number: formData.get('floor_number'),
        capacity: formData.get('capacity'),
        description: formData.get('description'),
        is_active: formData.get('is_active'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Resource.',
        };
    }

    const { resource_name, building_id, resource_type_id, floor_number, capacity, description, is_active } = validatedFields.data;
    const isActive = is_active === 'on' || is_active === 'true' || is_active === 'active'; // Handle checkbox variations

    try {
        await prisma.resources.update({
            where: { resource_id: id },
            data: {
                resource_name,
                building_id,
                resource_type_id,
                floor_number,
                capacity,
                description,
                is_active: isActive,
            },
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Update Resource.' };
    }

    revalidatePath('/admin/resources');
    redirect('/admin/resources');
}

export async function deleteResource(id: number) {
    try {
        await prisma.resources.delete({
            where: { resource_id: id },
        });
        revalidatePath('/admin/resources');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Resource.' };
    }
    revalidatePath('/admin/resources');
    return { success: true, message: 'Resource deleted successfully!' };
}
