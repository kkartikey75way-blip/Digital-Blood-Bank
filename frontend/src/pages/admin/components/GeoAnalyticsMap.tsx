import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGetGeoDemandQuery } from "../../../services/adminApi";
import { Loader2, Maximize2 } from "lucide-react";
import { useEffect } from "react";

// Component to handle map center updates
const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

interface GeoDemandRequest {
    lat: number;
    lng: number;
    bloodGroup: string;
    urgency: "LOW" | "MEDIUM" | "HIGH";
    weight: number;
}

const GeoAnalyticsMap = () => {
    const { data: geoData, isLoading } = useGetGeoDemandQuery(undefined, {
        pollingInterval: 30000, // Refresh every 30 seconds
    });

    const requests: GeoDemandRequest[] = geoData?.data || [];

    const defaultCenter: [number, number] = [20.5937, 78.9629];
    const dynamicCenter: [number, number] = requests.length > 0 ? [requests[0].lat, requests[0].lng] : defaultCenter;

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case "HIGH": return "#ef4444";
            case "MEDIUM": return "#f59e0b";
            default: return "#3b82f6";
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-[500px] relative group">
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                </div>
            )}

            <div className="absolute top-6 left-6 z-[1000] bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-100 shadow-xl">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Live Demand Heatmap</h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1">Real-time geospatial request density</p>
                <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-600">HIGH</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-black text-slate-600">MEDIUM</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black text-slate-600">LOW</span>
                    </div>
                </div>
            </div>

            <MapContainer
                center={defaultCenter}
                zoom={5}
                scrollWheelZoom={false}
                className="w-full h-full z-10"
            >
                <ChangeView center={dynamicCenter} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {requests.map((req: GeoDemandRequest, index: number) => (
                    <CircleMarker
                        key={index}
                        center={[req.lat, req.lng]}
                        radius={req.urgency === "HIGH" ? 15 : 10}
                        pathOptions={{
                            fillColor: getUrgencyColor(req.urgency),
                            fillOpacity: 0.6,
                            color: "white",
                            weight: 2
                        }}
                    >
                        <Popup>
                            <div className="p-2">
                                <p className="font-black text-slate-900 text-xs">Blood Group: {req.bloodGroup}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Urgency: {req.urgency}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            <button className="absolute bottom-6 right-6 z-[1000] p-4 bg-slate-900 text-white rounded-2xl shadow-2xl hover:bg-red-600 transition-all active:scale-95">
                <Maximize2 className="w-5 h-5" />
            </button>
        </div>
    );
};

export default GeoAnalyticsMap;
