import { Search, Loader2, ArrowUpRight } from "lucide-react";
import type { IBloodRequest } from "../../../types/request.types";

interface RecentRequestsTableProps {
    requests: IBloodRequest[];
    isLoading: boolean;
    onViewRequest: (request: IBloodRequest) => void;
}

const RecentRequestsTable = ({ requests, isLoading, onViewRequest }: RecentRequestsTableProps) => {
    return (
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 font-sans">Recent Requests</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-red-100 transition-all"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Group</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Urgency</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Requested On</th>
                                <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {requests.length > 0 ? requests.map((req) => (
                                <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center font-bold text-red-600 text-xs">
                                                {req.bloodGroup}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${req.urgencyLevel === "HIGH" ? "bg-red-100 text-red-600" :
                                            req.urgencyLevel === "MEDIUM" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                                            }`}>
                                            {req.urgencyLevel}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500 animate-pulse'
                                                }`} />
                                            <span className="text-sm font-bold text-slate-700 capitalize">{req.status.toLowerCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-medium">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => onViewRequest(req)}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors group/view"
                                        >
                                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover/view:text-red-600 transition-colors" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">
                                        No blood requests found. Need help? Create a new one.
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

export default RecentRequestsTable;
