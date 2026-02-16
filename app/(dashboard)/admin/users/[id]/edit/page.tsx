import EditUserForm from '@/app/ui/users/edit-form';
import { fetchUserById } from '@/app/lib/user-actions';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = Number(id);
    const user = await fetchUserById(userId);

    if (!user) {
        notFound();
    }

    return (
        <main>
            <h1 className="mb-4 text-xl md:text-2xl text-foreground">Edit User</h1>
            <EditUserForm user={user} />
        </main>
    );
}
