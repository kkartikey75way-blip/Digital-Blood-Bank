import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useCreateEmergencyMutation } from "../../services/requestApi";
import { emergencyRequestSchema, type EmergencyRequestSchemaType } from "../../schemas/request.schema";

const BLOOD_GROUPS: string[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const CreateEmergency = () => {
    const navigate = useNavigate();
    const [createEmergency, { isLoading }] = useCreateEmergencyMutation();

    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<EmergencyRequestSchemaType>({
        resolver: zodResolver(emergencyRequestSchema),
    });

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setValue("latitude", position.coords.latitude);
                setValue("longitude", position.coords.longitude);
                setIsFetchingLocation(false);
                toast.success("Location updated successfully!");
            },
            (error) => {
                console.error("Error fetching location:", error);
                setIsFetchingLocation(false);
                toast.error("Failed to fetch location. Please enter manually.");
            },
            { enableHighAccuracy: true }
        );
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const onSubmit = async (data: EmergencyRequestSchemaType): Promise<void> => {
        try {
            await createEmergency(data).unwrap();
            toast.success("Emergency request created !!");
            navigate("/patient");
        } catch (error: unknown) {
            const fetchError = error as { data?: { message?: string } };
            toast.error(fetchError?.data?.message || "Failed to create request");
        }
    };

    return (
        <div className="max-w-xl rounded-lg bg-white p-8 shadow-md">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-red-600">
                    Create Emergency Request
                </h2>
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isFetchingLocation}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
                >
                    {isFetchingLocation ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-gray-600"></span>
                            Fetching...
                        </>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Get My Location
                        </>
                    )}
                </button>
            </div>

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
