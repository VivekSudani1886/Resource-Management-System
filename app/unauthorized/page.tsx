import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <main className="flex h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500">
                        <ShieldAlert className="w-16 h-16" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
                        Access Denied
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-[500px] mx-auto">
                        You do not have permission to view this page. Please contact your administrator if you believe this is an error.
                    </p>
                </div>
                <div className="flex justify-center gap-4">
                    <Link href="/overview">
                        <Button variant="default" className="min-w-[140px]">
                            Go to Dashboard
                        </Button>
                    </Link>
                    <Link href="/auth/login">
                        <Button variant="outline" className="min-w-[140px]">
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
