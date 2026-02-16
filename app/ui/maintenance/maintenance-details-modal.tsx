'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { Eye, X, Calendar, User, Wrench, MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface MaintenanceDetailsModalProps {
    maintenance: {
        maintenance_id: number;
        status: string | null;
        maintenance_type: string;
        scheduled_date: string | Date;
        created_at: string | Date | null;
        completed_at?: string | Date | null;
        notes?: string | null;
        resources: {
            resource_name: string;
            buildings: {
                building_name: string;
            };
        };
        users_maintenance_created_byTousers?: {
            name: string;
            email: string;
        } | null;
        users_maintenance_completed_byTousers?: {
            name: string;
            email: string;
        } | null;
    };
    iconOnly?: boolean;
}

export default function MaintenanceDetailsModal({ maintenance, iconOnly = false }: MaintenanceDetailsModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const statusColor =
        maintenance.status === 'completed' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' :
            maintenance.status === 'cancelled' ? 'text-gray-600 bg-gray-100 dark:bg-gray-900/30' :
                'text-orange-600 bg-orange-100 dark:bg-orange-900/30';

    const StatusIcon =
        maintenance.status === 'completed' ? CheckCircle2 :
            maintenance.status === 'cancelled' ? XCircle :
                AlertCircle;

    return (
        <>
            {iconOnly ? (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                    className="h-9 w-9"
                    title="View Details"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                    className="gap-2"
                >
                    <Eye className="h-4 w-4" />
                    View Details
                </Button>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

                    <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl p-6 border border-border/50 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors"
                        >
                            <X className="h-5 w-5 text-muted-foreground" />
                        </button>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <h2 className="text-xl font-bold">Maintenance Details</h2>
                                    <p className="text-sm text-muted-foreground">ID: #{maintenance.maintenance_id}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 uppercase ${statusColor}`}>
                                    <StatusIcon className="h-3.5 w-3.5" />
                                    {maintenance.status || 'Scheduled'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">{maintenance.resources.resource_name}</p>
                                        <p className="text-sm text-muted-foreground">{maintenance.resources.buildings.building_name}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                    <Wrench className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">{maintenance.maintenance_type}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Scheduled: {format(new Date(maintenance.scheduled_date), 'PPP')}
                                        </p>
                                    </div>
                                </div>

                                {maintenance.notes && (
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
                                        <p className="text-sm italic">"{maintenance.notes}"</p>
                                    </div>
                                )}

                                <div className="border-t my-4 py-4 space-y-4">
                                    {maintenance.users_maintenance_created_byTousers && (
                                        <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                            <User className="h-5 w-5 text-blue-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created By</p>
                                                <p className="font-medium">{maintenance.users_maintenance_created_byTousers.name}</p>
                                                <p className="text-sm text-muted-foreground">{maintenance.users_maintenance_created_byTousers.email}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    On {maintenance.created_at ? format(new Date(maintenance.created_at), 'PPP p') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {(maintenance.status === 'completed' || maintenance.status === 'cancelled') && maintenance.users_maintenance_completed_byTousers && (
                                        <div className="grid grid-cols-[24px_1fr] gap-3 items-start">
                                            {maintenance.status === 'completed' ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                    {maintenance.status === 'completed' ? 'Completed By' : 'Cancelled By'}
                                                </p>
                                                <p className="font-medium">{maintenance.users_maintenance_completed_byTousers.name}</p>
                                                <p className="text-sm text-muted-foreground">{maintenance.users_maintenance_completed_byTousers.email}</p>
                                                {maintenance.completed_at && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        On {format(new Date(maintenance.completed_at), 'PPP p')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
