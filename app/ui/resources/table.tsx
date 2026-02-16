import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { DeleteResource } from './buttons';

const mockResources = [
    {
        resource_id: 1,
        resource_name: 'Conference Room A',
        capacity: 20,
        description: 'Large conference room',
        is_active: true,
        resource_types: { type_name: 'Room' },
        buildings: { building_name: 'Main Hall', building_number: 'B1' }
    },
    {
        resource_id: 2,
        resource_name: 'Projector 1',
        capacity: null,
        description: 'Portable projector',
        is_active: true,
        resource_types: { type_name: 'Equipment' },
        buildings: { building_name: 'Main Hall', building_number: 'B1' }
    },
    {
        resource_id: 3,
        resource_name: 'Lab 3',
        capacity: 30,
        description: 'Computer Lab',
        is_active: true,
        resource_types: { type_name: 'Lab' },
        buildings: { building_name: 'Science Wing', building_number: 'B2' }
    }
];

export default async function ResourcesTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    // Filter mock data based on query
    const resources = mockResources.filter(r =>
        r.resource_name.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-zinc-50 p-2 md:pt-0 dark:bg-zinc-900">
                    <table className="hidden min-w-full text-zinc-900 md:table dark:text-zinc-100">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Resource Name
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Type
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Building
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Capacity
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-zinc-950">
                            {resources.map((resource) => (
                                <tr
                                    key={resource.resource_id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none border-zinc-200 dark:border-zinc-800"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p>{resource.resource_name}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {resource.resource_types.type_name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {resource.buildings.building_name} ({resource.buildings.building_number})
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {resource.capacity}
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            {/* Only Admin should see these, but hiding using CSS/Auth check usually happens at parent or inside component */}
                                            <Link
                                                href={`/dashboard/resources/${resource.resource_id}/edit`}
                                                className="rounded-md border p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                            >
                                                <PencilIcon className="w-5" />
                                            </Link>
                                            {/* Delete Button */}
                                            <DeleteResource id={resource.resource_id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Mobile View - Simplified */}
                    <div className="md:hidden">
                        {resources.map((resource) => (
                            <div key={resource.resource_id} className="mb-2 w-full rounded-md bg-white p-4 dark:bg-zinc-950">
                                <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                                    <p>{resource.resource_name}</p>
                                    <p className="text-sm text-zinc-500">{resource.resource_types.type_name}</p>
                                </div>
                                <div className="flex w-full items-center justify-between pt-4">
                                    <p className="text-sm">{resource.buildings.building_name}</p>
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/dashboard/resources/${resource.resource_id}/edit`} className="rounded-md border p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><PencilIcon className="w-4" /></Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
