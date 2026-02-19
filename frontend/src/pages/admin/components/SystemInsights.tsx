import { motion } from "framer-motion";
import { Users, Hospital, Activity, ShieldCheck } from "lucide-react";

interface SystemInsightsProps {
    stats?: {
        totalDonations: string | number;
        pendingRequests: string | number;
        approvedRequests: string | number;
    };
    pendingHospitalCount?: number;
    isLoading: boolean;
}

const SystemInsights = ({ stats, pendingHospitalCount, isLoading }: SystemInsightsProps) => {
    const statsList = [
        { label: "Total Donations", value: stats?.totalDonations || "0", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
        { label: "Pending Hospitals", value: pendingHospitalCount || "0", icon: Hospital, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Pending Requests", value: stats?.pendingRequests || "0", icon: Activity, color: "text-red-600", bg: "bg-red-50" },
        { label: "Approved Requests", value: stats?.approvedRequests || "0", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsList.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
                    >
                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-1">{isLoading ? "..." : stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                        </div>
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-5 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-full h-full" />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default SystemInsights;
