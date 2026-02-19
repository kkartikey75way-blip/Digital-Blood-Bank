import { Activity, AlertCircle, Hospital } from "lucide-react";

interface DashboardStatsProps {
    activeCount: number;
    completedCount: number;
    isLoading: boolean;
}

const DashboardStats = ({ activeCount, completedCount, isLoading }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-xl shadow-slate-200">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Active Requests</p>
                <h3 className="text-4xl font-black mb-1">{isLoading ? "..." : activeCount}</h3>
                <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500" /> Monitoring
                </p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Fulfilled</p>
                <h3 className="text-4xl font-black text-slate-900 mb-1">{isLoading ? "..." : completedCount}</h3>
                <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-green-500" /> Lifetime
                </p>
            </div>

            <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-red-50 border border-red-100 flex items-center justify-between group cursor-pointer hover:bg-red-100 transition-colors">
                <div>
                    <h4 className="text-xl font-bold text-red-900">Find Nearby Hospitals</h4>
                    <p className="text-red-700/70 text-sm mt-1">View facilities with available blood stocks in your area.</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Hospital className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
