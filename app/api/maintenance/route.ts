import { auth } from '@/auth';
import { Prisma as prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const maintenance = await prisma.maintenance.findMany({
            include: {
                resources: true
            },
            orderBy: { scheduled_date: 'asc' }
        });
        return NextResponse.json(maintenance);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch maintenance tasks' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    // Admin or Maintenance (to schedule?)
    if (session?.user?.role !== 'admin' && session?.user?.role !== 'maintenance') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { resource_id, maintenance_type, scheduled_date, notes } = await req.json();

        const task = await prisma.maintenance.create({
            data: {
                resource_id: parseInt(resource_id),
                maintenance_type,
                scheduled_date: new Date(scheduled_date),
                notes,
                status: 'scheduled'
            }
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create maintenance task' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await auth();
    if (session?.user?.role !== 'maintenance' && session?.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { maintenance_id, status, notes } = await req.json();

        const task = await prisma.maintenance.update({
            where: { maintenance_id: parseInt(maintenance_id) },
            data: {
                status,
                notes
            }
        });

        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update maintenance task' }, { status: 500 });
    }
}
