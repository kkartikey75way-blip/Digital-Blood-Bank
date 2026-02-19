import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

import type { IUser } from '../../types/user.types';

const containerStyle = {
    width: '100%',
    height: '100%'
};

interface DonorMapProps {
    center: { lat: number; lng: number };
    donors: IUser[];
    onMarkerClick?: (donor: IUser) => void;
}

const DonorMap: React.FC<DonorMapProps> = ({ center, donors, onMarkerClick }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY"
    });

    const [_map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedDonor, setSelectedDonor] = useState<IUser | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(_map: google.maps.Map) {
        setMap(null);
    }, []);

    if (!isLoaded) return <div>Loading Map...</div>;

    const validDonors = donors.filter(d => d.location && d.location.coordinates);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                styles: [
                    {
                        "featureType": "poi",
                        "stylers": [{ "visibility": "off" }]
                    }
                ]
            }}
        >
            {validDonors.map((donor) => (
                <Marker
                    key={donor._id}
                    position={{
                        lat: donor.location!.coordinates[1],
                        lng: donor.location!.coordinates[0]
                    }}
                    onClick={() => {
                        setSelectedDonor(donor);
                        if (onMarkerClick) onMarkerClick(donor);
                    }}
                    icon={{
                        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    }}
                />
            ))}

            {selectedDonor && selectedDonor.location && (
                <InfoWindow
                    position={{
                        lat: selectedDonor.location.coordinates[1],
                        lng: selectedDonor.location.coordinates[0]
                    }}
                    onCloseClick={() => setSelectedDonor(null)}
                >
                    <div className="p-2">
                        <h3 className="font-bold text-slate-900">{selectedDonor.name}</h3>
                        <p className="text-sm text-slate-600">Blood Group: {selectedDonor.bloodGroup}</p>
                        <p className="text-xs text-slate-500 mt-1">{selectedDonor.isAvailable ? "Available" : "Not Available"}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default React.memo(DonorMap);
