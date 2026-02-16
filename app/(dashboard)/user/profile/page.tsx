import { fetchUserDashboardData } from '@/app/lib/dashboard-actions';
import { Prisma as prisma } from '@/app/lib/prisma';
import { auth } from '@/auth';
import ProfileView from '@/app/ui/profile-view';

export default async function ProfilePage() {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
        return <div>Please log in.</div>;
    }

    const userData = await prisma.users.findUnique({
        where: { email },
    });

    if (!userData) {
        return <div>User not found.</div>;
    }

    const { myBookingsCount, approvedBookings } = await fetchUserDashboardData(email);

    const stats = [
        { label: 'Total Bookings', value: myBookingsCount, color: 'text-blue-500' },
        { label: 'Approved Reservations', value: approvedBookings, color: 'text-emerald-500' }
    ];

    return (
        <ProfileView
            user={{
                name: userData.name,
                email: userData.email,
                role: userData.role,
                birthdate: userData.birthdate,
            }}
            stats={stats}
            basePath="/user"
        />
    );
}
