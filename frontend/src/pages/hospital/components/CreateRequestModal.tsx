import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Droplets, MapPin, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { emergencyRequestSchema, type EmergencyRequestSchemaType } from "../../../schemas/request.schema";
import { useCreateEmergencyMutation } from "../../../services/requestApi";
import LocationPicker from "../../../components/common/LocationPicker";

interface CreateRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const CreateRequestModal = ({ isOpen, onClose }: CreateRequestModalProps) => {
    const [createRequest, { isLoading }] = useCreateEmergencyMutation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<EmergencyRequestSchemaType>({
        resolver: zodResolver(emergencyRequestSchema),
    });

    const latitude = watch("latitude");
    const longitude = watch("longitude");

    const onSubmit = async (data: EmergencyRequestSchemaType) => {
        try {
            await createRequest({
                ...data,
                units: Number(data.units)
            }).unwrap();
            toast.success("Blood request broadcasted successfully");
            reset();
            onClose();
        } catch (error: unknown) {
            const fetchError = error as { data?: { message?: string } };
            toast.error(fetchError?.data?.message || "Failed to create request");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-10 py-8 border-b border-slate-100 flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                                    <Droplets className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-none">Broadcast Request</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase mt-1 tracking-tight">Request blood from the network</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                                    <select
                                        {...register("bloodGroup")}
                                        className={`w-full rounded-2xl border-2 p-4 outline-none transition focus:ring-4 focus:ring-red-500/10 font-bold ${errors.bloodGroup ? "border-red-500" : "border-slate-100 focus:border-red-600"}`}
                                    >
                                        <option value="">Select Group</option>
                                        {BLOOD_GROUPS.map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                    {errors.bloodGroup && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.bloodGroup.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Required Units</label>
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        {...register("units", { valueAsNumber: true })}
                                        className={`w-full rounded-2xl border-2 p-4 outline-none transition focus:ring-4 focus:ring-red-500/10 font-bold ${errors.units ? "border-red-500" : "border-slate-100 focus:border-red-600"}`}
                                    />
                                    {errors.units && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.units.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <MapPin className="w-3 h-3" /> Pickup Location
                                </label>
                                <div className="rounded-[2rem] overflow-hidden border-2 border-slate-100 h-[250px] relative">
                                    <LocationPicker
                                        latitude={latitude}
                                        longitude={longitude}
                                        onLocationSelect={(lat, lng) => {
                                            setValue("latitude", lat);
                                            setValue("longitude", lng);
                                        }}
                                    />
                                </div>
                                {(errors.latitude || errors.longitude) && (
                                    <p className="text-[10px] text-red-500 font-bold ml-1">Please select the location on the map</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <AlertCircle className="w-3 h-3" /> Urgency Level
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {["LOW", "MEDIUM", "HIGH"].map((level) => (
                                        <label key={level} className="relative cursor-pointer group">
                                            <input
                                                type="radio"
                                                value={level}
                                                {...register("urgencyLevel")}
                                                className="peer sr-only"
                                            />
                                            <div className={`p-4 rounded-2xl border-2 text-center font-black text-xs tracking-widest transition-all peer-checked:bg-slate-900 peer-checked:text-white peer-checked:border-slate-900 border-slate-100 text-slate-400 group-hover:border-slate-200`}>
                                                {level}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.urgencyLevel && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.urgencyLevel.message}</p>}
                            </div>

                            <div className="flex gap-4 pt-6 sticky bottom-0 bg-white">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-5 rounded-2xl font-black text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all uppercase text-xs tracking-widest"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 rounded-2xl bg-red-600 py-5 font-black text-white transition hover:bg-slate-900 shadow-xl shadow-red-100 uppercase text-xs tracking-widest disabled:opacity-50"
                                >
                                    {isLoading ? "Broadcasting..." : "Confirm Broadcast"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateRequestModal;
