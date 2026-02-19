import { Menu, User as UserIcon } from "lucide-react";
import NotificationBell from "../common/NotificationBell";
import type { UserRole } from "../../types/auth.types";

interface HeaderProps {
    role: UserRole | null;
    setSidebarOpen: (open: boolean) => void;
}

const Header = ({ role, setSidebarOpen }: HeaderProps) => {
    return (
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
    );
};

export default Header;
