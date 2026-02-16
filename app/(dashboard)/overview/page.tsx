import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
    const session = await auth();
    const role = session?.user?.role;

    if (role === 'admin') redirect('/admin');
    if (role === 'user') redirect('/user');
    if (role === 'approver') redirect('/approver');
    if (role === 'maintenance') redirect('/maintenance');

    redirect('/auth/login');
}
