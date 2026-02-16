'use client';

import { useActionState } from 'react';
import { changePassword } from '@/app/lib/password-actions';
import { Button } from '@/app/ui/button';

export default function ChangePasswordPage() {
    const [state, dispatch] = useActionState(changePassword, undefined);

    return (
        <div className="flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="w-full max-w-md rounded-xl bg-card p-8 shadow-sm border border-border">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-foreground">Change Password</h1>
                    <p className="text-sm text-center text-muted-foreground mt-2">
                        Ensure your account is secure by using a strong password.
                    </p>
                </div>

                <form action={dispatch} className="space-y-5">
                    <div>
                        <label
                            className="mb-2 block text-sm font-medium text-foreground"
                            htmlFor="currentPassword"
                        >
                            Current Password
                        </label>
                        <input
                            className="block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                            id="currentPassword"
                            type="password"
                            name="currentPassword"
                            placeholder="Enter current password"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="mb-2 block text-sm font-medium text-foreground"
                            htmlFor="newPassword"
                        >
                            New Password
                        </label>
                        <input
                            className="block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                            id="newPassword"
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label
                            className="mb-2 block text-sm font-medium text-foreground"
                            htmlFor="confirmPassword"
                        >
                            Confirm New Password
                        </label>
                        <input
                            className="block w-full rounded-lg border border-input bg-background py-3 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="flex min-h-[24px] items-end" aria-live="polite" aria-atomic="true">
                        {state?.message && (
                            <p className={`text-sm ${state.message.includes('successfully') ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                                {state.message}
                            </p>
                        )}
                    </div>
                    <Button className="w-full h-11 text-base">
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
