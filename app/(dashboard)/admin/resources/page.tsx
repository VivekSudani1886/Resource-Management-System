import Search from '@/app/ui/search';
import { Button } from '@/app/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import ResourceGrid from '@/app/ui/resources/resource-grid';
import { Suspense } from 'react';
import { auth } from '@/auth';

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    // const session = await auth();
    // const isAdmin = session?.user?.role === 'admin';
    const isAdmin = true; // Temporary for frontend demo

    const params = await searchParams;
    const query = params?.query || '';
    const currentPage = Number(params?.page) || 1;


    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Resources</h1>
                {isAdmin && (
                    <Link href="/admin/resources/create">
                        <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                            <PlusIcon className="h-5 w-5" />
                            <span className="hidden md:block">Add Resource</span>
                        </Button>
                    </Link>
                )}
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search resources..." />
            </div>
            <Suspense fallback={<div className="mt-6 text-muted-foreground">Loading resources...</div>}>
                <ResourceGrid query={query} />
            </Suspense>
        </div>
    );
}
