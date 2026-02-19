import { Activity, MapPin } from "lucide-react";
import StatusTimeline from "../../../components/common/StatusTimeline";
import type { IBloodRequest } from "../../../types/request.types";

interface TrackingCardProps {
    activeRequest?: IBloodRequest;
}

const TrackingCard = ({ activeRequest }: TrackingCardProps) => {
    return (
        <div className="space-y-6">
            {activeRequest && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-600" /> Live Tracking
                    </h4>
                    <StatusTimeline status={activeRequest.status} />

                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Active Request</p>
                        <p className="text-sm font-black text-slate-900">{activeRequest.bloodGroup} ({activeRequest.units} Units)</p>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-fit">
                <h4 className="text-lg font-bold mb-6">Emergency Protocol</h4>
                <div className="space-y-4">
                    {[
                        { step: "1", title: "Location Access", text: "Ensure your GPS is enabled for faster response." },
                        { step: "2", title: "Contact Info", text: "Keep your registered phone number active." },
                        { step: "3", title: "Verification", text: "Admin verifies and broadcasts your request." },
                    ].map((item) => (
                        <div key={item.step} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                                {item.step}
                            </div>
                            <div>
                                <h5 className="font-bold text-sm">{item.title}</h5>
                                <p className="text-xs text-slate-500 mt-0.5">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Global Availability</span>
                    <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> 24/7 Active
                    </span>
                </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" /> Need Help?
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                    If you're facing issues with your request, contact our 24/7 helpline immediately.
                </p>
                <button className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-colors">
                    Contact Support
                </button>
            </div>
        </div>
    );
};

export default TrackingCard;
