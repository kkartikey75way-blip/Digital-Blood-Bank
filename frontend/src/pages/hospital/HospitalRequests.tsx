import { motion } from "framer-motion";
import {
    Activity,
    Clock,
    Search,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";
import { useGetNearbyRequestsQuery, useApproveRequestMutation, useRejectRequestMutation, useFulfillRequestMutation } from "../../services/requestApi";
import { useState } from "react";
import toast from "react-hot-toast";

const HospitalRequests = () => {
    const [coords] = useState({ latitude: 30.7333, longitude: 76.7794 }); // Default
    const { data: requestData, isLoading } = useGetNearbyRequestsQuery({
        ...coords,
        radius: 100,
        bloodGroup: ""
    });

    const [approveRequest, { isLoading: isApproving }] = useApproveRequestMutation();
    const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestMutation();
    const [fulfillRequest, { isLoading: isFulfilling }] = useFulfillRequestMutation();

    const requests = requestData?.data || [];

    const handleApprove = async (id: string) => {
        try {
            await approveRequest(id).unwrap();
            toast.success("Request approved and stock updated!");
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to approve");
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectRequest(id).unwrap();
            toast.success("Request rejected.");
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to reject");
        }
    };

    const handleFulfill = async (id: string) => {
        try {
            await fulfillRequest(id).unwrap();
            toast.success("Request fulfilled successfully!");
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to fulfill");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Urgent Requests</h2>
                    <p className="text-slate-500 mt-1">Manage and respond to localized blood emergencies.</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500" />
                    <input
                        type="text"
                        placeholder="Filter by blood group..."
                        className="input-field pl-11 py-2 text-sm max-w-[240px]"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((req) => (
                        <motion.div
                            key={req._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center font-black text-red-600 text-xl">
                                        {req.bloodGroup}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${req.urgencyLevel === 'HIGH' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        {req.urgencyLevel}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                        <Activity className="w-4 h-4 text-slate-400" />
                                        Status: <span className="text-red-600 font-extrabold uppercase">{req.status}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {req.status === 'PENDING' ? (
                                        <>
                                            <button
                                                onClick={() => handleApprove(req._id)}
                                                disabled={isApproving}
                                                className="flex-1 btn-primary py-3 rounded-2xl text-[10px]"
                                            >
                                                {isApproving ? "..." : "Approve & Reserve"}
                                            </button>
                                            <button
                                                onClick={() => handleReject(req._id)}
                                                disabled={isRejecting}
                                                className="px-4 py-3 bg-slate-100 text-slate-500 font-bold rounded-2xl text-[10px] hover:bg-slate-200 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : req.status === 'APPROVED' ? (
                                        <button
                                            onClick={() => handleFulfill(req._id)}
                                            disabled={isFulfilling}
                                            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-2xl text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            {isFulfilling ? "..." : "Mark Fulfilled"}
                                        </button>
                                    ) : (
                                        <div className="flex-1 bg-slate-100 text-slate-500 font-bold py-3 rounded-2xl text-sm text-center">
                                            Request {req.status === 'REJECTED' ? 'Rejected' : 'Fulfilled'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {requests.length === 0 && (
                        <div className="col-span-full bg-slate-50 rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
                            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Clear Horizon</h3>
                            <p className="text-slate-500">No pending emergency requests in your area at this moment.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HospitalRequests;
