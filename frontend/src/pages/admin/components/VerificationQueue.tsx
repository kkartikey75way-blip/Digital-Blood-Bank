import { ShieldCheck, Loader2, CheckCircle2, XCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { IUser } from "../../../types/user.types";

interface VerificationQueueProps {
    pendingHospitals: IUser[];
    isLoading: boolean;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const VerificationQueue = ({ pendingHospitals, isLoading, onApprove, onReject }: VerificationQueueProps) => {
    return (
        <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-sm overflow-hidden transition-all hover:shadow-xl">
            <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-sm">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Verification Command</h3>
                    <p className="text-slate-500 text-xs font-black uppercase mt-1 tracking-widest">Awaiting Identity Confirmation</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find Hospital..."
                            className="pl-11 pr-6 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-red-500/20 focus:bg-white outline-none font-bold text-xs transition-all w-64"
                        />
                    </div>
                    <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-black text-[10px] uppercase tracking-widest">{pendingHospitals.length} Action Items</span>
                    </div>
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
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 border-b border-slate-50 uppercase tracking-[0.2em]">Institutional Identity</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 border-b border-slate-50 uppercase tracking-[0.2em]">Reg / License</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 border-b border-slate-50 uppercase tracking-[0.2em]">Deployment Status</th>
                                <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 border-b border-slate-50 uppercase tracking-[0.2em]">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {pendingHospitals.length > 0 ? pendingHospitals.map((hospital, index) => (
                                    <motion.tr
                                        key={hospital._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="hover:bg-slate-50/80 transition-all group"
                                    >
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-lg text-slate-400 group-hover:bg-red-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                                                    {hospital.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="text-base font-black text-slate-900 block group-hover:text-red-600 transition-colors uppercase tracking-tight">{hospital.name}</span>
                                                    <span className="text-xs font-bold text-slate-400 lowercase">{hospital.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="px-4 py-2 rounded-xl bg-slate-100/50 border-2 border-transparent group-hover:border-slate-100 transition-all w-fit">
                                                <span className="text-xs font-black text-slate-600 font-mono tracking-widest uppercase">{hospital.licenseNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Pre-Auth Scope</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                <button
                                                    onClick={() => onApprove(hospital._id)}
                                                    className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-emerald-200 active:scale-90"
                                                    title="Authorize Identity"
                                                >
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </button>
                                                <button
                                                    onClick={() => onReject(hospital._id)}
                                                    className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-rose-200 active:scale-90"
                                                    title="Decline Access"
                                                >
                                                    <XCircle className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td colSpan={5} className="px-10 py-32 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                                    <ShieldCheck className="w-12 h-12 text-slate-200" />
                                                </div>
                                                <h4 className="text-lg font-black text-slate-900 mb-1 tracking-tight">Horizon is Secure</h4>
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Strategic clearance complete. Zero pending threats.</p>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VerificationQueue;
