import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";

// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
    latitude: number;
    longitude: number;
    onLocationSelect: (lat: number, lng: number) => void;
}

const MapEvents = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const LocationPicker = ({ latitude, longitude, onLocationSelect }: LocationPickerProps) => {
    const [isFetching, setIsFetching] = useState(false);

    const handleGetLocation = () => {
        if (!navigator.geolocation) return;
        setIsFetching(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                onLocationSelect(pos.coords.latitude, pos.coords.longitude);
                setIsFetching(false);
            },
            () => setIsFetching(false),
            { enableHighAccuracy: true }
        );
    };

    const center: [number, number] = [latitude || 30.7333, longitude || 76.7794];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    Mark Location on Map
                </label>
                <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isFetching}
                    className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                >
                    <Navigation className={`w-3.5 h-3.5 ${isFetching ? 'animate-pulse' : ''}`} />
                    {isFetching ? "Locating..." : "Use My Location"}
                </button>
            </div>

            <div className="h-[300px] w-full rounded-[2rem] overflow-hidden border-4 border-white shadow-xl shadow-slate-200/50 group relative">
                <MapContainer
                    center={center}
                    zoom={13}
                    className="h-full w-full z-10"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents onLocationSelect={onLocationSelect} />
                    <ChangeView center={center} />
                    <Marker position={center} />
                </MapContainer>

                {/* Overlay Hint */}
                <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight text-slate-500 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 border border-slate-100 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Click anywhere to change location
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
