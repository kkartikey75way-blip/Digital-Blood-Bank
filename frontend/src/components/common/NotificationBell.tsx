import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation
} from "../../services/notificationApi";
import { formatDistanceToNow } from "date-fns";

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: notificationData } = useGetNotificationsQuery();
    const [markAsRead] = useMarkAsReadMutation();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const notifications = notificationData?.data || [];
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 relative transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-600 text-white text-[10px] flex items-center justify-center font-bold rounded-full border-2 border-white ring-1 ring-red-600/50 animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden z-50"
                    >
                        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsRead()}
                                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors relative group ${!notification.isRead ? 'bg-red-50/30' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.isRead ? 'bg-red-500' : 'bg-slate-200'}`} />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <p className={`text-sm font-bold ${!notification.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notification._id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-green-600 hover:border-green-100 transition-all"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-medium">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
