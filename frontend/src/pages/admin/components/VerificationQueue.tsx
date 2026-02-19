import { ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { IUser } from "../../../types/user.types";

interface VerificationQueueProps {
    pendingHospitals: IUser[];
    isLoading: boolean;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const VerificationQueue = ({ pendingHospitals, isLoading, onApprove, onReject }: VerificationQueueProps) => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Verification Queue</h3>
                <div className="flex gap-2">
                    <span className="px-4 py-1.5 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs">
                        {pendingHospitals.length} Pending Actions
                    </span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/10">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest font-sans">Hospital Identity</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest font-sans">Registration #</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest font-sans">Status</th>
                                <th className="px-8 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-widest font-sans">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {pendingHospitals.length > 0 ? pendingHospitals.map((hospital) => (
                                <tr key={hospital._id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                                {hospital.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="text-sm font-black text-slate-800 block">{hospital.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{hospital.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className="text-sm font-bold text-slate-600 font-mono">{hospital.licenseNumber}</span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100">
                                            Verification Required
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onApprove(hospital._id)}
                                                className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                title="Approve"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onReject(hospital._id)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="Reject"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <ShieldCheck className="w-12 h-12 text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Horizon is clear. Everyone is verified.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VerificationQueue;
