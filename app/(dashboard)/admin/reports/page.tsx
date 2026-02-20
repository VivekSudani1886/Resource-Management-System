import { Suspense } from 'react';
import { fetchDetailedReportStats, fetchResourceUtilization } from '@/app/lib/report-actions';
import { ChartBarIcon, StarIcon, CheckBadgeIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'; // Adjust for your icon set

async function ReportStats() {
    const { popularTypeName, topUser, approvalRate, healthScore } = await fetchDetailedReportStats();

    const stats = [
        {
            title: 'Top Resource Type',
            value: popularTypeName,
            desc: 'Most frequently booked',
            icon: ChartBarIcon,
            color: 'text-indigo-600',
            bg: 'bg-indigo-100 dark:bg-indigo-900/20'
        },
        {
            title: 'Power User',
            value: topUser,
            desc: 'Most active booking requests',
            icon: StarIcon,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100 dark:bg-yellow-900/20'
        },
        {
            title: 'Approval Rate',
            value: `${approvalRate}%`,
            desc: 'Bookings approved',
            icon: CheckBadgeIcon,
            color: 'text-green-600',
            bg: 'bg-green-100 dark:bg-green-900/20'
        },
        {
            title: 'Maintenance Health',
            value: `${healthScore}%`,
            desc: 'Tasks completed successfully',
            icon: WrenchScrewdriverIcon,
            color: 'text-rose-600',
            bg: 'bg-rose-100 dark:bg-rose-900/20'
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <div key={i} className="flex flex-col rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <h3 className="text-2xl font-bold mt-1 text-foreground truncate" title={stat.value}>{stat.value}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

async function UtilizationTable() {
    const data = await fetchResourceUtilization();

    return (
        <div className="overflow-x-auto">
            {data.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-4 text-center">
                    <p className="text-sm text-muted-foreground">No bookings recorded yet to analyze utilization.</p>
                </div>
            ) : (
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Resource Name</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3 text-right rounded-r-lg">Total Bookings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item: { name: string; type: string; usage: number }, i: number) => (
                            <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors last:border-0">
                                <td className="px-4 py-3 font-medium">{item.name}</td>
                                <td className="px-4 py-3">{item.type}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="inline-flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${Math.min((item.usage / 20) * 100, 100)}%` }} />
                                        </div>
                                        <span>{item.usage}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default function Page() {
    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold text-foreground mb-6">Reports</h1>
            <Suspense fallback={<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-[120px] rounded-xl bg-muted/50 animate-pulse" />
                ))}
            </div>}>
                <ReportStats />
            </Suspense>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Top 5 Utilized Resources</h2>
                    <Suspense fallback={<div className="h-64 bg-muted/20 animate-pulse rounded-lg" />}>
                        <UtilizationTable />
                    </Suspense>
                </div>

                <div className="col-span-3 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Recent System Alerts</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 rounded-md bg-muted/50 p-3">
                            <div className="h-2 w-2 mt-2 rounded-full bg-yellow-500" />
                            <div>
                                <p className="text-sm font-medium">High booking demand for Projectors</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 rounded-md bg-muted/50 p-3">
                            <div className="h-2 w-2 mt-2 rounded-full bg-green-500" />
                            <div>
                                <p className="text-sm font-medium">Server maintenance completed</p>
                                <p className="text-xs text-muted-foreground">5 hours ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
