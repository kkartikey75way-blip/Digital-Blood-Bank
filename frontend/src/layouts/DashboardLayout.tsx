import { Outlet, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    PlusCircle,
    Search,
    Hospital,
    Search as SearchIcon,
    Droplets,
    Users,
    type LucideIcon
} from "lucide-react";
import { useState } from "react";
import { getUserRole, clearAuthStorage } from "../utils/auth";
import type { UserRole } from "../types/auth.types";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import MobileOverlay from "../components/dashboard/MobileOverlay";

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
            { label: "Nearby Donors", path: "/hospital/nearby-donors", icon: SearchIcon },
        ],
        ADMIN: [
            { label: "Admin Panel", path: "/admin", icon: Users },
            { label: "Reports", path: "/admin/reports", icon: LayoutDashboard },
        ],
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <MobileOverlay
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <Sidebar
                role={role}
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                handleLogout={handleLogout}
                navItems={navItems}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Header
                    role={role}
                    setSidebarOpen={setSidebarOpen}
                />

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
