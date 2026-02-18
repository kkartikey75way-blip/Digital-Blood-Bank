import { Outlet, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserRole, clearAuthStorage } from "../utils/auth";
import type { UserRole } from "../types/auth.types";

const DashboardLayout = () => {
    const navigate = useNavigate();
    const role = getUserRole();

    const handleLogout = (): void => {
        clearAuthStorage();
        toast.success("Logged out successfully");
        navigate("/");
    };

    const navItems: Record<UserRole, { label: string; path: string }[]> = {
        PATIENT: [
            { label: "Dashboard", path: "/patient" },
            { label: "Create Emergency", path: "/patient/create" },
        ],
        DONOR: [
            { label: "Dashboard", path: "/donor" },
            { label: "Nearby Requests", path: "/donor/nearby" },
        ],
        HOSPITAL: [
            { label: "Manage Stock", path: "/hospital" },
        ],
        ADMIN: [
            { label: "Admin Panel", path: "/admin" },
        ],
    };

    const currentNav = role ? navItems[role] : [];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg">
                <Link to="/" className="p-8 text-2xl font-extrabold text-red-600 tracking-tight block">
                    Blood Bank
                </Link>

                <nav className="space-y-1 px-4">
                    {currentNav.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="w-full rounded-lg px-4 py-3 text-left font-medium transition duration-200 hover:bg-red-50 hover:text-red-600"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <header className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800 capitalize">
                        {role?.toLowerCase()} Portal
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white transition duration-200 hover:bg-red-700 shadow-sm active:scale-95"
                    >
                        Logout
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="mx-auto max-w-6xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
