import Search from '@/app/ui/search';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import UserResourceGrid from '@/app/ui/resources/user-resource-grid';
import { Suspense } from 'react';

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const params = await searchParams;
    const query = params?.query || '';

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Browse Resources</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search resources..." />
            </div>
            <Suspense fallback={<div className="mt-6 text-muted-foreground">Loading resources...</div>}>
                <UserResourceGrid query={query} />
            </Suspense>
        </div>
    );
}
