import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = (auth?.user as any)?.role;

            const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');
            const isOnApproverPanel = nextUrl.pathname.startsWith('/approver');
            const isOnMaintenancePanel = nextUrl.pathname.startsWith('/maintenance');
            const isOnUserPanel = nextUrl.pathname.startsWith('/user');

            const isOnDashboard = nextUrl.pathname.startsWith('/overview') ||
                isOnAdminPanel ||
                isOnUserPanel ||
                isOnApproverPanel ||
                isOnMaintenancePanel;

            const isOnAuth = nextUrl.pathname.startsWith('/auth');

            if (isOnDashboard) {
                if (isLoggedIn) {
                    // Role-based URL protection
                    if (isOnAdminPanel && userRole !== 'admin') {
                        return Response.redirect(new URL('/unauthorized', nextUrl));
                    }
                    if (isOnApproverPanel && userRole !== 'approver') {
                        return Response.redirect(new URL('/unauthorized', nextUrl));
                    }
                    if (isOnMaintenancePanel && userRole !== 'maintenance') {
                        return Response.redirect(new URL('/unauthorized', nextUrl));
                    }
                    if (isOnUserPanel && userRole !== 'user') {
                        return Response.redirect(new URL('/unauthorized', nextUrl));
                    }


                    // Redirect from /overview to role-specific panels for ALL roles
                    if (nextUrl.pathname === '/overview') {
                        if (userRole === 'admin') return Response.redirect(new URL('/admin', nextUrl));
                        if (userRole === 'user') return Response.redirect(new URL('/user', nextUrl));
                        if (userRole === 'approver') return Response.redirect(new URL('/approver', nextUrl));
                        if (userRole === 'maintenance') return Response.redirect(new URL('/maintenance', nextUrl));
                    }

                    return true;
                }
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && isOnAuth) {
                return Response.redirect(new URL('/overview', nextUrl));
            }
            return true;
        },
        session({ session, token }) {
            if (session.user && token) {
                session.user.role = token.role as any;
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.email = token.email || '';
                session.user.birthdate = token.birthdate ? new Date(token.birthdate as string | Date).toISOString() : null;
            }
            return session;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = (user as any).user_id ? (user as any).user_id.toString() : user.id;
                token.name = user.name;
                token.email = user.email;
                token.birthdate = (user as any).birthdate;
            }
            return token;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
