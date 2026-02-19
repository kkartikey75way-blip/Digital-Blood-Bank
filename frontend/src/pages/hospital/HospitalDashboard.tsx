import { motion } from "framer-motion";
import {
    Droplets,
    TrendingUp,
    Activity,
    Plus,
    AlertTriangle,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStockSchema, type UpdateStockSchemaType } from "../../schemas/hospital.schema";
import { useGetStockQuery, useUpdateStockMutation } from "../../services/hospitalApi";
import { useState } from "react";
import toast from "react-hot-toast";

const HospitalDashboard = () => {
    const { data: stockData, isLoading: isStockLoading } = useGetStockQuery();
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

    const bloodStockData = stockData?.data?.bloodStock;
    const bloodStock = bloodStockData ? (Object.keys(bloodStockData) as Array<keyof typeof bloodStockData>).map(key => ({
        bloodGroup: key.replace("_POS", "+").replace("_NEG", "-"),
        units: bloodStockData[key]
    })) : [];

    const totalUnits = bloodStock.reduce((acc, item) => acc + item.units, 0);

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
                    <h2 className="text-3xl font-bold text-slate-900">Hospital Central</h2>
                    <p className="text-slate-500 mt-1">Monitor real-time blood inventory and manage patient requests.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsUpdateModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Update Stock
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-slate-900 text-white flex items-center justify-between relative overflow-hidden shadow-xl shadow-slate-200">
                    <div className="relative z-10">
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Total Blood Units</p>
                        <h3 className="text-5xl font-black mb-1">
                            {isStockLoading ? "..." : totalUnits} <span className="text-lg font-bold text-slate-500 italic">Units</span>
                        </h3>
                        <div className="flex items-center gap-2 text-green-400 text-sm font-bold mt-4">
                            <TrendingUp className="w-4 h-4" />
                            <span>System is active</span>
                        </div>
                    </div>
                    <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center animate-pulse">
                        <Droplets className="w-12 h-12 text-red-500 fill-current" />
                    </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Blood Groups</p>
                    <h3 className="text-4xl font-black text-slate-900 mb-1">{bloodStock.length}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" /> Active Types
                    </p>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Status</p>
                    <h3 className="text-4xl font-black text-slate-900 mb-1">Live</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Connected
                    </p>
                </div>
            </div>

            {/* Stock Grid */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-900">Inventory Status</h3>
                    <div className="flex gap-2">
                        {[
                            { label: 'Critical', bg: 'bg-red-500' },
                            { label: 'Low', bg: 'bg-amber-500' },
                            { label: 'Normal', bg: 'bg-green-500' }
                        ].map((tag) => (
                            <div key={tag.label} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg">
                                <div className={`w-2 h-2 rounded-full ${tag.bg}`} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{tag.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {isStockLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {bloodStock.map((item, index) => {
                            const status = getStatus(item.units);
                            return (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-6 rounded-[2rem] border transition-all duration-300 ${status === "Critical" ? "bg-red-50 border-red-100" :
                                        status === "Low" ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-2xl font-black ${status === "Critical" ? "text-red-700" :
                                            status === "Low" ? "text-amber-700" : "text-slate-700"
                                            }`}>{item.bloodGroup}</span>
                                        {status === "Critical" && <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce" />}
                                    </div>
                                    <div className="flex items-end gap-1">
                                        <span className="text-2xl font-bold text-slate-900">{item.units}</span>
                                        <span className="text-xs font-bold text-slate-400 pb-1">Units</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                        {bloodStock.length === 0 && (
                            <div className="col-span-full text-center py-10 text-slate-500 font-medium">
                                No stock data available. Add units to get started.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Update Stock Modal */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Update Blood Stock</h3>
                        <form onSubmit={handleSubmit(onSubmitStock)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Blood Group</label>
                                <select
                                    {...register("bloodGroup")}
                                    className={`input-field ${errors.bloodGroup ? "border-red-500" : "border-slate-200"}`}
                                >
                                    <option value="">Select Group</option>
                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                                {errors.bloodGroup && <p className="text-xs text-red-500 ml-1">{errors.bloodGroup.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Units</label>
                                <input
                                    type="number"
                                    placeholder="Number of units"
                                    {...register("units", { valueAsNumber: true })}
                                    className={`input-field ${errors.units ? "border-red-500" : "border-slate-200"}`}
                                />
                                {errors.units && <p className="text-xs text-red-500 ml-1">{errors.units.message}</p>}
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsUpdateModalOpen(false);
                                        reset();
                                    }}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 btn-primary"
                                >
                                    {isUpdating ? "Updating..." : "Confirm"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default HospitalDashboard;
