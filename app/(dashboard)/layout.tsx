import SidebarWrapper from '@/app/ui/dashboard/sidebar-wrapper';
import Header from '@/app/ui/dashboard/header';
import SideNav from '@/app/ui/dashboard/sidenav';
import { SidebarProvider } from '@/app/ui/dashboard/sidebar-context';
import { auth } from '@/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const userRole = (session?.user as any)?.role || 'user'; // Default to user if not found/mock

    return (
        <SidebarProvider>
            <div className="flex h-screen overflow-hidden bg-background">
                {/* Sidebar - Wrapped for collapse state */}
                <SidebarWrapper>
                    <SideNav role={userRole} />
                </SidebarWrapper>

                {/* Main Content Area */}
                <div className="flex flex-col flex-1 min-w-0">
                    <Header user={session?.user} />

                    <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 no-scrollbar scroll-smooth">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
