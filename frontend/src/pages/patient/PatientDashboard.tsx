import { PlusCircle } from "lucide-react";
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
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Patient Dashboard</h2>
                    <p className="text-slate-500 mt-1">Manage your blood requests and monitor emergency responses.</p>
                </div>
                <button
                    onClick={() => navigate("/patient/create")}
                    className="btn-primary flex items-center justify-center gap-2 group"
                >
                    <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    New Emergency Request
                </button>
            </div>

            {/* Quick Stats */}
            <DashboardStats
                activeCount={activeRequests.length}
                completedCount={completedRequests.length}
                isLoading={isLoading}
            />

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-8">
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
        </div>
    );
};

export default PatientDashboard;
