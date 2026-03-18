'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const ResourceSchema = z.object({
    resource_name: z.string().min(1, 'Resource Name is required').transform(s => s.trim()),
    building_id: z.coerce.number().min(1, 'Building is required'),
    resource_type_id: z.coerce.number().min(1, 'Resource Type is required'),
    floor_number: z.coerce.number(),
    capacity: z.coerce.number().optional(),
    description: z.string().optional(),
    is_active: z.string().optional(),
});

const ResourceTypeSchema = z.object({
    type_name: z.string().min(1, 'Type Name is required').transform(s => s.trim()),
});

const BuildingSchema = z.object({
    building_name: z.string().min(1, 'Building Name is required').transform(s => s.trim()),
    building_number: z.string().min(1, 'Number/Code is required').transform(s => s.trim()),
    total_floors: z.coerce.number().min(1, 'Total Floors is required'),
});

const CreateResource = ResourceSchema;
const UpdateResource = ResourceSchema.partial();
const CreateResourceType = ResourceTypeSchema;
const CreateBuilding = BuildingSchema;

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
        return [];
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
        return [];
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
        return [];
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
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Resource.',
        };
    }

    const { resource_name, building_id, resource_type_id, floor_number, capacity, description, is_active } = validatedFields.data;
    const isActive = is_active === 'active';

    try {
        const existingResources = await prisma.resources.findMany({
            where: {
                building_id: building_id,
            },
        });

        const existingResource = existingResources.find(r => r.resource_name.toLowerCase() === resource_name.toLowerCase());

        if (existingResource) {
            return {
                success: false,
                message: 'Resource name already exists in this building.',
            };
        }

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
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') {
            return {
                success: false,
                message: 'Resource name already exists in this building.',
            };
        }
        return {
            success: false,
            message: 'Database Error: Failed to Create Resource.',
        };
    }

    revalidatePath('/admin/resources');
    return { success: true, message: 'Resource added successfully!' };
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
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Resource.',
        };
    }

    const { resource_name, building_id, resource_type_id, floor_number, capacity, description, is_active } = validatedFields.data;
    const isActive = is_active === 'on' || is_active === 'true' || is_active === 'active'; // Handle checkbox variations

    try {
        const existingResources = await prisma.resources.findMany({
            where: {
                building_id: building_id,
                resource_id: {
                    not: id,
                },
            },
        });
        const existingResource = existingResources.find(r => resource_name && r.resource_name.toLowerCase() === resource_name.toLowerCase());

        if (existingResource) {
            return {
                success: false,
                message: 'Resource name already exists in this building.',
            };
        }

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
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, message: 'Resource name already exists in this building.' };
        }
        return { success: false, message: 'Database Error: Failed to Update Resource.' };
    }

    revalidatePath('/admin/resources');
    return { success: true, message: 'Resource updated successfully!' };
}

export async function deleteResource(id: number) {
    try {
        await prisma.resources.delete({
            where: { resource_id: id },
        });
        revalidatePath('/admin/resources');
    } catch (error) {
        return { success: false, message: 'Database Error: Failed to Delete Resource.' };
    }
    revalidatePath('/admin/resources');
    return { success: true, message: 'Resource deleted successfully!' };
}

export async function createResourceType(prevState: any, formData: FormData) {
    const validatedFields = CreateResourceType.safeParse({
        type_name: formData.get('type_name'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Resource Type.',
        };
    }

    const { type_name } = validatedFields.data;

    try {
        const existingTypes = await prisma.resource_types.findMany();
        const existingType = existingTypes.find(t => t.type_name.toLowerCase() === type_name.toLowerCase());

        if (existingType) {
            return {
                success: false,
                message: 'Resource type already exists.',
            };
        }

        await prisma.resource_types.create({
            data: {
                type_name,
            },
        });
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') {
            return {
                success: false,
                message: 'Resource type already exists.',
            };
        }
        return {
            success: false,
            message: 'Database Error: Failed to Create Resource Type.',
        };
    }

    revalidatePath('/admin/resources');
    revalidatePath('/admin/resources/create');
    return { success: true, message: 'Resource Type created successfully!' };
}

export async function createBuilding(prevState: any, formData: FormData) {
    const validatedFields = CreateBuilding.safeParse({
        building_name: formData.get('building_name'),
        building_number: formData.get('building_number'),
        total_floors: formData.get('total_floors'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Building.',
        };
    }

    const { building_name, building_number, total_floors } = validatedFields.data;

    try {
        const existingBuildings = await prisma.buildings.findMany();
        const existingBuilding = existingBuildings.find(b => b.building_number.toLowerCase() === building_number.toLowerCase());

        if (existingBuilding) {
            return {
                success: false,
                message: 'Building code already exists.',
            };
        }

        await prisma.buildings.create({
            data: {
                building_name,
                building_number,
                total_floors,
            },
        });
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') {
            return {
                success: false,
                message: 'Building code already exists.',
            };
        }
        return {
            success: false,
            message: 'Database Error: Failed to Create Building.',
        };
    }

    revalidatePath('/admin/resources');
    revalidatePath('/admin/resources/create');
    return { success: true, message: 'Building created successfully!' };
}

