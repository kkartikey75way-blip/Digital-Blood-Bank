import { motion } from "framer-motion";
import { Loader2, Droplets, Clock, MapPin, Heart } from "lucide-react";

interface NearbyRequestsListProps {
    requests: any[];
    isLoading: boolean;
    currentUserId: string | undefined;
    isAccepting: boolean;
    isCompleting: boolean;
    onAccept: (id: string) => void;
    onComplete: (id: string) => void;
}

const NearbyRequestsList = ({
    requests,
    isLoading,
    currentUserId,
    isAccepting,
    isCompleting,
    onAccept,
    onComplete
}: NearbyRequestsListProps) => {
    return (
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-900">Urgent Nearby Requests</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 opacity-60">
                        <MapPin className="w-3 h-3" />
                        Live Location Active
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.length > 0 ? requests.map((req) => (
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
                                <div className="flex items-center gap-3">
                                    {req.status === 'PENDING' ? (
                                        <button
                                            onClick={() => onAccept(req._id)}
                                            disabled={isAccepting}
                                            className="px-6 py-2 rounded-xl font-bold bg-slate-900 text-white hover:bg-red-600 transition-all"
                                        >
                                            {isAccepting ? '...' : 'Accept'}
                                        </button>
                                    ) : req.status === 'APPROVED' && req.processedBy === currentUserId ? (
                                        <button
                                            onClick={() => onComplete(req._id)}
                                            disabled={isCompleting}
                                            className="px-6 py-2 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition-all"
                                        >
                                            {isCompleting ? '...' : 'Complete'}
                                        </button>
                                    ) : (
                                        <span className="px-4 py-2 bg-slate-100 text-slate-500 font-bold rounded-xl text-xs">
                                            {req.status === 'COMPLETED' ? 'Fulfilled' : 'Accepted'}
                                        </span>
                                    )}
                                </div>
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
    );
};

export default NearbyRequestsList;
