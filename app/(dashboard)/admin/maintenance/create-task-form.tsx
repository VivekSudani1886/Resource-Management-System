'use client';

import { createMaintenanceRequest } from '@/app/lib/maintenance-actions';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react'; // Updated hook

export function CreateTaskForm({ resources }: { resources: any[] }) {
    const initialState: any = { message: '' };
    const [state, dispatch] = useActionState(createMaintenanceRequest, initialState);

    return (
        <form action={dispatch} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
                <label className="text-sm font-medium">Resource</label>
                <select name="resource_id" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                    <option value="">Select Resource</option>
                    {resources.map(r => (
                        <option key={r.resource_id} value={r.resource_id}>{r.resource_name}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <input name="maintenance_type" placeholder="e.g. Repair, AC Service" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input type="date" name="scheduled_date" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required />
            </div>
            <div className="pb-0.5">
                <Button type="submit" className="w-full">Schedule Task</Button>
            </div>
            {state?.message && <p className="text-sm text-red-500 col-span-full">{state.message}</p>}
        </form>
    );
}
