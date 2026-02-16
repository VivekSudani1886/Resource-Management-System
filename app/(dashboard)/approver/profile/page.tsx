import { auth } from '@/auth';
import ProfileView from '@/app/ui/profile-view';

export default async function ProfilePage() {
    const session = await auth();
    const user = session?.user || {
        name: 'Staff Approver',
        email: 'approver@rms.com',
        role: 'approver',
        department: 'Administration'
    };

    const stats = [
        { label: 'Pending Approvals', value: 5, color: 'text-amber-500' },
        { label: 'Total Approved', value: 89, color: 'text-emerald-500' }
    ];

    return (
        <ProfileView
            user={{ ...user, department: 'Administration' }}
            stats={stats}
            basePath="/approver"
        />
    );
}
