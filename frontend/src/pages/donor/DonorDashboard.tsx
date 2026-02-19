import { motion } from "framer-motion";
import { MapPin, Activity, Zap } from "lucide-react";
import { useGetDonationHistoryQuery } from "../../services/donorApi";
import { useGetNearbyRequestsQuery, useAcceptRequestMutation, useCompleteRequestMutation } from "../../services/requestApi";
import { useGetProfileQuery } from "../../services/authApi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import DonorStats from "./components/DonorStats";
import ImpactHistory from "./components/ImpactHistory";
import NearbyRequestsList from "./components/NearbyRequestsList";

const DonorDashboard = () => {
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    const { data: profileData } = useGetProfileQuery();
    const currentUserId = profileData?.data?._id;

    const handleFetchLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                () => {
                    toast.error("Location detection failed. GPS access required for live requests.");
                }
            );
        }
    };

    useEffect(() => {
        handleFetchLocation();
    }, []);

    const { data: historyData, isLoading: isHistoryLoading } = useGetDonationHistoryQuery();
    const { data: nearbyData, isLoading: isNearbyLoading } = useGetNearbyRequestsQuery({
        latitude: coords?.latitude || 0,
        longitude: coords?.longitude || 0,
        radius: 50,
        bloodGroup: ""
    }, { skip: !coords });

    const [acceptRequest, { isLoading: isAccepting }] = useAcceptRequestMutation();
    const [completeRequest, { isLoading: isCompleting }] = useCompleteRequestMutation();

    const handleAccept = async (requestId: string) => {
        try {
            await acceptRequest(requestId).unwrap();
            toast.success("Request accepted! Please contact the hospital.");
        } catch (error: unknown) {
            const fetchError = error as { data?: { message?: string } };
            toast.error(fetchError?.data?.message || "Failed to accept request");
        }
    };

    const handleComplete = async (requestId: string) => {
        try {
            await completeRequest(requestId).unwrap();
            toast.success("Mission completed! Thank you for saving a life.");
        } catch (error: unknown) {
            const fetchError = error as { data?: { message?: string } };
            toast.error(fetchError?.data?.message || "Failed to complete mission");
        }
    };

    const history = historyData?.data || [];
    const nearbyRequests = nearbyData?.data || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Champion's Hub</h2>
                    <div className="flex items-center gap-3 mt-2">
                        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                            <Zap className="w-3 h-3 text-amber-500" /> Legend Status: Active
                        </p>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                            <Activity className="w-3 h-3 text-red-600" /> Pulse: Optimal
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleFetchLocation}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:border-slate-200 transition-all active:scale-95 shadow-xl shadow-slate-50"
                    >
                        <MapPin className="w-4 h-4 text-red-600" /> Scan Proximity
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <DonorStats
                historyLength={history.length}
                impactPoints={profileData?.data?.impactPoints || 0}
                rank={profileData?.data?.rank || "Novice"}
                isLoading={isHistoryLoading}
            />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-10">
                {/* Nearby Requests Column */}
                <NearbyRequestsList
                    requests={nearbyRequests}
                    isLoading={isNearbyLoading}
                    currentUserId={currentUserId}
                    isAccepting={isAccepting}
                    isCompleting={isCompleting}
                    onAccept={handleAccept}
                    onComplete={handleComplete}
                />

                {/* Impact History Sidebar */}
                <ImpactHistory history={history} isLoading={isHistoryLoading} />
            </div>
        </motion.div>
    );
};

export default DonorDashboard;
