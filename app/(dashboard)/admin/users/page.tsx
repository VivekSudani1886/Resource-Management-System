import { Suspense } from 'react';
import UsersTable from '@/app/ui/users/table';
import Search from '@/app/ui/search';
import { Button } from '@/app/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/app/ui/dashboard/page-header';

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';

    return (
        <div className="w-full">
            <PageHeader
                title="Users Management"
                subtitle="Manage institutional accounts, roles, and system access levels."
            >
                <Link href="/admin/users/create">
                    <Button className="flex items-center gap-2 shadow-lg shadow-primary/20">
                        <PlusIcon className="h-5 w-5" />
                        <span>Create User</span>
                    </Button>
                </Link>
            </PageHeader>

            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search users by name or email..." />
            </div>

            <Suspense fallback={<div className="mt-8 text-muted-foreground animate-pulse">Loading users database...</div>}>
                <UsersTable query={query} />
            </Suspense>
        </div>
    );
}
