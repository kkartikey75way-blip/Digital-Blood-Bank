import { Loader2, Award, Activity, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { IDonation } from "../../../types/donation.types";

interface ImpactHistoryProps {
    history: IDonation[];
    isLoading: boolean;
}

const ImpactHistory = ({ history, isLoading }: ImpactHistoryProps) => {
    return (
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden h-fit shadow-2xl transition-all hover:shadow-indigo-500/10">
            <div className="absolute top-0 right-0 p-10 opacity-10">
                <History className="w-24 h-24 rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-12">
                    <h3 className="text-2xl font-black tracking-tight uppercase">Impact Feed</h3>
                    <p className="text-slate-400 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">Historical Contribution Tracking x Life Vectors</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-10 flex-1">
                        <AnimatePresence mode="popLayout">
                            {history.length > 0 ? history.map((item, i) => {
                                const request = typeof item.request === 'object' ? item.request : null;
                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-6 relative group"
                                    >
                                        {i < history.length - 1 && <div className="absolute left-[23px] top-12 bottom-[-40px] w-0.5 bg-slate-800" />}
                                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center z-10 group-hover:border-red-600 transition-colors shadow-lg">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-600 group-hover:scale-125 transition-transform" />
                                        </div>
                                        <div className="pt-1">
                                            <p className="text-sm font-black tracking-tight uppercase text-slate-100 group-hover:text-white transition-colors">Donation Event Detected</p>
                                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">Specimen: {request?.bloodGroup || 'N/A'}</p>
                                            <p className="text-[9px] font-black text-slate-500 mt-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Activity className="w-3 h-3" /> Timestamp: {new Date(item.donatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            }) : (
                                <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem]">
                                    <Activity className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Awaiting Impact Data...</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 bg-white/5 rounded-[2rem] p-8 border-2 border-white/5 hover:border-white/10 transition-all group"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:rotate-12 transition-transform">
                            <Award className="w-6 h-6 text-slate-900" />
                        </div>
                        <div>
                            <span className="font-black text-[10px] tracking-[0.3em] uppercase text-slate-400">Institutional Rank</span>
                            <h4 className="text-lg font-black tracking-tight text-white italic">
                                {history.length > 5 ? 'Master Life Saver' : history.length > 0 ? 'Rising Hero' : 'New Joiner'}
                            </h4>
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((history.length / 10) * 100, 100)}%` }}
                            className="h-full bg-amber-500"
                        />
                    </div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-4">Growth Index x Mission Compliance</p>
                </motion.div>
            </div>
        </div>
    );
};

export default ImpactHistory;
