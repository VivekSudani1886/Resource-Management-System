'use client';

import { createUser } from '@/app/lib/user-actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';

export default function UserForm() {
    const initialState = { message: '', errors: {} };
    const [state, dispatch] = useActionState(createUser, initialState);

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
                        placeholder="Enter user name"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-describedby="name-error"
                    />
                </div>
                {state.errors?.name && (
                    <div id="name-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                        {state.errors.name.map((error: string) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}
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
                        placeholder="Enter email address"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-describedby="email-error"
                    />
                </div>
                {state.errors?.email && (
                    <div id="email-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                        {state.errors.email.map((error: string) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}
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
                        defaultValue=""
                        aria-describedby="role-error"
                    >
                        <option value="" disabled>Select a role...</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="approver">Approver</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>
                {state.errors?.role && (
                    <div id="role-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                        {state.errors.role.map((error: string) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* Password */}
            <div className="mb-6">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                    Password
                </label>
                <div className="relative mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        className="peer block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-describedby="password-error"
                    />
                </div>
                {state.errors?.password && (
                    <div id="password-error" aria-live="polite" className="mt-2 text-sm text-red-500">
                        {state.errors.password.map((error: string) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/50">
                <div aria-live="polite" className="flex-1">
                    {state.message && (
                        <p className="text-sm text-red-500">{state.message}</p>
                    )}
                </div>
                <Link href="/admin/users">
                    <Button variant="ghost" type="button">Cancel</Button>
                </Link>
                <Button type="submit">Create User</Button>
            </div>
        </form>
    );
}
