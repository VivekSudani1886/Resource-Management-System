'use client';

import { updateUser } from '@/app/lib/user-actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';


export default function EditUserForm({ user }: { user: any }) {
 
    const updateUserWithId = updateUser.bind(null, user.user_id);

    const initialState = { message: '', errors: {} };
    const [state, dispatch] = useActionState(updateUserWithId, initialState);

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
                        className="peer block w-full cursor-pointer rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        defaultValue={user.role}
                        required
                    >
                        <option value="" disabled>Select a role...</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="approver">Approver</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
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
                        className="peer block w-full cursor-pointer rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        defaultValue={user.is_active ? 'active' : 'inactive'}
                        required
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
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
