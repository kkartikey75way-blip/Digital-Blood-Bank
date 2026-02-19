import { motion } from "framer-motion";
import {
    MapPin,
    Droplets,
    Activity,
    Navigation,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { useGetNearbyRequestsQuery, useAcceptRequestMutation, useCompleteRequestMutation } from "../../services/requestApi";
import { useGetProfileQuery } from "../../services/authApi";
import { useState } from "react";
import toast from "react-hot-toast";

const NearbyRequests = () => {
    const [radius, setRadius] = useState(50);
    const [bloodGroup, setBloodGroup] = useState("");
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    const { data: profileData } = useGetProfileQuery();
    const currentUserId = profileData?.data?._id;

    const { data: requestData, isLoading } = useGetNearbyRequestsQuery({
        latitude: coords?.latitude || 0,
        longitude: coords?.longitude || 0,
        radius,
        bloodGroup
    }, { skip: !coords });

    const [acceptRequest, { isLoading: isAccepting }] = useAcceptRequestMutation();
    const [completeRequest, { isLoading: isCompleting }] = useCompleteRequestMutation();

    const handleFetchLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    toast.success("Location detected!");
                },
                () => {
                    toast.error("Failed to detect location. Please enable GPS.");
                }
            );
        }
    };

    const handleAccept = async (id: string) => {
        try {
            await acceptRequest(id).unwrap();
            toast.success("Life-saving mission accepted! Hospital notified.");
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to accept");
        }
    };

    const handleComplete = async (id: string) => {
        try {
            await completeRequest(id).unwrap();
            toast.success("Mission completed! Thank you for your donation.");
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to complete");
        }
    };

    const requests = requestData?.data || [];

    return (
        <div className="space-y-8">
            {/* Search Controls */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <button
                    onClick={handleFetchLocation}
                    className="w-full md:w-fit px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                    <Navigation className="w-4 h-4" /> Detect My Location
                </button>

                <div className="flex-1 w-full space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Search Radius (km)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="5"
                            max="200"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="flex-1 accent-red-600 h-2 bg-slate-100 rounded-full appearance-none cursor-pointer"
                        />
                        <span className="w-12 text-sm font-bold text-slate-900">{radius}km</span>
                    </div>
                </div>

                <div className="w-full md:w-64 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                    <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="input-field py-2.5 text-sm"
                    >
                        <option value="">All Types</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {!coords ? (
                    <div className="col-span-full bg-slate-50 rounded-[2.5rem] p-24 text-center border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <Navigation className="w-10 h-10 text-slate-300 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Location Detection Required</h3>
                        <p className="text-slate-500 font-medium">Please detect your location to find nearby emergency missions.</p>
                    </div>
                ) : isLoading ? (
                    <div className="col-span-full flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                    </div>
                ) : (
                    <>
                        {requests.map((req) => (
                            <motion.div
                                key={req._id}
                                layout
                                className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl shadow-slate-200"
                            >
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center font-black text-red-500 text-2xl">
                                                {req.bloodGroup}
                                            </div>
                                            <span className="px-4 py-1.5 rounded-xl bg-red-600 text-[10px] font-black tracking-widest uppercase">
                                                {req.urgencyLevel}
                                            </span>
                                        </div>
                                        <div className="space-y-4 mb-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                    <Navigation className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-300">Within {radius}km of your zone</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                                    <Activity className="w-4 h-4 text-indigo-400" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-300 uppercase">{req.status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {req.status === 'PENDING' ? (
                                        <button
                                            onClick={() => handleAccept(req._id)}
                                            disabled={isAccepting}
                                            className="w-full btn-primary py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 group/btn"
                                        >
                                            {isAccepting ? "..." : "I Can Donate"}
                                            <CheckCircle2 className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                                        </button>
                                    ) : req.status === 'APPROVED' && req.processedBy === currentUserId ? (
                                        <button
                                            onClick={() => handleComplete(req._id)}
                                            disabled={isCompleting}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 group/btn shadow-xl shadow-green-100"
                                        >
                                            {isCompleting ? "..." : "Complete Donation"}
                                            <CheckCircle2 className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                                        </button>
                                    ) : (
                                        <div className="w-full bg-white/5 border border-white/10 text-slate-500 font-bold py-4 rounded-2xl text-sm text-center">
                                            {req.status === 'COMPLETED' ? 'MISSION FULFILLED' : 'MISSION ACCEPTED'}
                                        </div>
                                    )}
                                </div>
                                <Droplets className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 text-red-500 group-hover:scale-110 transition-transform" />
                            </motion.div>
                        ))}
                        {requests.length === 0 && (
                            <div className="col-span-full bg-white rounded-[2.5rem] p-24 text-center border border-slate-100 shadow-sm">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                    <MapPin className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">No Active Missions</h3>
                                <p className="text-slate-500 font-medium">There are no urgent blood requests matching your criteria at the moment.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NearbyRequests;
