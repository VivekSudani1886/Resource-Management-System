import { fetchAdminDashboardData } from '@/app/lib/dashboard-actions';
import { UsersIcon, BuildingOfficeIcon, ClockIcon, CalendarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Suspense } from 'react';

async function DashboardContent() {
    const { totalUsers, totalResources, pendingBookings, totalBookings, recentBookings } = await fetchAdminDashboardData();

    const stats = [
        {
            title: 'Total Users',
            value: totalUsers,
            change: '+5% from last month',
            icon: UsersIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/20',
        },
        {
            title: 'Total Resources',
            value: totalResources,
            change: 'Across 3 buildings',
            icon: BuildingOfficeIcon,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/20',
        },
        {
            title: 'Pending Approvals',
            value: pendingBookings,
            change: 'Requires attention',
            icon: ClockIcon,
            color: 'text-amber-600',
            bg: 'bg-amber-100 dark:bg-amber-900/20',
        },
        {
            title: 'Total Bookings',
            value: totalBookings,
            change: 'All time',
            icon: CalendarIcon,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-900/20',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                                Trending
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Bookings */}
                <div className="col-span-4 rounded-2xl border bg-card shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border/50 flex justify-between items-center">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Recent Bookings</h3>
                            <p className="text-sm text-muted-foreground">Latest resource reservation requests.</p>
                        </div>
                        <Link href="/admin/reports" className="text-sm text-primary hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="p-0">
                        <div className="divide-y divide-border/50">
                            {recentBookings.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No bookings found.
                                </div>
                            ) : (
                                recentBookings.map((booking: any) => (
                                    <div key={booking.booking_id} className="flex items-center p-4 hover:bg-muted/30 transition-colors">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {booking.users_bookings_user_idTousers?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="ml-4 space-y-1 flex-1">
                                            <p className="text-sm font-medium leading-none">{booking.resources?.resource_name || 'Unknown Resource'}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Reserved by <span className="font-medium text-foreground">{booking.users_bookings_user_idTousers?.name || 'Unknown User'}</span>
                                            </p>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border border-transparent shadow-sm ${booking.status === 'approved' ? 'bg-green-600 text-white dark:bg-green-900 dark:text-green-100' :
                                                booking.status === 'rejected' ? 'bg-red-600 text-white dark:bg-red-900 dark:text-red-100' :
                                                    'bg-yellow-600 text-white dark:bg-yellow-900 dark:text-yellow-100'
                                                }`}>
                                                {(booking.status || 'pending').charAt(0).toUpperCase() + (booking.status || 'pending').slice(1)}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '-'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="col-span-3 space-y-6">
                    <div className="rounded-2xl border bg-card shadow-sm p-6">
                        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                        <div className="grid gap-4">
                            <Link href="/admin/users/create" className="group flex items-center p-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all">
                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 group-hover:scale-110 transition-transform">
                                    <UsersIcon className="h-5 w-5" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">Add New User</p>
                                    <p className="text-xs text-muted-foreground">Create student or staff account</p>
                                </div>
                            </Link>
                            <Link href="/admin/resources/create" className="group flex items-center p-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all">
                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 group-hover:scale-110 transition-transform">
                                    <BuildingOfficeIcon className="h-5 w-5" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">Add Resource</p>
                                    <p className="text-xs text-muted-foreground">Register new room/equipment</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-transparent p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-primary mb-2">System Status</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            All systems operational
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Database backups are running on schedule. Next maintenance window is on Sunday at 2:00 AM.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Admin Overview</h1>
                <p className="text-muted-foreground mt-2">Manage your organization's resources and users from one central hub.</p>
            </div>

            <Suspense fallback={
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse" />
                    ))}
                </div>
            }>
                <DashboardContent />
            </Suspense>
        </div>
    );
}
