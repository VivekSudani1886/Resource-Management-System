import { fetchUsers, deleteUser } from '@/app/lib/user-actions';
import { PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default async function UsersTable({ query }: { query: string }) {
    const users = await fetchUsers(query);

    if (!users || users.length === 0) {
        return (
            <div className="mt-6 p-12 text-center rounded-xl border-2 border-dashed border-muted text-muted-foreground bg-muted/5">
                <UserCircleIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-2 text-sm font-semibold text-foreground">No users found</h3>
                <p className="mt-1 text-sm text-muted-foreground">We couldn't find any users matching "{query}".</p>
            </div>
        );
    }

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium">User Info</th>
                                <th scope="col" className="px-6 py-4 font-medium">Role</th>
                                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                                {/* <th scope="col" className="px-6 py-4 font-medium text-right">BirthDate</th> */}
                                <th scope="col" className="px-6 py-4 font-medium">Joined Date</th>
                                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 bg-card">
                            {users.map((user) => (
                                <tr key={user.user_id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border border-transparent shadow-sm ${user.role === 'admin' ? 'bg-purple-600 text-white dark:bg-purple-900 dark:text-purple-100' :
                                            user.role === 'approver' ? 'bg-blue-600 text-white dark:bg-blue-900 dark:text-blue-100' :
                                                user.role === 'maintenance' ? 'bg-orange-600 text-white dark:bg-orange-900 dark:text-orange-100' :
                                                    'bg-green-600 text-white dark:bg-green-900 dark:text-green-100'
                                            }`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2.5 w-2.5 rounded-full ${user.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 opacity-50'}`} />
                                            <span className="text-sm text-foreground/80">{user.is_active ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </td>
                                    {/* <td className="px-6 py-4 text-muted-foreground text-sm">
                                            {user?.birthdate?.toString()}
                                    </td> */}
                                    <td className="px-6 py-4 text-muted-foreground text-sm">
                                        {user.created_at ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(user.created_at) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                href={`/admin/users/${user.user_id}/edit`}
                                                className="group inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                                title="Edit User"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </Link>
                                            <form action={deleteUser.bind(null, user.user_id)}>
                                                <button
                                                    className="group inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                                    title="Delete User"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

