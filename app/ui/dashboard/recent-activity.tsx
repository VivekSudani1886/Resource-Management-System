import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/avatar";

const recentActivity = [
    {
        id: 1,
        user: "Alice Johnson",
        action: "booked",
        resource: "Conference Room A",
        time: "2 hours ago",
        initials: "AJ"
    },
    {
        id: 2,
        user: "Bob Smith",
        action: "reported issue",
        resource: "Projector #3",
        time: "4 hours ago",
        initials: "BS"
    },
    {
        id: 3,
        user: "Charlie Brown",
        action: "returned",
        resource: "Laptop 007",
        time: "1 day ago",
        initials: "CB"
    },
    {
        id: 4,
        user: "Diana Prince",
        action: "requested approval",
        resource: "Lab Equipment Delta",
        time: "1 day ago",
        initials: "DP"
    },
];

export default function RecentActivity() {
    return (
        <div className="col-span-1 md:col-span-4 lg:col-span-3 rounded-3xl bg-card border border-border/50 shadow-sm p-6 lg:p-8 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <h3 className="font-semibold text-lg mb-6 text-foreground tracking-tight flex items-center gap-2">
                Recent Activity
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Updates</span>
            </h3>
            <div className="space-y-1 flex-1">
                {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="group relative flex items-start gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer">
                        {/* Connecting Line (Timeline effect - mocked visual) */}
                        {index !== recentActivity.length - 1 && (
                            <div className="absolute left-[27px] top-12 bottom-[-10px] w-[2px] bg-border/40 group-hover:bg-primary/20 transition-colors"></div>
                        )}

                        <div className="h-10 w-10 shrink-0 rounded-full bg-background border-2 border-primary/10 flex items-center justify-center text-xs font-bold text-primary shadow-sm group-hover:scale-110 group-hover:border-primary/30 transition-all z-10">
                            {activity.initials}
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                            <p className="text-sm text-foreground/90 leading-snug">
                                <span className="font-semibold text-foreground hover:text-primary transition-colors">{activity.user}</span>
                                <span className="text-muted-foreground/80"> {activity.action} </span>
                                <span className="font-medium text-foreground">{activity.resource}</span>
                            </p>
                            <span className="text-xs text-muted-foreground/60 mt-1 block font-medium">
                                {activity.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-2">
                <button className="w-full py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all border border-transparent hover:border-border/50">
                    View All Usage History
                </button>
            </div>
        </div>
    );
}
