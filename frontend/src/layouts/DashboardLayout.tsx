import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    LayoutDashboard,
    PlusCircle,
    Search,
    Hospital,
    Users,
    LogOut,
    Menu,
    X,
    User as UserIcon,
    ChevronRight,
    Droplets,
    type LucideIcon
} from "lucide-react";
import { useState } from "react";
import { getUserRole, clearAuthStorage } from "../utils/auth";
import type { UserRole } from "../types/auth.types";
import NotificationBell from "../components/common/NotificationBell";

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = getUserRole();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = (): void => {
        clearAuthStorage();
        toast.success("Logged out successfully");
        navigate("/");
    };

    const navItems: Record<UserRole, { label: string; path: string; icon: LucideIcon }[]> = {
        PATIENT: [
            { label: "Dashboard", path: "/patient", icon: LayoutDashboard },
            { label: "Create Emergency", path: "/patient/create", icon: PlusCircle },
        ],
        DONOR: [
            { label: "Dashboard", path: "/donor", icon: LayoutDashboard },
            { label: "Nearby Requests", path: "/donor/nearby", icon: Search },
        ],
        HOSPITAL: [
            { label: "Manage Stock", path: "/hospital", icon: Hospital },
            { label: "Blood Requests", path: "/hospital/requests", icon: Droplets },
            { label: "Nearby Donors", path: "/hospital/nearby-donors", icon: Search },
        ],
        ADMIN: [
            { label: "Admin Panel", path: "/admin", icon: Users },
            { label: "Reports", path: "/admin/reports", icon: LayoutDashboard },
        ],
    };

    const currentNav = role ? navItems[role] : [];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar Mobile Overlay */}
            <AnimatePresence>
                {!isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(true)}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transition-all duration-300 transform
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:relative lg:translate-x-0
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-8 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20 group-hover:scale-110 transition-transform">
                                <Heart className="w-6 h-6 text-white fill-current" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Blood<span className="text-red-500">Bank</span>
                            </span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-lg hover:bg-white/10 lg:hidden transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
                        {currentNav.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`
                                        w-full flex items-center justify-between px-4 py-3.5 rounded-2xl group transition-all duration-200
                                        ${isActive
                                            ? "bg-red-600 text-white shadow-lg shadow-red-900/40 font-bold"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <Icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-red-500 transition-colors"}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    {isActive && <motion.div layoutId="activeInd" className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    {!isActive && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-white/5">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
                            <p className="text-xs text-slate-500 font-medium mb-1">Signed in as</p>
                            <p className="text-sm font-bold text-white flex items-center gap-2 capitalize">
                                <UserIcon className="w-4 h-4 text-red-500" />
                                {role?.toLowerCase()}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-red-600/10 hover:text-red-500 transition-all duration-200 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200/60 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
                            Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="h-10 w-px bg-slate-200 mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900">User Profile</p>
                                <p className="text-xs text-slate-500">{role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shadow-sm">
                                <UserIcon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content with Smooth Transition */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
