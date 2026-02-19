import { motion } from "framer-motion";
import {
    Users,
    Hospital,
    Activity,
    ShieldCheck,
    ArrowUpRight,
    Search,
    UserPlus,
    CheckCircle2,
    XCircle,
    Loader2,
    Clock
} from "lucide-react";
import {
    useGetSystemStatsQuery,
    useGetPendingHospitalsQuery,
    useApproveHospitalMutation,
    useRejectHospitalMutation
} from "../../services/adminApi";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const { data: statsData, isLoading: isStatsLoading } = useGetSystemStatsQuery();
    const { data: pendingData, isLoading: isPendingLoading } = useGetPendingHospitalsQuery();
    const [approveHospital] = useApproveHospitalMutation();
    const [rejectHospital] = useRejectHospitalMutation();

    const handleApprove = async (id: string) => {
        try {
            await approveHospital(id).unwrap();
            toast.success("Hospital approved successfully");
        } catch (error: unknown) {
            const fetchError = error as { data?: { message?: string } };
            toast.error(fetchError?.data?.message || "Failed to approve");
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectHospital(id).unwrap();
            toast.success("Hospital rejected");
        } catch (error: unknown) {
            const fetchError = error as { data?: { message?: string } };
            toast.error(fetchError?.data?.message || "Failed to reject");
        }
    };

    const stats = [
        { label: "Total Users", value: statsData?.data?.totalUsers || "0", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Pending Hospitals", value: pendingData?.count || "0", icon: Hospital, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Pending Requests", value: statsData?.data?.pendingRequests || "0", icon: Activity, color: "text-red-600", bg: "bg-red-50" },
        { label: "Verified Donors", value: statsData?.data?.totalDonors || "0", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
    ];

    const pendingHospitals = pendingData?.data || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">System Overview</h2>
                    <p className="text-slate-500 mt-1">Manage network growth, verify entities, and monitor global activity.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="input-field pl-11 py-2 text-sm max-w-[240px]"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-1">{isStatsLoading ? "..." : stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Tables & Activity */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Verification Queue */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">Verification Queue</h3>
                        <p className="text-xs font-bold text-slate-500">{pendingHospitals.length} Pending Actions</p>
                    </div>

                    {isPendingLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Hospital Name</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">License</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
                                        <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {pendingHospitals.length > 0 ? pendingHospitals.map((hospital) => (
                                        <tr key={hospital._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                                        {hospital.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-800">{hospital.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className="text-sm font-medium text-slate-600">{hospital.licenseNumber}</span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-600">
                                                    PENDING
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-medium">
                                                {new Date(hospital.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(hospital._id)}
                                                        className="p-2 rounded-lg text-slate-400 hover:bg-green-50 hover:text-green-600 transition-all"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(hospital._id)}
                                                        className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-10 text-center text-slate-500 font-medium italic">
                                                No pending hospital verifications.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* System Health / Quick Tools */}
                <div className="space-y-6 h-fit">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <h3 className="text-xl font-bold mb-8">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                                        <UserPlus className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <span className="text-sm font-bold">Platform Audit</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
                                        <Hospital className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <span className="text-sm font-bold">Facility Audit</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Server Status</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-green-500 uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Optimal
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-[94%] bg-gradient-to-r from-blue-500 to-indigo-500" />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-tighter">API V1.0 • Uptime: 99.9%</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-red-600 text-white shadow-xl shadow-red-200 group cursor-not-allowed relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Network Alert</h3>
                            <p className="text-red-100 text-sm mb-4">Broadcast an emergency message to all active donors.</p>
                            <span className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest bg-white/20 px-4 py-2 rounded-xl">
                                Coming Soon <Clock className="w-4 h-4" />
                            </span>
                        </div>
                        <Activity className="absolute -bottom-4 -right-4 w-24 h-24 text-red-500 opacity-20 -rotate-12" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
