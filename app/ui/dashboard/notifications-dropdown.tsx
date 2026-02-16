'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { fetchNotifications, markAsRead } from '@/app/lib/notification-actions';
import { formatDistanceToNow } from 'date-fns';

export function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const loadNotifications = async () => {
        const data = await fetchNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.is_read).length);
    };

    useEffect(() => {
        loadNotifications();
        // Refresh every minute
        const interval = setInterval(loadNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: number) => {
        const result = await markAsRead(id);
        if (result.success) {
            setNotifications(notifications.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'success': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' };
            case 'error': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' };
            case 'warning': return { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
            default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' };
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 origin-top-right rounded-2xl border border-border bg-card p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
                        <h3 className="text-sm font-bold text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                                {unreadCount} New
                            </span>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto py-2">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                    <Bell className="h-6 w-6 text-muted-foreground opacity-20" />
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
                                <p className="text-xs text-muted-foreground/60">We'll let you know when something happens.</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {notifications.map((notification) => {
                                    const styles = getTypeStyles(notification.type);
                                    const Icon = styles.icon;
                                    return (
                                        <div
                                            key={notification.notification_id}
                                            onClick={() => !notification.is_read && handleMarkAsRead(notification.notification_id)}
                                            className={`group relative flex gap-3 rounded-xl p-3 transition-all duration-200 cursor-pointer ${notification.is_read ? 'hover:bg-accent/50' : 'bg-primary/[0.03] hover:bg-primary/[0.05]'
                                                }`}
                                        >
                                            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.bg}`}>
                                                <Icon className={`h-4 w-4 ${styles.color}`} />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-sm font-bold leading-none ${notification.is_read ? 'text-foreground/80' : 'text-foreground'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.is_read && (
                                                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-1.5 pt-1">
                                                    <Clock className="h-3 w-3 text-muted-foreground/50" />
                                                    <span className="text-[10px] text-muted-foreground/70">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="mt-2 border-t border-border/50 pt-2 px-1">
                        <button className="w-full rounded-lg py-2 text-center text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
