import { auth } from '@/auth';
import ProfileView from '@/app/ui/profile-view';

export default async function ProfilePage() {
    const session = await auth();
    const user = session?.user || {
        name: 'Maintenance Guy',
        email: 'maint@rms.com',
        role: 'maintenance',
        department: 'Facilities'
    };

    const stats = [
        { label: 'Pending Tasks', value: 8, color: 'text-rose-500' },
        { label: 'Completed Tasks', value: 42, color: 'text-blue-500' },
        { label: 'Avg. Response Time', value: '2h', color: 'text-gray-500' }
    ];

    return (
        <ProfileView
            user={{ ...user, department: 'Facilities' }}
            stats={stats}
            basePath="/maintenance"
        />
    );
}
