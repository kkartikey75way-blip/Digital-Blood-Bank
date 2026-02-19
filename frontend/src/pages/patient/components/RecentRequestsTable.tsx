import { Search, Loader2, ArrowUpRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { IBloodRequest } from "../../../types/request.types";

interface RecentRequestsTableProps {
    requests: IBloodRequest[];
    isLoading: boolean;
    onViewRequest: (request: IBloodRequest) => void;
}

const RecentRequestsTable = ({ requests, isLoading, onViewRequest }: RecentRequestsTableProps) => {
    return (
        <div className="lg:col-span-2 bg-white rounded-[3rem] border-2 border-slate-50 shadow-sm overflow-hidden transition-all hover:shadow-xl">
            <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-sm">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Request Log</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase mt-1 tracking-[0.2em]">Operational History & Alerts</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scan Archives..."
                        className="bg-slate-50 border-2 border-transparent focus:border-red-500/20 focus:bg-white rounded-2xl pl-11 pr-6 py-3 text-xs font-bold outline-none transition-all w-64"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 border-b border-slate-50 uppercase tracking-[0.2em]">Diagnostic</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 border-b border-slate-50 uppercase tracking-[0.2em]">Priority</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 border-b border-slate-50 uppercase tracking-[0.2em]">Condition</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 border-b border-slate-50 uppercase tracking-[0.2em]">Timestamp</th>
                                <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 border-b border-slate-50 uppercase tracking-[0.2em]">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {requests.length > 0 ? requests.map((req, index) => (
                                    <motion.tr
                                        key={req._id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-50/80 transition-all group"
                                    >
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                                                    {req.bloodGroup}
                                                </div>
                                                <span className="text-sm font-black text-slate-700 uppercase tracking-tight">Blood Requirement</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${req.urgencyLevel === "HIGH" ? "bg-red-50 text-red-600 border-red-100" :
                                                req.urgencyLevel === "MEDIUM" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                    "bg-blue-50 text-blue-600 border-blue-100"
                                                }`}>
                                                {req.urgencyLevel}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${req.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                                                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{req.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-900">{new Date(req.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Request Date</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => onViewRequest(req)}
                                                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                                            >
                                                <ArrowUpRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                                    <Activity className="w-10 h-10 text-slate-200" />
                                                </div>
                                                <h4 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-widest">Awaiting Events</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Strategy is calm. No active emergency detected.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecentRequestsTable;
