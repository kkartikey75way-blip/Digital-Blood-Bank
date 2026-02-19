import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Heart,
    ChevronRight,
    LogOut,
    X,
    User as UserIcon,
    type LucideIcon
} from "lucide-react";
import type { UserRole } from "../../types/auth.types";

interface SidebarProps {
    role: UserRole | null;
    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    handleLogout: () => void;
    navItems: Record<UserRole, { label: string; path: string; icon: LucideIcon }[]>;
}

const Sidebar = ({ role, isSidebarOpen, setSidebarOpen, handleLogout, navItems }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentNav = role ? navItems[role] : [];

    return (
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
    );
};

export default Sidebar;
