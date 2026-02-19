import { MapPin } from "lucide-react";
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
        <div className="space-y-8">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Hello, Hero! 🌟</h2>
                    <p className="text-slate-500 mt-1">Your contributions are making a difference every day.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleFetchLocation}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-2xl text-xs flex items-center gap-2 transition-all active:scale-95 border border-slate-200"
                    >
                        <MapPin className="w-4 h-4" /> Refresh Location
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <DonorStats historyLength={history.length} isLoading={isHistoryLoading} />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
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
        </div>
    );
};

export default DonorDashboard;
