import { Activity, ShieldAlert, Phone } from "lucide-react";
import { motion } from "framer-motion";
import StatusTimeline from "../../../components/common/StatusTimeline";
import type { IBloodRequest } from "../../../types/request.types";

interface TrackingCardProps {
    activeRequest?: IBloodRequest;
}

const TrackingCard = ({ activeRequest }: TrackingCardProps) => {
    return (
        <div className="space-y-8">
            {activeRequest && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] p-10 border-2 border-slate-50 shadow-sm relative overflow-hidden group"
                >
                    <div className="relative z-10">
                        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <Activity className="w-6 h-6 text-red-600 animate-pulse" /> Live Status
                        </h4>
                        <StatusTimeline status={activeRequest.status} />

                        <div className="mt-10 pt-8 border-t border-slate-50">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Subject Broadcast</p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h5 className="text-2xl font-black text-slate-900 leading-none">{activeRequest.bloodGroup} Group</h5>
                                    <p className="text-xs font-bold text-slate-500 mt-1">{activeRequest.units} Strategy Units Required</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                        Priority {activeRequest.urgencyLevel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                        <h4 className="text-xl font-black tracking-tight">Emergency Protocol</h4>
                    </div>
                    <div className="space-y-6">
                        {[
                            { step: "01", title: "Geo-Locking", text: "Global Positioning System must remain active." },
                            { step: "02", title: "Comm-Link", text: "Maintain active status on registered terminal." },
                            { step: "03", title: "Auth Logic", text: "Admin verifies and triggers regional broadcast." },
                        ].map((item) => (
                            <div key={item.step} className="flex gap-4 group/item cursor-default">
                                <span className="text-xs font-black text-slate-700 group-hover/item:text-red-500 transition-colors">{item.step}</span>
                                <div>
                                    <h5 className="font-black text-sm uppercase tracking-widest">{item.title}</h5>
                                    <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase">Network Status</span>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Optimal</span>
                        </div>
                    </div>
                </div>
                {/* Decorative BG */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-10 rounded-[3rem] bg-white border-2 border-slate-50 shadow-sm relative group hover:border-slate-100 transition-all active:scale-[0.98]"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Phone className="w-6 h-6 font-bold" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none">Support Hub</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">24/7 Response Node</p>
                    </div>
                </div>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                    Experiencing synchronization issues? Connect with our response team for immediate manual intervention.
                </p>
                <button className="w-full mt-8 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
                    Trigger Support call
                </button>
            </motion.div>
        </div>
    );
};

export default TrackingCard;
