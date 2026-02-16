import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    // Allow authenticated users to view
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const typeId = searchParams.get('type_id');
    const buildingId = searchParams.get('building_id');

    try {
        const whereClause: any = { is_active: true };
        if (typeId) whereClause.resource_type_id = parseInt(typeId);
        if (buildingId) whereClause.building_id = parseInt(buildingId);

        const resources = await prisma.resources.findMany({
            where: whereClause,
            include: {
                buildings: true,
                resource_types: true,
                resource_facilities: {
                    include: {
                        facility_master: true
                    }
                }
            }
        });
        return NextResponse.json(resources);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { resource_name, resource_type_id, building_id, floor_number, capacity, description } = body;

        const resource = await prisma.resources.create({
            data: {
                resource_name,
                resource_type_id: parseInt(resource_type_id),
                building_id: parseInt(building_id),
                floor_number: parseInt(floor_number),
                capacity: parseInt(capacity),
                description,
                is_active: true,
                updated_at: new Date(),
            }
        });
        return NextResponse.json(resource, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
    }
}
