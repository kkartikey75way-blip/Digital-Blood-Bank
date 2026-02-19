import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Droplets, Clock, Heart, ArrowUpRight, CheckCircle2, Activity } from "lucide-react";
import type { IBloodRequest } from "../../../types/request.types";

interface NearbyRequestsListProps {
    requests: IBloodRequest[];
    isLoading: boolean;
    currentUserId: string | undefined;
    isAccepting: boolean;
    isCompleting: boolean;
    onAccept: (id: string) => void;
    onComplete: (id: string) => void;
}

const NearbyRequestsList = ({
    requests,
    isLoading,
    currentUserId,
    isAccepting,
    isCompleting,
    onAccept,
    onComplete
}: NearbyRequestsListProps) => {
    return (
        <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[3rem] p-10 border-2 border-slate-50 shadow-sm relative overflow-hidden transition-all hover:shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Emergency Signals</h3>
                        <p className="text-slate-400 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">Regional Proximity Scan x Active Broadcasts</p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Monitoring Active</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {requests.length > 0 ? requests.map((req, index) => (
                                <motion.div
                                    key={req._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 8 }}
                                    className="p-8 rounded-[2.5rem] bg-slate-50 border-2 border-transparent hover:border-slate-100 hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between group cursor-pointer gap-6"
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-20 h-20 rounded-3xl bg-white border-2 border-slate-100 flex flex-col items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                            <span className="text-[9px] font-black text-slate-400 tracking-widest">SPECIMEN</span>
                                            <span className="text-3xl font-black text-red-600 tracking-tighter">{req.bloodGroup}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Emergency Signal detected</h4>
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100"><Droplets className="w-3 h-3 text-red-600" /> {req.urgencyLevel} Priority</span>
                                                <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100"><Clock className="w-3 h-3 text-slate-400" /> {new Date(req.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-auto">
                                        {req.status === 'PENDING' ? (
                                            <button
                                                onClick={() => onAccept(req._id)}
                                                disabled={isAccepting}
                                                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-slate-900 text-white hover:bg-red-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                {isAccepting ? 'Processing...' : (
                                                    <>
                                                        Initialize Mission <ArrowUpRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        ) : req.status === 'APPROVED' && req.processedBy === currentUserId ? (
                                            <button
                                                onClick={() => onComplete(req._id)}
                                                disabled={isCompleting}
                                                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-emerald-600 text-white hover:bg-slate-900 transition-all shadow-xl shadow-emerald-100 active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                {isCompleting ? 'Validating...' : (
                                                    <>
                                                        Complete Mission <CheckCircle2 className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <div className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-slate-100 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest text-center">
                                                {req.status === 'COMPLETED' ? 'Signal offline' : 'Active Authorization'}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                    <Activity className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Awaiting Regional Stimulus...</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Donation Info Card */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="p-12 rounded-[3rem] bg-indigo-600 text-white shadow-2xl overflow-hidden relative group"
            >
                <div className="relative z-10">
                    <h4 className="font-black text-3xl mb-4 tracking-tight">Prime Readiness Protocol</h4>
                    <p className="text-indigo-100/70 mb-10 max-w-xl font-bold leading-relaxed lowercase">
                        ensure peak operational capacity before initializing a donor-link. your biological contribution is a high-yield humanitarian asset.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="px-6 py-3 bg-white/10 rounded-2xl backdrop-blur-xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/20 transition-colors">
                            Hydration Logic
                        </div>
                        <div className="px-6 py-3 bg-white/10 rounded-2xl backdrop-blur-xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/20 transition-colors">
                            Metabolic Yield
                        </div>
                    </div>
                </div>
                <Heart className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 group-hover:opacity-10 transition-opacity fill-current text-white -rotate-12 duration-1000" />
            </motion.div>
        </div>
    );
};

export default NearbyRequestsList;
