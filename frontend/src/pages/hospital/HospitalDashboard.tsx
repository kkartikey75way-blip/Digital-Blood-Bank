import { motion } from "framer-motion";
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
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStockSchema, type UpdateStockSchemaType } from "../../schemas/hospital.schema";
import type { IBloodRequest } from "../../types/request.types";
import { useGetStockQuery, useUpdateStockMutation } from "../../services/hospitalApi";
import { useGetHospitalAnalyticsQuery } from "../../services/analyticsApi";
import { useState } from "react";
import toast from "react-hot-toast";

const HospitalDashboard = () => {
    const { data: stockData, isLoading: isStockLoading } = useGetStockQuery();
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetHospitalAnalyticsQuery();
    const [updateStock, { isLoading: isUpdating }] = useUpdateStockMutation();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Hospital Command</h2>
                    <p className="text-slate-500 mt-1 font-medium">Real-time inventory management and emergency response hub.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (!isVerified) {
                                toast.error("Verification pending. You'll be able to update stock once approved.");
                                return;
                            }
                            setIsUpdateModalOpen(true);
                        }}
                        className={`btn-primary flex items-center gap-2 shadow-xl shadow-red-200 transition-transform active:scale-95 ${!isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Plus className="w-5 h-5" />
                        Update Inventory
                    </button>
                </div>
            </div>

            {/* Verification Alert */}
            {!isVerified && !isStockLoading && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2.5rem] bg-amber-50 border-2 border-amber-100 flex items-start gap-6 relative overflow-hidden"
                >
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
                        <AlertTriangle className="w-8 h-8 text-amber-600" />
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-amber-900 font-extrabold text-lg">Verification Pending</h4>
                        <p className="text-amber-700/80 text-sm mt-1 max-w-2xl font-medium">
                            The administration is currently reviewing your medical credentials. Once verified, you will gain full access to blood request workflows and automated stock synchronization.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 p-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    </div>
                </motion.div>
            )}

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 p-10 rounded-[2.5rem] bg-slate-900 text-white flex items-center justify-between relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Live Inventory Capacity</p>
                        <h3 className="text-6xl font-black mb-1 flex items-baseline gap-3">
                            {isStockLoading ? "..." : totalUnits} <span className="text-xl font-bold text-red-500 tracking-normal">Units Total</span>
                        </h3>
                        <div className="flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-widest mt-6 bg-white/5 py-2 px-4 rounded-xl w-fit">
                            <Activity className="w-3 h-3 animate-pulse" />
                            Synchronized with Network
                        </div>
                    </div>
                    <div className="w-32 h-32 bg-red-600/10 rounded-[3rem] rotate-12 flex items-center justify-center border border-white/5">
                        <Droplets className="w-16 h-16 text-red-600 fill-current opacity-80" />
                    </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">Stock Diversity</p>
                    <h3 className="text-4xl font-black text-slate-900 mb-1">{bloodStock.length}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Managed Groups
                    </p>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">Requests Handled</p>
                    <h3 className="text-4xl font-black text-slate-900 mb-1">{recentActivity.length}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Life Transitions
                    </p>
                </div>
            </div>

            {/* Main Area: Inventory & Activity */}
            <div className="grid lg:grid-cols-5 gap-8">
                {/* Inventory Grid */}
                <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden h-fit">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 leading-none">Inventory Matrix</h3>
                            <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-tight">Unit count per blood group</p>
                        </div>
                        <div className="flex gap-2">
                            {['Critical', 'Low', 'Normal'].map((label) => (
                                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className={`w-1.5 h-1.5 rounded-full ${label === 'Critical' ? 'bg-red-500' : label === 'Low' ? 'bg-amber-500' : 'bg-green-500'}`} />
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isStockLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {bloodStock.map((item, index) => {
                                const status = getStatus(item.units);
                                return (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className={`p-6 rounded-[2rem] border-2 transition-all duration-300 relative group ${status === "Critical" ? "bg-red-50 border-red-100 shadow-red-100/50 shadow-lg" :
                                            status === "Low" ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"
                                            }`}
                                    >
                                        <span className={`text-xl font-black block mb-4 ${status === "Critical" ? "text-red-700" :
                                            status === "Low" ? "text-amber-700" : "text-slate-800"
                                            }`}>{item.bloodGroup}</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-slate-900 group-hover:scale-110 transition-transform origin-left block">{item.units}</span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Units</span>
                                        </div>
                                        {status === "Critical" && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-600 animate-ping" />}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recent Activity Log */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 h-fit">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-900">Recent Logs</h3>
                            <button className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline transition-all">View All</button>
                        </div>

                        <div className="space-y-6">
                            {isAnalyticsLoading ? (
                                <div className="flex py-10 justify-center"><Loader2 className="animate-spin w-5 h-5 text-slate-400" /></div>
                            ) : recentActivity.length > 0 ? recentActivity.map((log: IBloodRequest, i: number) => (
                                <div key={log._id} className="flex gap-4 group">
                                    <div className="relative flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 transition-colors ${log.status === 'APPROVED' ? 'bg-blue-50 text-blue-600' :
                                            log.status === 'REJECTED' ? 'bg-slate-100 text-slate-400' :
                                                'bg-green-50 text-green-600'
                                            }`}>
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        {i < recentActivity.length - 1 && <div className="w-0.5 h-full bg-slate-100 mt-2" />}
                                    </div>
                                    <div className="pb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-black text-slate-900">{log.bloodGroup} Request</span>
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${log.status === 'APPROVED' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                                                }`}>{log.status}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                            {log.units} units processed for patient request.
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            {new Date(log.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                                    Quiet on the horizon...
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-indigo-100">
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold mb-2">Facility Analytics</h4>
                            <p className="text-indigo-100 text-xs mb-6 font-medium leading-relaxed">Deep dive into your hospital's contribution metrics and fulfillment rate.</p>
                            <button className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                                Launch Center <ArrowUpRight className="w-3 h-3" />
                            </button>
                        </div>
                        <TrendingUp className="absolute -bottom-6 -right-6 w-32 h-32 text-indigo-500 opacity-20 -rotate-12 transition-transform group-hover:scale-110" />
                    </div>
                </div>
            </div>

            {/* Update Stock Modal */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16" />

                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-slate-900 mb-2">Refill Stock</h3>
                            <p className="text-slate-500 text-sm mb-8 font-medium italic">Ensure critical levels are maintained for emergencies.</p>

                            <form onSubmit={handleSubmit(onSubmitStock)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                                    <select
                                        {...register("bloodGroup")}
                                        className={`w-full rounded-2xl border-2 p-4 outline-none transition focus:ring-4 focus:ring-red-500/10 font-bold ${errors.bloodGroup ? "border-red-500" : "border-slate-100 focus:border-red-600"}`}
                                    >
                                        <option value="">Select Group</option>
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                    {errors.bloodGroup && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.bloodGroup.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Units (Volume)</label>
                                    <input
                                        type="number"
                                        placeholder="Quantity in units"
                                        {...register("units", { valueAsNumber: true })}
                                        className={`w-full rounded-2xl border-2 p-4 outline-none transition focus:ring-4 focus:ring-red-500/10 font-bold ${errors.units ? "border-red-500" : "border-slate-100 focus:border-red-600"}`}
                                    />
                                    {errors.units && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.units.message}</p>}
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsUpdateModalOpen(false);
                                            reset();
                                        }}
                                        className="flex-1 px-6 py-4 rounded-2xl font-black text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex-1 rounded-2xl bg-red-600 py-4 font-black text-white transition hover:bg-slate-900 shadow-xl shadow-red-100 uppercase text-[10px] tracking-widest"
                                    >
                                        {isUpdating ? "..." : "Push Update"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default HospitalDashboard;
