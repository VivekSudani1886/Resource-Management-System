import Link from "next/link";
import { MoveLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
            <div className="flex flex-col items-center space-y-6 text-center">
                {/* Icon */}
                <div className="rounded-full bg-muted p-6">
                    <FileQuestion className="h-16 w-16 text-muted-foreground" />
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                        404
                    </h1>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Page Not Found
                    </h2>
                    <p className="max-w-[500px] text-muted-foreground md:text-lg">
                        Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
                    </p>
                </div>

                {/* Action Button */}
                <Link
                    href="/overview" // Pointing to the main dashboard/overview
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    <MoveLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
                <div className="text-sm text-muted-foreground">
                    <Link href="/" className="hover:underline hover:text-primary">
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
