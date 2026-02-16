'use client';

import { TrashIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';

export function CreateResource() {
    return (
        <Link
            href="/dashboard/resources/create"
            className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
            <span className="hidden md:block">Create Resource</span>
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function DeleteResource({ id }: { id: number }) {
    // const deleteResourceWithId = deleteResource.bind(null, id);
    return (
        <form>
            <button className="rounded-md border p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}
