import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map as MapIcon, List, Navigation, Filter, User, Phone, Droplet } from 'lucide-react';
import { useSearchNearbyDonorsQuery } from '../../services/donorApi';
import DonorMap from '../../components/common/DonorMap';
import toast from 'react-hot-toast';

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const NearbyDonors = () => {
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [radius, setRadius] = useState(10);
    const [bloodGroup, setBloodGroup] = useState('O+');
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

    const { data: donorData } = useSearchNearbyDonorsQuery(
        {
            latitude: location?.lat || 0,
            longitude: location?.lng || 0,
            radius,
            bloodGroup
        },
        { skip: !location }
    );

    const donors = donorData?.data || [];

    const handleFetchLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    toast.success("Location detected!");
                },
                () => {
                    toast.error("Failed to detect location. Please enable GPS.");
                }
            );
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
            {/* Header & Filters */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                        <Search className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Find Nearby Donors</h2>
                        <p className="text-sm text-slate-500">Locate life-savers in your immediate vicinity.</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <MapIcon className="w-4 h-4" /> Map
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <List className="w-4 h-4" /> List
                        </button>
                    </div>

                    <button
                        onClick={handleFetchLocation}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        <Navigation className="w-4 h-4" /> My Location
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2">
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                            <Filter className="w-4 h-4" /> <span>Filters</span>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Radius (km)</label>
                            <div className="grid grid-cols-3 gap-2">
                                {RADIUS_OPTIONS.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setRadius(r)}
                                        className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${radius === r ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-50 text-slate-500 hover:border-slate-100'
                                            }`}
                                    >
                                        {r}km
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Blood Group</label>
                            <div className="grid grid-cols-4 gap-2">
                                {BLOOD_GROUPS.map((bg) => (
                                    <button
                                        key={bg}
                                        onClick={() => setBloodGroup(bg)}
                                        className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${bloodGroup === bg ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-50 text-slate-500 hover:border-slate-100'
                                            }`}
                                    >
                                        {bg}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-600">Total Donors</span>
                                <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-black">{donors.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {viewMode === 'map' ? (
                            <motion.div
                                key="map-view"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="h-full bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl"
                            >
                                {location ? (
                                    <DonorMap center={location} donors={donors} />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                            <Navigation className="w-10 h-10 text-slate-300 animate-pulse" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Detect Location to Begin</h3>
                                        <p className="text-slate-500 max-w-xs mt-2">Click the "My Location" button to find donors in your immediate area.</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list-view"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {donors.map((donor) => (
                                    <div key={donor._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                                            <User className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 truncate">{donor.name}</h4>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase">
                                                    <Droplet className="w-3 h-3" /> {donor.bloodGroup}
                                                </span>
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase">
                                                    {donor.isAvailable ? 'Available' : 'Busy'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-4 text-slate-500 hover:text-slate-900 transition-colors">
                                                <Phone className="w-4 h-4" />
                                                <span className="text-sm font-bold">{donor.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {donors.length === 0 && (
                                    <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-slate-100 text-center">
                                        <p className="text-slate-500 font-bold italic">No donors found in this radius. Try expanding your search.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default NearbyDonors;
