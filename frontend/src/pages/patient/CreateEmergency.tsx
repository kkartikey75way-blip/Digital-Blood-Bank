import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEmergencyMutation } from "../../services/requestApi";
import { emergencyRequestSchema, type EmergencyRequestSchemaType } from "../../schemas/request.schema";

const BLOOD_GROUPS: string[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const CreateEmergency = () => {
    const navigate = useNavigate();
    const [createEmergency, { isLoading }] = useCreateEmergencyMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmergencyRequestSchemaType>({
        resolver: zodResolver(emergencyRequestSchema),
    });

    const onSubmit = async (data: EmergencyRequestSchemaType): Promise<void> => {
        try {
            await createEmergency(data).unwrap();
            toast.success("Emergency request created !!");
            navigate("/patient");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create request");
        }
    };

    return (
        <div className="max-w-xl rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 text-3xl font-bold text-red-600">
                Create Emergency Request
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Blood Group Required
                    </label>
                    <select
                        {...register("bloodGroup")}
                        className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.bloodGroup ? "border-red-500" : "border-gray-200"
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
                        <p className="mt-1 text-sm text-red-500">{errors.bloodGroup.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Latitude
                        </label>
                        <input
                            type="number"
                            step="any"
                            placeholder="Latitude"
                            {...register("latitude", { valueAsNumber: true })}
                            className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.latitude ? "border-red-500" : "border-gray-200"
                                }`}
                        />
                        {errors.latitude && (
                            <p className="mt-1 text-sm text-red-500">{errors.latitude.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Longitude
                        </label>
                        <input
                            type="number"
                            step="any"
                            placeholder="Longitude"
                            {...register("longitude", { valueAsNumber: true })}
                            className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.longitude ? "border-red-500" : "border-gray-200"
                                }`}
                        />
                        {errors.longitude && (
                            <p className="mt-1 text-sm text-red-500">{errors.longitude.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Urgency Level
                    </label>
                    <select
                        {...register("urgencyLevel")}
                        className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.urgencyLevel ? "border-red-500" : "border-gray-200"
                            }`}
                    >
                        <option value="">Select Urgency</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                    {errors.urgencyLevel && (
                        <p className="mt-1 text-sm text-red-500">{errors.urgencyLevel.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-red-600 py-4 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                    {isLoading ? "Creating Request..." : "Create Emergency"}
                </button>
            </form>
        </div>
    );
};

export default CreateEmergency;
