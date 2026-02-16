'use client';

import { Button } from "@/app/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

// Mock data
const approvals = [
    {
        id: 1,
        resource: "Conference Room B",
        requester: "Bob Smith",
        purpose: "Development Sprint Planning",
        date: "2024-02-15",
        time: "2:00 PM - 4:00 PM",
        status: "pending"
    },
    {
        id: 2,
        resource: "Projector #1",
        requester: "Eve White",
        purpose: "Movie Night Fundraiser",
        date: "2024-02-18",
        time: "6:00 PM - 9:00 PM",
        status: "pending"
    },
    {
        id: 3,
        resource: "Lab Equipment Delta",
        requester: "Frank Green",
        purpose: "Urgent Experiment",
        date: "2024-02-19",
        time: "9:00 AM - 12:00 PM",
        status: "pending"
    },
];

export default function ApprovalList() {
    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                        <tr>
                            <th scope="col" className="px-6 py-4">Resource</th>
                            <th scope="col" className="px-6 py-4">Requester</th>
                            <th scope="col" className="px-6 py-4">Date & Time</th>
                            <th scope="col" className="px-6 py-4">Purpose</th>
                            <th scope="col" className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvals.map((approval) => (
                            <tr key={approval.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground">{approval.resource}</td>
                                <td className="px-6 py-4 text-muted-foreground">{approval.requester}</td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    <div className="flex flex-col">
                                        <span>{approval.date}</span>
                                        <span className="text-xs">{approval.time}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{approval.purpose}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0" title="Approve">
                                            <CheckCircle className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" className="h-8 w-8 p-0" title="Reject">
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {approvals.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                    No pending approvals found.
                </div>
            )}
        </div>
    );
}
