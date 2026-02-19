import { motion } from "framer-motion";
import { Activity, Heart, Hospital, ArrowRight } from "lucide-react";

interface DashboardStatsProps {
    activeCount: number;
    completedCount: number;
    isLoading: boolean;
}

const DashboardStats = ({ activeCount, completedCount, isLoading }: DashboardStatsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group"
            >
                <div className="relative z-10">
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Active Broadcasts</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-6xl font-black mb-1">{isLoading ? "..." : activeCount}</h3>
                        <span className="text-red-500 font-bold text-xs animate-pulse">Live</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 mt-6 flex items-center gap-2 group-hover:text-white transition-colors">
                        <Activity className="w-4 h-4 text-red-500" /> Real-time monitoring
                    </p>
                </div>
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-red-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-10 rounded-[3rem] bg-white border-2 border-slate-50 shadow-sm relative overflow-hidden group hover:border-red-100 transition-all active:scale-95"
            >
                <div className="relative z-10">
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Lives Impacted</p>
                    <h3 className="text-6xl font-black text-slate-900 mb-1">{isLoading ? "..." : completedCount}</h3>
                    <p className="text-sm font-bold text-slate-400 mt-6 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" /> Strategic Success
                    </p>
                </div>
                <div className="absolute top-10 right-10 opacity-5 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
                    <Heart className="w-20 h-20 text-red-600" />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-10 rounded-[3rem] bg-gradient-to-br from-red-600 to-red-800 text-white flex flex-col justify-between group cursor-pointer hover:shadow-2xl hover:shadow-red-200 transition-all active:scale-95 overflow-hidden relative"
            >
                <div className="relative z-10">
                    <Hospital className="w-12 h-12 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                    <h4 className="text-2xl font-black leading-tight tracking-tight">Facility<br />Locator</h4>
                    <p className="text-red-100/70 text-[10px] font-black uppercase tracking-widest mt-4">Browse Approved Banks</p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest relative z-10">
                    Scan Area <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
                {/* Decorative BG */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            </motion.div>
        </div>
    );
};


export default DashboardStats;
