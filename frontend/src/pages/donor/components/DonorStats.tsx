import { motion } from "framer-motion";
import { Heart, Award, Zap, Trophy } from "lucide-react";

interface DonorStatsProps {
    historyLength: number;
    impactPoints: number;
    rank: string;
    isLoading: boolean;
}

const DonorStats = ({ historyLength, impactPoints, rank, isLoading }: DonorStatsProps) => {
    const nextLevelPoints = impactPoints > 150 ? 500 : impactPoints > 50 ? 150 : 50;
    const progress = (impactPoints / nextLevelPoints) * 100;

    const stats = [
        { label: "Total Donations", value: historyLength.toString(), icon: Heart, color: "text-red-600", bg: "bg-red-50" },
        { label: "Lives Saved", value: (historyLength * 3).toString(), icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Impact Points", value: impactPoints.toString(), icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-5xl font-black text-slate-900 mb-1">{isLoading ? "..." : stat.value}</h3>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Rank Progress Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl"
            >
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-[2rem] bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                <Trophy className="w-10 h-10 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-amber-500 font-black text-xs uppercase tracking-[0.3em] mb-2">Current Distinction</p>
                                <h4 className="text-4xl font-black">{rank} Level</h4>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-1">To Next Milestone</p>
                            <p className="text-2xl font-black text-white">{nextLevelPoints - impactPoints} <span className="text-slate-500 text-sm">Points</span></p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>{impactPoints} Earned</span>
                            <span>{nextLevelPoints} Goal</span>
                        </div>
                    </div>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full -mr-32 -mt-32" />
            </motion.div>
        </div>
    );
};


export default DonorStats;
