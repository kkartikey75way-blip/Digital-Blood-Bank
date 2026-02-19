import { motion } from "framer-motion";
import {
    Activity,
    AlertTriangle,
    Droplets,
    TrendingUp,
    Hospital,
    ArrowRight,
    Loader2
} from "lucide-react";
import { useGetBloodDemandQuery, useGetLowStockHospitalsQuery } from "../../services/adminApi";

const AdminReports = () => {
    const { data: demandData, isLoading: isDemandLoading } = useGetBloodDemandQuery();
    const { data: lowStockData, isLoading: isLowStockLoading } = useGetLowStockHospitalsQuery();

    const demand = demandData?.data || [];
    const lowStockHospitals = lowStockData?.data || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900">System Analytics</h2>
                <p className="text-slate-500 mt-1">Real-time demand forecasting and inventory bottleneck monitoring.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Blood Group Demand */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Blood Group Demand</h3>
                            <p className="text-sm text-slate-500">Frequency of requests by type</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-red-500" />
                        </div>
                    </div>

                    {isDemandLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {demand.map((item) => (
                                <div key={item._id} className="relative">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-slate-700">{item._id}</span>
                                        <span className="text-sm font-black text-slate-900">{item.count} Requests</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((item.count / 20) * 100, 100)}%` }}
                                            className="h-full bg-red-600 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                            {demand.length === 0 && (
                                <p className="text-center text-slate-500 italic py-10">No demand data available yet.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Low Stock Hospitals */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold">Critical Inventory Alerts</h3>
                                <p className="text-slate-400 text-sm">Facilities with localized shortages</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-amber-500" />
                            </div>
                        </div>

                        {isLowStockLoading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {lowStockHospitals.map((hospital) => (
                                    <motion.div
                                        key={hospital._id}
                                        whileHover={{ x: 4 }}
                                        className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                                <Hospital className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm">{hospital.name}</h4>
                                                <p className="text-xs text-slate-500">Located in Area</p>
                                            </div>
                                        </div>
                                        <button className="p-2 rounded-lg bg-white/5 group-hover:bg-amber-500 transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                                {lowStockHospitals.length === 0 && (
                                    <div className="text-center py-10">
                                        <Activity className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                        <p className="text-slate-500 font-medium">All facilities are well-stocked.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Decorative Background */}
                    <Droplets className="absolute -bottom-10 -right-10 w-48 h-48 text-red-600/10 -rotate-12" />
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
