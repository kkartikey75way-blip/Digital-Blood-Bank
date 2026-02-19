import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
    useGetPendingHospitalsQuery,
    useApproveHospitalMutation,
    useRejectHospitalMutation
} from "../../services/adminApi";
import { useGetAdminAnalyticsQuery } from "../../services/analyticsApi";
import toast from "react-hot-toast";
import SystemInsights from "./components/SystemInsights";
import RequestVelocityChart from "./components/RequestVelocityChart";
import DonorMixChart from "./components/DonorMixChart";
import VerificationQueue from "./components/VerificationQueue";

const COLORS = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#94a3b8', '#64748b', '#475569', '#334155'];

const AdminDashboard = () => {
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetAdminAnalyticsQuery();
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

    const statsData = analyticsData?.data;
    const bloodGroupData = statsData?.bloodGroupDistribution?.map(s => ({ name: s._id, value: s.count })) || [];
    const trendData = statsData?.requestTrends?.map(t => ({ date: t._id, count: t.count })) || [];
    const pendingHospitals = pendingData?.data || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Command Center</h2>
                    <p className="text-slate-500 mt-2 font-black text-xs uppercase tracking-[0.3em]">System Health & Verification Control</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest hover:border-slate-200 transition-all active:scale-95">
                        Audit Logs
                    </button>
                    <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-red-200 active:scale-95">
                        Force Export <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <SystemInsights
                stats={statsData?.overview}
                pendingHospitalCount={pendingData?.count}
                isLoading={isAnalyticsLoading}
            />

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Trend Chart */}
                <RequestVelocityChart trendData={trendData} />

                {/* Pie Chart */}
                <DonorMixChart bloodGroupData={bloodGroupData} colors={COLORS} />
            </div>

            {/* Verification Queue */}
            <VerificationQueue
                pendingHospitals={pendingHospitals}
                isLoading={isPendingLoading}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </motion.div>
    );
};

export default AdminDashboard;
