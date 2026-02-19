import { motion, AnimatePresence } from "framer-motion";
import {
    Droplets,
    TrendingUp,
    Activity,
    Plus,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    Clock,
    ArrowUpRight,
    Megaphone,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStockSchema, type UpdateStockSchemaType } from "../../schemas/hospital.schema";
import type { IBloodRequest } from "../../types/request.types";
import { useGetStockQuery, useUpdateStockMutation } from "../../services/hospitalApi";
import { useGetHospitalAnalyticsQuery } from "../../services/analyticsApi";
import { useState } from "react";
import toast from "react-hot-toast";
import CreateRequestModal from "./components/CreateRequestModal";

const HospitalDashboard = () => {
    const { data: stockData, isLoading: isStockLoading } = useGetStockQuery();
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetHospitalAnalyticsQuery();
    const [updateStock, { isLoading: isUpdating }] = useUpdateStockMutation();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateStockSchemaType>({
        resolver: zodResolver(updateStockSchema),
    });

    const onSubmitStock = async (data: UpdateStockSchemaType) => {
        try {
            await updateStock(data).unwrap();
            toast.success("Stock updated successfully");
            setIsUpdateModalOpen(false);
            reset();
        } catch (error: unknown) {
            const fetchError = error as { data?: { message?: string } };
            toast.error(fetchError?.data?.message || "Failed to update stock");
        }
    };

    const isVerified = stockData?.data?.isVerified;
    const bloodStockData = stockData?.data?.bloodStock;
    const bloodStock = bloodStockData ? (Object.keys(bloodStockData) as Array<keyof typeof bloodStockData>).map(key => ({
        bloodGroup: key.replace("_POS", "+").replace("_NEG", "-"),
        units: bloodStockData[key]
    })) : [];

    const totalUnits = bloodStock.reduce((acc, item) => acc + item.units, 0);
    const recentActivity = analyticsData?.data?.recentActivity || [];

    const getStatus = (units: number) => {
        if (units <= 2) return "Critical";
        if (units <= 5) return "Low";
        return "Normal";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Activity className="w-8 h-8 text-red-600" /> Hospital Hub
                    </h2>
                    <p className="text-slate-500 mt-2 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                        System Authority: {isVerified ? 'Authorized' : 'Pending Verification'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            if (!isVerified) {
                                toast.error("Verification pending. Operation restricted.");
                                return;
                            }
                            setIsUpdateModalOpen(true);
                        }}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest hover:border-slate-200 transition-all active:scale-95 ${!isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Plus className="w-5 h-5" />
                        Sync Inventory
                    </button>
                    <button
                        onClick={() => {
                            if (!isVerified) {
                                toast.error("Verification pending. Unauthorized broadcast.");
                                return;
                            }
                            setIsRequestModalOpen(true);
                        }}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-red-200 active:scale-95 ${!isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Megaphone className="w-5 h-5" />
                        Init Broadcast
                    </button>
                </div>
            </div>

            {/* Verification Alert */}
            {!isVerified && !isStockLoading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 rounded-[3rem] bg-amber-50 border-2 border-amber-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:shadow-xl transition-all"
                >
                    <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shrink-0 shadow-lg border border-amber-100 group-hover:rotate-6 transition-transform">
                        <AlertTriangle className="w-10 h-10 text-amber-600" />
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                        <h4 className="text-amber-900 font-black text-2xl tracking-tight">Identity Authentication Required</h4>
                        <p className="text-amber-700/80 text-sm mt-2 max-w-3xl font-bold leading-relaxed lowercase">
                            operational credentials are currently being processed by the system core. full dashboard capabilities will be provisioned upon successful verification.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 p-4">
                        <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                    </div>
                </motion.div>
            )}

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-2 p-12 rounded-[3rem] bg-slate-900 text-white flex items-center justify-between relative overflow-hidden shadow-2xl group"
                >
                    <div className="relative z-10">
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Network Connectivity Status: Active</p>
                        <h3 className="text-7xl font-black mb-2 flex items-baseline gap-4">
                            {isStockLoading ? "..." : totalUnits} <span className="text-xl font-bold text-red-500 tracking-widest uppercase">Target Yield</span>
                        </h3>
                        <div className="flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-widest mt-8 bg-white/5 py-3 px-6 rounded-2xl w-fit group-hover:bg-white/10 transition-colors">
                            <Activity className="w-4 h-4 animate-pulse" />
                            Live Stock Sync Enabled
                        </div>
                    </div>
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Droplets className="w-48 h-48 text-red-600 fill-current" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-10 rounded-[3rem] bg-white border-2 border-slate-50 shadow-sm hover:shadow-2xl transition-all group"
                >
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6 tracking-widest">Variation Index</p>
                    <h3 className="text-5xl font-black text-slate-900 mb-2">{bloodStock.length}</h3>
                    <p className="text-xs font-black text-slate-400 mt-6 flex items-center gap-2 uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Active Blood Types
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-10 rounded-[3rem] bg-white border-2 border-slate-50 shadow-sm hover:shadow-2xl transition-all group"
                >
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6 tracking-widest">Throughput</p>
                    <h3 className="text-5xl font-black text-slate-900 mb-2">{recentActivity.length}</h3>
                    <p className="text-xs font-black text-slate-400 mt-6 flex items-center gap-2 uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Logic Operations
                    </p>
                </motion.div>
            </div>

            {/* Main Area: Inventory & Activity */}
            <div className="grid lg:grid-cols-5 gap-10">
                {/* Inventory Grid */}
                <div className="lg:col-span-3 bg-white rounded-[3rem] p-12 border-2 border-slate-50 shadow-sm relative overflow-hidden h-fit transition-all hover:shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Inventory Matrix</h3>
                            <p className="text-slate-400 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">Operational Analysis x Stock Distribution</p>
                        </div>
                        <div className="flex gap-2">
                            {['Critical', 'Low', 'Normal'].map((label) => (
                                <div key={label} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className={`w-2 h-2 rounded-full ${label === 'Critical' ? 'bg-red-500 animate-pulse' : label === 'Low' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isStockLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {bloodStock.map((item, index) => {
                                    const status = getStatus(item.units);
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            className={`p-8 rounded-[2.5rem] border-2 transition-all duration-300 relative group cursor-default ${status === "Critical" ? "bg-red-50 border-red-200 shadow-2xl shadow-red-100" :
                                                status === "Low" ? "bg-amber-50 border-amber-200" : "bg-slate-50/50 border-slate-100"
                                                }`}
                                        >
                                            <span className={`text-2xl font-black block mb-6 tracking-tighter ${status === "Critical" ? "text-red-700" :
                                                status === "Low" ? "text-amber-700" : "text-slate-800"
                                                }`}>{item.bloodGroup}</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-slate-900 group-hover:scale-110 transition-transform origin-left block">{item.units}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Units</span>
                                            </div>
                                            {status === "Critical" && <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-red-600 animate-ping" />}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Recent Activity Log */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 border-2 border-slate-50 shadow-sm relative overflow-hidden transition-all hover:shadow-xl">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Signal Feed</h3>
                            <button className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:text-slate-900 transition-colors">Historical Logs</button>
                        </div>

                        <div className="space-y-8">
                            {isAnalyticsLoading ? (
                                <div className="flex py-10 justify-center"><Loader2 className="animate-spin w-6 h-6 text-red-600" /></div>
                            ) : recentActivity.length > 0 ? recentActivity.map((log: IBloodRequest, i: number) => (
                                <div key={log._id} className="flex gap-6 group">
                                    <div className="relative flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all border-2 group-hover:scale-110 ${log.status === 'APPROVED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            log.status === 'REJECTED' ? 'bg-slate-50 text-slate-400 border-slate-100' :
                                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        {i < recentActivity.length - 1 && <div className="w-0.5 h-full bg-slate-100 mt-2" />}
                                    </div>
                                    <div className="pb-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-base font-black text-slate-900 tracking-tight">{log.bloodGroup} Signals</span>
                                            <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${log.status === 'APPROVED' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                                                }`}>{log.status}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-bold leading-relaxed lowercase">
                                            {log.units} units of critical biomass processed for network fulfillment.
                                        </p>
                                        <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <Clock className="w-3 h-3" />
                                            {new Date(log.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-24 text-center">
                                    <Activity className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Awaiting Signal Synchronization...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-10 rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden group cursor-pointer shadow-2xl shadow-indigo-100 transition-all"
                    >
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black tracking-tight mb-2">Diagnostic Analytics</h4>
                            <p className="text-indigo-100/70 text-xs mb-8 font-bold leading-relaxed lowercase">deep-scan institutional performance metrics and regional impact vectors.</p>
                            <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-2">
                                ACCESS NODE <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <TrendingUp className="absolute -bottom-10 -right-10 w-48 h-48 text-indigo-500 opacity-20 -rotate-12 transition-transform group-hover:scale-125 group-hover:rotate-0 duration-700" />
                    </motion.div>
                </div>
            </div>

            {/* Update Stock Modal */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-[3rem] p-12 w-full max-w-lg shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />

                        <div className="relative z-10">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Sync Inventory</h3>
                            <p className="text-slate-500 text-xs mt-3 mb-10 font-bold uppercase tracking-widest">Update regional availability vectors.</p>

                            <form onSubmit={handleSubmit(onSubmitStock)} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Select Blood Specimen</label>
                                    <select
                                        {...register("bloodGroup")}
                                        className={`w-full rounded-2xl border-2 p-5 outline-none transition-all focus:ring-8 focus:ring-red-500/5 font-black text-sm ${errors.bloodGroup ? "border-red-500" : "border-slate-50 focus:border-red-600 focus:bg-white bg-slate-50/50"}`}
                                    >
                                        <option value="">Matrix Selection...</option>
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                    {errors.bloodGroup && <p className="text-[10px] text-red-500 font-black ml-2 uppercase">{errors.bloodGroup.message}</p>}
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Operational Units</label>
                                    <input
                                        type="number"
                                        placeholder="00"
                                        {...register("units", { valueAsNumber: true })}
                                        className={`w-full rounded-2xl border-2 p-5 outline-none transition-all focus:ring-8 focus:ring-red-500/5 font-black text-sm ${errors.units ? "border-red-500" : "border-slate-50 focus:border-red-600 focus:bg-white bg-slate-50/50"}`}
                                    />
                                    {errors.units && <p className="text-[10px] text-red-500 font-black ml-2 uppercase">{errors.units.message}</p>}
                                </div>
                                <div className="flex gap-4 pt-10">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsUpdateModalOpen(false);
                                            reset();
                                        }}
                                        className="flex-1 px-8 py-5 rounded-2xl font-black text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all uppercase text-[10px] tracking-[0.3em]"
                                    >
                                        Abort Sync
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex-1 rounded-2xl bg-red-600 py-5 font-black text-white transition-all hover:bg-slate-900 shadow-2xl shadow-red-200 uppercase text-[10px] tracking-[0.3em] active:scale-95 disabled:opacity-50"
                                    >
                                        {isUpdating ? "Processing..." : "Commit Update"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
            {/* Create Request Modal */}
            <CreateRequestModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />
        </motion.div>
    );
};

export default HospitalDashboard;
