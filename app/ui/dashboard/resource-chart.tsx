'use client';

import { cn } from "@/lib/utils";

// Mock data (last 12 months)
const chartData = [
    { name: "Jan", total: 45 },
    { name: "Feb", total: 52 },
    { name: "Mar", total: 48 },
    { name: "Apr", total: 61 },
    { name: "May", total: 55 },
    { name: "Jun", total: 67 },
    { name: "Jul", total: 72 },
    { name: "Aug", total: 60 },
    { name: "Sep", total: 68 },
    { name: "Oct", total: 75 },
    { name: "Nov", total: 82 },
    { name: "Dec", total: 78 },
];

export default function ResourceChart() {
    const max = Math.max(...chartData.map(d => d.total));

    return (
        <div className="w-full h-[350px] flex items-end justify-between gap-2 p-4 pt-8">
            {chartData.map((data, i) => {
                const heightPercentage = Math.round((data.total / 100) * 100);

                return (
                    <div key={data.name} className="flex flex-col items-center justify-end w-full h-full gap-2 group cursor-pointer">
                        {/* Tooltip (CSS only) */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute mb-[100%] z-50 transform -translate-y-2 pointer-events-none">
                            <div className="bg-popover text-popover-foreground text-xs font-medium px-2 py-1 rounded shadow-md border border-border">
                                {data.total}% Usage
                            </div>
                        </div>

                        {/* Bar */}
                        <div
                            className={cn(
                                "w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out hover:opacity-80 relative",
                                // Gradient / Color logic
                                i === chartData.length - 1 ? "bg-primary" : "bg-primary/30 hover:bg-primary/50"
                            )}
                            style={{ height: `${heightPercentage}%` }}
                        >
                            {/* Inner shine effect */}
                            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/20 to-transparent rounded-t-lg"></div>
                        </div>

                        {/* Label */}
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                            {data.name}
                        </span>
                    </div>
                )
            })}
        </div>
    );
}
