import {
    Box,
    Clock,
    Users,
    Wrench,
    LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    resources: Box,
    bookings: Users,
    pending: Clock,
    maintenance: Wrench,
};

const colorMap: Record<string, string> = {
    resources: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    bookings: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    maintenance: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

export function Card({
    title,
    value,
    type,
    trend,
    trendLabel = "from last month"
}: {
    title: string;
    value: number | string;
    type: 'resources' | 'bookings' | 'pending' | 'maintenance';
    trend?: string; // e.g., "+12.5%"
    trendLabel?: string;
}) {
    const Icon = iconMap[type];
    const colorClass = colorMap[type];

    // Determine trend color (simple heuristic: if it starts with +, it's good/up. If -, bad/down)
    const isPositive = trend?.startsWith('+');
    const trendColor = isPositive ? 'text-emerald-500' : 'text-rose-500';

    return (
        <div className="group relative overflow-hidden rounded-3xl bg-card p-6 shadow-sm border border-border/50 hover:shadow-lg hover:border-border transition-all duration-300">
            <div className="flex items-start justify-between z-10 relative">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-3xl font-bold tracking-tight text-foreground mt-2">
                        {value}
                    </h3>

                    {trend && (
                        <div className="flex items-center gap-1 mt-2 text-xs font-medium">
                            <span className={`${trendColor} bg-background/50 px-1.5 py-0.5 rounded-md border border-border/50 shadow-sm`}>
                                {trend}
                            </span>
                            <span className="text-muted-foreground/70">{trendLabel}</span>
                        </div>
                    )}
                </div>
                <div className={`rounded-2xl p-3.5 ${colorClass} bg-opacity-10 backdrop-blur-sm transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300 shadow-inner`}>
                    {Icon ? <Icon className="h-6 w-6" /> : null}
                </div>
            </div>

            {/* Decorative background gradients */}
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl -z-0 group-hover:from-primary/10 transition-colors duration-500"></div>
            <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-accent/5 blur-2xl -z-0"></div>
        </div>
    );
}
