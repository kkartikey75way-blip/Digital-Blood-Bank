import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEmergencyMutation } from "../../services/requestApi";
import { emergencyRequestSchema, type EmergencyRequestSchemaType } from "../../schemas/request.schema";
import LocationPicker from "../../components/common/LocationPicker";

const BLOOD_GROUPS: string[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const CreateEmergency = () => {
    const navigate = useNavigate();
    const [createEmergency, { isLoading }] = useCreateEmergencyMutation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<EmergencyRequestSchemaType>({
        resolver: zodResolver(emergencyRequestSchema),
    });

    const latitude = watch("latitude");
    const longitude = watch("longitude");

    const onLocationSelect = (lat: number, lng: number) => {
        setValue("latitude", lat);
        setValue("longitude", lng);
    };

    const onSubmit = async (data: EmergencyRequestSchemaType): Promise<void> => {
        try {
            await createEmergency({
                ...data,
                units: Number(data.units)
            }).unwrap();
            toast.success("Emergency request created !!");
            navigate("/patient");
        } catch (error: unknown) {
            const fetchError = error as { data?: { message?: string } };
            toast.error(fetchError?.data?.message || "Failed to create request");
        }
    };

    return (
        <div className="max-w-xl mx-auto rounded-[2.5rem] bg-white p-10 shadow-xl shadow-slate-200 border border-slate-100">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Create Emergency Request
                </h2>
                <p className="text-slate-500 mt-2">Mark your location and specify your needs.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Blood Group Required
                    </label>
                    <select
                        {...register("bloodGroup")}
                        className={`w-full rounded-2xl border-2 p-4 outline-none transition focus:ring-4 focus:ring-red-500/10 font-bold ${errors.bloodGroup ? "border-red-500" : "border-slate-100 focus:border-red-600"
                            }`}
                    >
                        <option value="">Select Blood Group</option>
                        {BLOOD_GROUPS.map((group) => (
                            <option key={group} value={group}>
                                {group}
                            </option>
                        ))}
                    </select>
                    {errors.bloodGroup && (
                        <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.bloodGroup.message}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Units Required
                    </label>
                    <input
                        type="number"
                        {...register("units", { valueAsNumber: true })}
                        placeholder="e.g. 2"
                        className={`w-full rounded-2xl border-2 p-4 outline-none transition focus:ring-4 focus:ring-red-500/10 font-bold ${errors.units ? "border-red-500" : "border-slate-100 focus:border-red-600"
                            }`}
                    />
                    {errors.units && (
                        <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.units.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Hospital Location
                    </label>
                    <div className="rounded-2xl overflow-hidden border-2 border-slate-100">
                        <LocationPicker
                            latitude={latitude}
                            longitude={longitude}
                            onLocationSelect={onLocationSelect}
                        />
                    </div>
                    {(errors.latitude || errors.longitude) && (
                        <p className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-1">Please select location on map</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Urgency Level
                    </label>
                    <select
                        {...register("urgencyLevel")}
                        className={`w-full rounded-2xl border-2 p-4 outline-none transition focus:ring-4 focus:ring-red-500/10 font-bold ${errors.urgencyLevel ? "border-red-500" : "border-slate-100 focus:border-red-600"
                            }`}
                    >
                        <option value="">Select Urgency</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                    {errors.urgencyLevel && (
                        <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.urgencyLevel.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-2xl bg-red-600 py-5 font-black text-white transition hover:bg-slate-900 disabled:opacity-50 shadow-xl shadow-red-200 active:scale-[0.98]"
                >
                    {isLoading ? "Creating Request..." : "Create Emergency"}
                </button>
            </form>
        </div>
    );
};

export default CreateEmergency;
