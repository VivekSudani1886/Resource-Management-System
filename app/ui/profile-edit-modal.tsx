'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { Edit, X, Loader2 } from 'lucide-react';
import { updateUserProfile } from '@/app/lib/user-actions';
import { useToast } from '@/app/ui/toast';

interface ProfileEditModalProps {
    user: {
        name?: string | null;
        email?: string | null;
        birthdate?: string | Date | null;
    };
}

export default function ProfileEditModal({ user }: ProfileEditModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);

        try {
            const result = await updateUserProfile(null, formData);

            if (result?.success) {
                showToast('Profile updated successfully!', 'success');
                setIsOpen(false);
            } else {
                showToast(result?.message || 'Something went wrong', 'error');
            }
        } catch (error) {
            showToast('An unexpected error occurred.', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    if (!isOpen) {
        return (
            <Button variant="secondary" className="gap-2" onClick={() => setIsOpen(true)}>
                <Edit className="h-4 w-4" /> Edit Profile
            </Button>
        );
    }

    const birthdateValue = user.birthdate
        ? new Date(user.birthdate).toISOString().split('T')[0]
        : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

            <div className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl p-6 border border-border/50 animate-in zoom-in-95 duration-200">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent/50 transition-colors"
                >
                    <X className="h-5 w-5 text-muted-foreground" />
                </button>

                <h2 className="text-xl font-bold mb-1">Edit Profile</h2>
                <p className="text-sm text-muted-foreground mb-6">Update your personal information.</p>

                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            defaultValue={user.name || ''}
                            placeholder="Your Name"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email (Read-only)
                        </label>
                        <input
                            id="email"
                            name="email"
                            defaultValue={user.email || ''}
                            readOnly
                            className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-70 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="birthdate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Birthdate
                        </label>
                        <input
                            id="birthdate"
                            type="date"
                            name="birthdate"
                            defaultValue={birthdateValue}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
