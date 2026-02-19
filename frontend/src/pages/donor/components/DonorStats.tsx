import { motion } from "framer-motion";
import { Heart, Award, CheckCircle2 } from "lucide-react";

interface DonorStatsProps {
    historyLength: number;
    isLoading: boolean;
}

const DonorStats = ({ historyLength, isLoading }: DonorStatsProps) => {
    const stats = [
        { label: "Total Donations", value: historyLength.toString(), icon: Heart, color: "text-red-600", bg: "bg-red-50" },
        { label: "Lives Saved", value: (historyLength * 3).toString(), icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Active Points", value: (historyLength * 50).toString(), icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-4xl font-extrabold text-slate-900 mb-1">{isLoading ? "..." : stat.value}</h3>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default DonorStats;
