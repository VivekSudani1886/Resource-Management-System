import Search from '@/app/ui/search';
import { Button } from '@/app/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import ResourceGrid from '@/app/ui/resources/resource-grid';
import { Suspense } from 'react';
import { PageHeader } from '@/app/ui/dashboard/page-header';

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const isAdmin = true; // Temporary for frontend demo

    const params = await searchParams;
    const query = params?.query || '';
    const currentPage = Number(params?.page) || 1;

    return (
        <div className="w-full">
            <PageHeader
                title="Resources"
                subtitle="View and manage all available rooms, labs, and equipment."
            >
                {isAdmin && (
                    <Link href="/admin/resources/create">
                        <Button className="flex items-center gap-2 shadow-lg shadow-primary/20">
                            <PlusIcon className="h-5 w-5" />
                            <span>Add Resource</span>
                        </Button>
                    </Link>
                )}
            </PageHeader>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search resources..." />
            </div>
            <Suspense fallback={<div className="mt-6 text-muted-foreground">Loading resources...</div>}>
                <ResourceGrid query={query} />
            </Suspense>
        </div>
    );
}
