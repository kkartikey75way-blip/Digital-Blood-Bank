import { motion } from "framer-motion";
import { Users, Hospital, Activity, ShieldCheck, ArrowUpRight } from "lucide-react";

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
        { label: "Total Donations", value: stats?.totalDonations || "0", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12%" },
        { label: "Pending Hospitals", value: pendingHospitalCount || "0", icon: Hospital, color: "text-amber-600", bg: "bg-amber-50", trend: "Review Required" },
        { label: "Pending Requests", value: stats?.pendingRequests || "0", icon: Activity, color: "text-rose-600", bg: "bg-rose-50", trend: "High Priority" },
        { label: "Active Contributors", value: stats?.approvedRequests || "0", icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "Growing" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsList.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-8 rounded-[3rem] bg-white border-2 border-slate-50 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative active:scale-95"
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:rotate-12`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                                    {stat.trend}
                                </div>
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-2">{isLoading ? "..." : stat.value}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-4">{stat.label}</p>

                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                View Details <ArrowUpRight className="w-3 h-3" />
                            </div>
                        </div>

                        {/* Decorative Gradient Background */}
                        <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${stat.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </motion.div>
                );
            })}
        </div>
    );
};

export default SystemInsights;
