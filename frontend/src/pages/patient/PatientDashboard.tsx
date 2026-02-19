import { motion } from "framer-motion";
import { PlusCircle, Activity } from "lucide-react";
import { useGetMyRequestsQuery, useCompleteRequestMutation, useRejectDonorMutation } from "../../services/requestApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { IBloodRequest } from "../../types/request.types";
import toast from "react-hot-toast";
import DashboardStats from "./components/DashboardStats";
import RecentRequestsTable from "./components/RecentRequestsTable";
import TrackingCard from "./components/TrackingCard";
import RequestInsightModal from "./components/RequestInsightModal";

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { data: requestData, isLoading } = useGetMyRequestsQuery();
    const [completeRequest, { isLoading: isCompleting }] = useCompleteRequestMutation();
    const [rejectDonor, { isLoading: isRejectingDonor }] = useRejectDonorMutation();
    const [selectedRequest, setSelectedRequest] = useState<IBloodRequest | null>(null);

    const handleComplete = async (requestId: string) => {
        try {
            await completeRequest(requestId).unwrap();
            toast.success("Donation confirmed! Thank you.");
            setSelectedRequest(null);
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to complete request");
        }
    };

    const handleRejectDonor = async (requestId: string) => {
        try {
            await rejectDonor(requestId).unwrap();
            toast.success("Donor rejected. Request is back to pending.");
            setSelectedRequest(null);
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to reject donor");
        }
    };

    const requests = requestData?.data || [];
    const activeRequests = requests.filter((r) => r.status === 'PENDING' || r.status === 'APPROVED');
    const completedRequests = requests.filter((r) => r.status === 'COMPLETED');

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Patient Portal</h2>
                    <p className="text-slate-500 mt-2 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                        <Activity className="w-3 h-3 text-red-600" /> Operational Status: Active
                    </p>
                </div>
                <button
                    onClick={() => navigate("/patient/create")}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-red-200 group active:scale-95"
                >
                    <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    Initialize Request
                </button>
            </div>

            {/* Quick Stats */}
            <DashboardStats
                activeCount={activeRequests.length}
                completedCount={completedRequests.length}
                isLoading={isLoading}
            />

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-10">
                {/* Recent Requests Table */}
                <RecentRequestsTable
                    requests={requests}
                    isLoading={isLoading}
                    onViewRequest={setSelectedRequest}
                />

                {/* Tracking/Info Card */}
                <TrackingCard activeRequest={activeRequests[0]} />
            </div>

            {/* Details Modal */}
            {selectedRequest && (
                <RequestInsightModal
                    request={selectedRequest}
                    isCompleting={isCompleting}
                    isRejectingDonor={isRejectingDonor}
                    onClose={() => setSelectedRequest(null)}
                    onComplete={handleComplete}
                    onRejectDonor={handleRejectDonor}
                />
            )}
        </motion.div>
    );
};

export default PatientDashboard;
