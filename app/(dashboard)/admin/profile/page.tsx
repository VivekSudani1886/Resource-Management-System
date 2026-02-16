import { auth } from '@/auth';
import ProfileView from '@/app/ui/profile-view';

export default async function ProfilePage() {
    const session = await auth();
    const user = session?.user || {
        name: 'Admin User',
        email: 'admin@rms.com',
        role: 'admin',
        department: 'Operations'
    };

    const stats = [
        { label: 'Total Users', value: 45, color: 'text-indigo-500' },
        { label: 'Managed Resources', value: 128, color: 'text-purple-500' },
        { label: 'System Health', value: '99.9%', color: 'text-green-500' }
    ];

    return (
        <ProfileView
            user={{ ...user, department: 'Operations' }}
            stats={stats}
            basePath="/admin"
        />
    );
}
