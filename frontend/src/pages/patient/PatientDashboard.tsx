import {
    Activity,

    AlertCircle,
    ArrowUpRight,
    Search,
    MapPin,
    Hospital,
    PlusCircle,
    Loader2,
} from "lucide-react";
import { useGetMyRequestsQuery } from "../../services/requestApi";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { data: requestData, isLoading } = useGetMyRequestsQuery();

    const requests = requestData?.data || [];
    const activeRequests = requests.filter((r) => r.status === 'PENDING' || r.status === 'ACCEPTED');
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-xl shadow-slate-200">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Active Requests</p>
                    <h3 className="text-4xl font-black mb-1">{isLoading ? "..." : activeRequests.length}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-500" /> Monitoring
                    </p>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Fulfilled</p>
                    <h3 className="text-4xl font-black text-slate-900 mb-1">{isLoading ? "..." : completedRequests.length}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-green-500" /> Lifetime
                    </p>
                </div>

                <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-red-50 border border-red-100 flex items-center justify-between group cursor-pointer hover:bg-red-100 transition-colors">
                    <div>
                        <h4 className="text-xl font-bold text-red-900">Find Nearby Hospitals</h4>
                        <p className="text-red-700/70 text-sm mt-1">View facilities with available blood stocks in your area.</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Hospital className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Requests Table */}
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
                                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-10 text-center text-slate-500 font-medium italic">
                                                No blood requests found. Need help? Create a new one.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Tracking/Info Card */}
                <div className="space-y-6">
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
            </div>
        </div>
    );
};

export default PatientDashboard;
