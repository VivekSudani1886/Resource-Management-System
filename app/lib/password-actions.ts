'use server';

import { Prisma as prisma } from './prisma';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function changePassword(prevState: any, formData: FormData) {
    // This seems to be for the authenticated user changing their own password from profile
    // Ignoring for now or implementing if needed, but the primary request is forgot/reset
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { message: 'Password updated successfully (Mock)' };
}

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const birthdateStr = formData.get('birthdate') as string;

    if (!email || !birthdateStr) {
        return 'Email and Birthdate are required.';
    }

    try {
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('User not found for email:', email);
            return 'Invalid credentials.';
        }

        console.log('--- PASSWORD RESET DEBUG ---');
        console.log('User found:', user.email);
        console.log('Raw DB Birthdate:', user.birthdate);
        console.log('Input Birthdate:', birthdateStr);

        if (!user.birthdate) {
            console.log('User has no birthdate set in DB.');
            return 'Account does not have a birthdate set. Please contact admin.';
        }

        // Compare dates
        // user.birthdate is a Date object. birthdateStr is YYYY-MM-DD
        const userDob = user.birthdate.toISOString().split('T')[0];
        console.log('Formatted DB Birthdate (ISO):', userDob);

        if (userDob !== birthdateStr) {
            console.log('Date mismatch!');
            // DEBUGGING: Showing values to user to identify format issue
            return `Invalid credentials. DB Date: ${userDob}, Input Date: ${birthdateStr}`;
        }

        // Generate token
        const payload = JSON.stringify({ email: user.email, exp: Date.now() + 1000 * 60 * 60 }); // 1 hour
        const token = Buffer.from(payload).toString('base64');

        // Redirect to reset page directly
        redirect(`/auth/reset-password?token=${token}`);

    } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error;
        }
        console.error('Reset request error:', error);
        return 'Something went wrong.';
    }
}

const ResetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export async function resetPassword(prevState: any, formData: FormData) {
    const rawData = {
        token: formData.get('token'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    };

    const result = ResetPasswordSchema.safeParse(rawData);

    if (!result.success) {
        // Return first error message
        return result.error.errors[0]?.message || 'Invalid input';
    }

    const { token, password } = result.data;

    let email = '';
    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        if (decoded.exp < Date.now()) {
            return 'Token has expired. Please request a new one.';
        }
        email = decoded.email;
    } catch (e) {
        return 'Invalid token.';
    }

    try {
        const hashedPassword = await hash(password, 10);

        await prisma.users.update({
            where: { email },
            data: { password: hashedPassword },
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return 'Failed to reset password.';
    }

    redirect('/auth/login?reset=success');
}
