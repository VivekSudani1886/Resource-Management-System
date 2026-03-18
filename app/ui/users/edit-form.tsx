'use client';

import { updateUser } from '@/app/lib/user-actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/ui/toast';
import { ChevronDownIcon } from 'lucide-react';


export default function EditUserForm({ user }: { user: any }) {
 
    const updateUserWithId = updateUser.bind(null, user.user_id);

    const initialState = { message: '', errors: {}, success: false };
    // @ts-ignore
    const [state, dispatch] = useActionState(updateUserWithId, initialState);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        if (state?.success) {
            showToast(state.message || 'User updated successfully!', 'success');
            router.push('/admin/users');
        } else if (state?.message && !state?.success) {
            showToast(state.message, 'error');
        }
    }, [state, showToast, router]);

    return (
        <form action={dispatch} className="rounded-xl bg-card p-6 shadow-sm border border-border">
            {/* Name */}
            <div className="mb-6">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                    Name
                </label>
                <div className="relative mt-2">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={user.name}
                        placeholder="Enter user name"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                    />
                </div>
            </div>

            {/* Email */}
            <div className="mb-6">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    Email
                </label>
                <div className="relative mt-2">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        placeholder="Enter email address"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                    />
                </div>
            </div>

            {/* Role */}
            <div className="mb-6">
                <label htmlFor="role" className="mb-2 block text-sm font-medium text-foreground">
                    Role
                </label>
                <div className="relative">
                    <select
                        id="role"
                        name="role"
                        className="peer block w-full appearance-none cursor-pointer rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        defaultValue={user.role}
                        required
                    >
                        <option value="" disabled>Select a role...</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="approver">Approver</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
                </div>
            </div>

            {/* Status */}
            <div className="mb-6">
                <label htmlFor="status" className="mb-2 block text-sm font-medium text-foreground">
                    Status
                </label>
                <div className="relative">
                    <select
                        id="status"
                        name="status"
                        className="peer block w-full appearance-none cursor-pointer rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        defaultValue={user.is_active ? 'active' : 'inactive'}
                        required
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/50">
                <Link href="/admin/users">
                    <Button variant="ghost" type="button">Cancel</Button>
                </Link>
                <Button type="submit">Update User</Button>
            </div>
        </form>
    );
}
