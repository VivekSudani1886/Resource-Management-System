'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { Prisma as prisma } from '@/app/lib/prisma';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const email = formData.get('email') as string;

        // Check if user exists and is active before attempting sign in
        if (email) {
            const user = await prisma.users.findUnique({
                where: { email: email }
            });

            if (user && !user.is_active) {
                return 'Your account is inactive. Please contact the administrator.';
            }
        }

        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/overview',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            // Check if the error message contains inactive user info
            const errorMessage = error.cause?.err?.message || error.message || '';

            if (errorMessage.includes('inactive')) {
                return 'Your account is inactive. Please contact the administrator.';
            }

            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function logout() {
    const { signOut } = await import('@/auth');
    await signOut({ redirectTo: '/auth/login' });
}
