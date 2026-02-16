import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import type { User } from 'next-auth';

import { Prisma as prisma } from '@/app/lib/prisma';

// Mock User removed


export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    // Import prisma dynamically to avoid circular dependency issues during build if any, 
                    // though static import is usually fine. Let's use the one from lib.
                    // Actually, let's just use the global import at top level if possible, 
                    // but for now I'll stick to the existing imports and add the new one.
                    // Wait, I cannot add imports inside the object. I need to add the import at the top.

                    try {
                        const user = await prisma.users.findUnique({
                            where: { email: email }
                        });

                        if (!user) return null;

                        // Check if user is inactive
                        if (!user.is_active) {
                            throw new Error('Your account is inactive. Please contact the administrator.');
                        }

                        // Passwords in DB should be hashed. 
                        const passwordsMatch = await bcrypt.compare(password, user.password);
                        if (passwordsMatch) {
                            return {
                                id: user.user_id.toString(),
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                birthdate: user.birthdate ? user.birthdate.toISOString() : null,
                            } as any;
                        }
                    } catch (error) {
                        console.error('Auth error:', error);
                        throw error; // Re-throw to show error message to user
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
