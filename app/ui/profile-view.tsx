import { User, Mail, Shield, Building, KeyRound, Calendar } from 'lucide-react';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import ProfileEditModal from '@/app/ui/profile-edit-modal';

interface ProfileViewProps {
    user: {
        name?: string | null;
        email?: string | null;
        role?: string | null;
        image?: string | null;
        // extended properties if available
        department?: string;
        birthdate?: string | Date | null;
    };
    stats?: {
        label: string;
        value: string | number;
        color?: string;
    }[];
    basePath: string; // e.g. "/user", "/admin"
}

export default function ProfileView({ user, stats, basePath }: ProfileViewProps) {
    const roleDisplay = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
                <p className="text-muted-foreground">Manage your account settings and view your activity.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Profile Card */}
                <div className="md:col-span-2 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center text-primary shadow-inner">
                            {user.image ? (
                                <img src={user.image} alt={user.name || 'User'} className="h-full w-full rounded-full object-cover" />
                            ) : (
                                <User className="h-10 w-10" />
                            )}
                        </div>
                        <div className="text-center sm:text-left space-y-1 mt-2">
                            <h2 className="text-2xl font-bold text-foreground">{user.name || 'Guest User'}</h2>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
                                <Shield className="h-3 w-3" />
                                {roleDisplay}
                            </div>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-accent/30 border border-border/50 transition-colors hover:bg-accent/50">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-lg bg-background shadow-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</span>
                            </div>
                            <p className="text-sm font-semibold text-foreground pl-[3.25rem]">{user.email}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-accent/30 border border-border/50 transition-colors hover:bg-accent/50">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-lg bg-background shadow-sm">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</span>
                            </div>
                            <p className="text-sm font-semibold text-foreground pl-[3.25rem]">{user.department || 'General'}</p>
                        </div>


                        <div className="p-4 rounded-xl bg-accent/30 border border-border/50 transition-colors hover:bg-accent/50">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-lg bg-background shadow-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Birthdate</span>
                            </div>
                            <p className="text-sm font-semibold text-foreground pl-[3.25rem]">
                                {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'Not set'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href={`${basePath}/profile/change-password`}>
                            <Button variant="outline" className="gap-2">
                                <KeyRound className="h-4 w-4" /> Change Password
                            </Button>
                        </Link>
                        <ProfileEditModal user={user} />
                    </div>
                </div>

                {/* Stats / Sidebar */}
                <div className="space-y-6">
                    {stats && stats.length > 0 && (
                        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Overview</h3>
                            <div className="space-y-3">
                                {stats.map((stat, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-background border border-border/50 flex flex-col">
                                        <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                                        <span className={`text-2xl font-bold mt-1 ${stat.color || 'text-foreground'}`}>
                                            {stat.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                        <h4 className="font-semibold text-primary mb-2">Need Help?</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Contact support if you need to update sensitive information.
                        </p>
                        <Button size="sm" className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 shadow-none">
                            Contact Support
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
