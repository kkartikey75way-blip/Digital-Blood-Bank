import { X, Loader2 } from "lucide-react";
import StatusTimeline from "../../../components/common/StatusTimeline";
import type { IBloodRequest } from "../../../types/request.types";

interface RequestInsightModalProps {
    request: IBloodRequest;
    isCompleting: boolean;
    isRejectingDonor: boolean;
    onClose: () => void;
    onComplete: (id: string) => void;
    onRejectDonor: (id: string) => void;
}

const RequestInsightModal = ({
    request,
    isCompleting,
    isRejectingDonor,
    onClose,
    onComplete,
    onRejectDonor
}: RequestInsightModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl relative overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-xl transition-colors"
                >
                    <X className="w-5 h-5 text-slate-400" />
                </button>

                <div className="mb-10">
                    <span className="px-4 py-1.5 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100 mb-4 inline-block">
                        Request Insight
                    </span>
                    <h3 className="text-3xl font-black text-slate-900">{request.bloodGroup} Blood</h3>
                    <p className="text-slate-500 font-medium">{request.units} Units Required</p>
                </div>

                <div className="space-y-8">
                    {/* Donor Details Section */}
                    {request.status === 'APPROVED' && request.processedBy && typeof request.processedBy === 'object' && (
                        <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xs font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Hero Found!
                                </h4>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-white text-green-600 flex items-center justify-center font-bold text-lg shadow-sm">
                                        {(request.processedBy as any).name?.charAt(0) || 'H'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-lg">{(request.processedBy as any).name}</p>
                                        <p className="text-sm text-slate-500 font-medium">{(request.processedBy as any).phone}</p>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-green-700 bg-white/50 p-3 rounded-xl border border-green-100">
                                    Please contact your donor to coordinate the donation.
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
                        </div>
                    )}

                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Fulfillment Journey</h4>
                        <StatusTimeline status={request.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-sm font-bold text-slate-900 capitalize">{request.status.toLowerCase()}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Urgency</p>
                            <p className="text-sm font-bold text-red-600">{request.urgencyLevel}</p>
                        </div>
                    </div>

                    {request.status === 'APPROVED' ? (
                        <div className="flex gap-4">
                            <button
                                onClick={() => onRejectDonor(request._id)}
                                disabled={isRejectingDonor}
                                className="flex-1 py-4 bg-red-100 text-red-600 hover:bg-red-200 rounded-2xl font-black text-sm transition-colors active:scale-95"
                            >
                                {isRejectingDonor ? "..." : "Reject Donor"}
                            </button>
                            <button
                                onClick={() => onComplete(request._id)}
                                disabled={isCompleting}
                                className="flex-[2] py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-sm transition-all active:scale-95 shadow-xl shadow-green-200 flex items-center justify-center gap-2"
                            >
                                {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Donation Received"}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm transition-transform active:scale-95 shadow-xl shadow-slate-200"
                        >
                            Close Insight
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestInsightModal;
