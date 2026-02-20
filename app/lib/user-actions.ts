'use server';

import { Prisma as prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { auth } from '@/auth';
import { createNotification } from './notification-actions';

const UserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['admin', 'user', 'approver', 'maintenance']),
    status: z.string().optional(),
});

const CreateUser = UserSchema;
const UpdateUser = UserSchema.partial();

export async function fetchUsers(query?: string) {
    try {
        const users = await prisma.users.findMany({
            where: query
                ? {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                    ],
                }
                : {},
            orderBy: { created_at: 'desc' },
        });
        return users;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch users.');
    }
}

export async function fetchUserById(id: number) {
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: id },
        });
        return user;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function createUser(prevState: any, formData: FormData) {
    const validatedFields = CreateUser.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
        status: formData.get('status') || undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
        };
    }

    const { name, email, password, role, status } = validatedFields.data;
    const hashedPassword = await hash(password, 10);
    const isActive = status === 'active';

    try {
        await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role as any,
                is_active: isActive,
            },
        });
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create User.',
        };
    }

    revalidatePath('/admin/users');
    return { success: true, message: 'User created successfully!' };
}

export async function updateUser(id: number, prevState: any, formData: FormData) {
    const validatedFields = UpdateUser.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role') as any,
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update User.',
        };
    }

    const { name, email, role, status } = validatedFields.data;
    const isActive = status === 'active';

    try {
        await prisma.users.update({
            where: { user_id: id },
            data: {
                name,
                email,
                role,
                is_active: isActive,
            },
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Update User.' };
    }

    revalidatePath('/admin/users');
    return { success: true, message: 'User updated successfully!' };
}

export async function deleteUser(id: number) {
    try {
        await prisma.users.delete({
            where: { user_id: id },
        });
        revalidatePath('/admin/users');
        return { success: true, message: 'User deleted successfully.' };
    } catch (error) {
        return { success: false, message: 'Database Error: Failed to Delete User.' };
    }
}

const RegisterSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
    birthdate: z.string().min(1, 'Birthdate is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export async function registerUser(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        birthdate: formData.get('birthdate'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Register.',
        };
    }

    const { name, email, password, birthdate } = validatedFields.data;
    const hashedPassword = await hash(password, 10);

    try {
        // Check if user already exists
        const existingUser = await prisma.users.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                message: 'User with this email already exists.',
                errors: { email: ['Email already taken.'] }
            };
        }

        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'user', // Default role for public registration
                is_active: true,
                birthdate: new Date(birthdate),
            },
        });

        await createNotification(
            newUser.user_id,
            'Welcome to ResourceSys!',
            `Hi ${name}, welcome to our Resource Management System. You can now start booking resources.`,
            'success'
        );
    } catch (error) {
        return {
            message: 'Database Error: Failed to Register.',
        };
    }

    return { success: true, message: 'Registration successful!' };
}

const UpdateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    birthdate: z.string().nullable().optional(),
});

export async function updateUserProfile(prevState: any, formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            message: 'Not authenticated. Please log in to update your profile.',
        };
    }

    const userId = parseInt(session.user.id);

    // Validate form fields
    const validatedFields = UpdateProfileSchema.safeParse({
        name: formData.get('name'),
        birthdate: formData.get('birthdate') || null,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Profile.',
        };
    }

    const { name, birthdate } = validatedFields.data;

    try {
        await prisma.users.update({
            where: { user_id: userId },
            data: {
                name,
                birthdate: birthdate ? new Date(birthdate) : null,
            },
        });

        await createNotification(
            userId,
            'Profile Updated',
            'Your profile information has been successfully updated.',
            'success'
        );
    } catch (error) {
        return { message: 'Database Error: Failed to Update Profile.' };
    }

    // Revalidate all profile pages
    revalidatePath('/user/profile');
    revalidatePath('/admin/profile');
    revalidatePath('/approver/profile');
    revalidatePath('/maintenance/profile');

    return { message: 'Profile updated successfully.', success: true };
}

