import { NextResponse } from 'next/server';
import { Prisma as prisma } from '@/app/lib/prisma';
import { hash } from 'bcryptjs';

export async function GET() {
    try {
        // Fix admin user
        const updatedUser = await prisma.users.update({
            where: { email: 'admin@rms.com' },
            data: {
                birthdate: new Date('2000-01-01')
            }
        });

        return NextResponse.json({
            message: 'Updated admin',
            user: {
                email: updatedUser.email,
                birthdate: updatedUser.birthdate,
                val: updatedUser.birthdate ? updatedUser.birthdate.valueOf() : null
            }
        });
    } catch (error) {
        return NextResponse.json({ error: String(error), stack: error instanceof Error ? error.stack : undefined }, { status: 200 });
    }
}
