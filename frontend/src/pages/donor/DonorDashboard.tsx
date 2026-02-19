import { motion } from "framer-motion";
import {
    Heart,
    Droplets,
    Award,
    MapPin,
    CheckCircle2,
    Loader2,
    Clock
} from "lucide-react";
import { useGetDonationHistoryQuery } from "../../services/donorApi";
import { useGetNearbyRequestsQuery, useAcceptRequestMutation } from "../../services/requestApi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const DonorDashboard = () => {
    const [coords, setCoords] = useState({ latitude: 30.7333, longitude: 76.7794 }); // Default coords (Chandigarh)

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            });
        }
    }, []);

    const { data: historyData, isLoading: isHistoryLoading } = useGetDonationHistoryQuery();
    const { data: nearbyData, isLoading: isNearbyLoading } = useGetNearbyRequestsQuery({
        ...coords,
        radius: 50,
        bloodGroup: ""
    });

    const [acceptRequest, { isLoading: isAccepting }] = useAcceptRequestMutation();

    const handleAccept = async (requestId: string) => {
        try {
            await acceptRequest(requestId).unwrap();
            toast.success("Request accepted! Please contact the hospital.");
        } catch (error: unknown) {
            const fetchError = error as { data?: { message?: string } };
            toast.error(fetchError?.data?.message || "Failed to accept request");
        }
    };

    const history = historyData?.data || [];
    const nearbyRequests = nearbyData?.data || [];

    const stats = [
        { label: "Total Donations", value: history.length.toString(), icon: Heart, color: "text-red-600", bg: "bg-red-50" },
        { label: "Lives Saved", value: (history.length * 3).toString(), icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Active Points", value: (history.length * 50).toString(), icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
    ];

    return (
        <div className="space-y-8">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Hello, Hero! 🌟</h2>
                    <p className="text-slate-500 mt-1">Your contributions are making a difference every day.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                                <Icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-4xl font-extrabold text-slate-900 mb-1">{isHistoryLoading ? "..." : stat.value}</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Nearby Requests Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-900">Urgent Nearby Requests</h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 opacity-60">
                                <MapPin className="w-3 h-3" />
                                Live Location Active
                            </div>
                        </div>

                        {isNearbyLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {nearbyRequests.length > 0 ? nearbyRequests.map((req) => (
                                    <motion.div
                                        key={req._id}
                                        whileHover={{ x: 4 }}
                                        className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-sm">
                                                <span className="text-[10px] font-bold text-slate-400">TYPE</span>
                                                <span className="text-xl font-black text-red-600">{req.bloodGroup}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">Emergency Call</h4>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 font-medium">
                                                    <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> {req.urgencyLevel}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3.5 h-3.5" /> {new Date(req.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAccept(req._id)}
                                            disabled={isAccepting || req.status !== 'PENDING'}
                                            className={`px-6 py-2 rounded-xl font-bold transition-all ${req.status === 'PENDING'
                                                ? "bg-slate-900 text-white hover:bg-red-600"
                                                : "bg-slate-200 text-slate-500 cursor-not-allowed"
                                                }`}
                                        >
                                            {req.status === 'PENDING' ? 'Accept' : 'Accepted'}
                                        </button>
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-10 text-slate-500 font-medium bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                        No nearby requests at the moment.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Donation Info Card */}
                    <div className="p-8 rounded-[2.5rem] bg-blue-600 text-white shadow-lg overflow-hidden relative">
                        <div className="relative z-10">
                            <h4 className="font-bold text-2xl mb-2">Ready for your next impact?</h4>
                            <p className="text-blue-100 mb-6">Blood donation is a simple way to give back to your community. Every drop counts.</p>
                            <div className="flex items-center gap-4">
                                <div className="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-md text-sm font-bold">
                                    Hydrate well
                                </div>
                                <div className="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-md text-sm font-bold">
                                    Eat healthy
                                </div>
                            </div>
                        </div>
                        <Heart className="absolute -bottom-6 -right-6 w-48 h-48 opacity-10 fill-current text-white -rotate-12" />
                    </div>
                </div>

                {/* Impact History Sidebar */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-1">Impact History</h3>
                            <p className="text-slate-400 text-sm">Your journey of saving lives.</p>
                        </div>

                        {isHistoryLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-8 flex-1">
                                {history.length > 0 ? history.map((item, i) => {
                                    const request = typeof item.request === 'object' ? item.request : null;
                                    return (
                                        <div key={item._id} className="flex gap-4 relative">
                                            {i < history.length - 1 && <div className="absolute left-5 top-10 bottom-[-32px] w-0.5 bg-slate-800" />}
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center z-10">
                                                <div className="w-2 h-2 rounded-full bg-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Donation for Blood Request ({request?.bloodGroup || 'N/A'})</p>
                                                <p className="text-xs text-slate-500 mt-1">{new Date(item.donatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-slate-500 text-sm font-medium italic">
                                        Your donation history will appear here.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-12 bg-white/5 rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="w-6 h-6 text-amber-500" />
                                <span className="font-bold text-sm tracking-wider uppercase">Active Status</span>
                            </div>
                            <p className="text-lg font-bold mb-1 italic">
                                {history.length > 5 ? '"Master Life Saver"' : history.length > 0 ? '"Rising Hero"' : '"New Joiner"'}
                            </p>
                            <p className="text-xs text-slate-400">Keep up the great work!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
