import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "../../services/authApi";
import { registerSchema, type RegisterSchemaType } from "../../schemas/auth.schema";

const BLOOD_GROUPS: string[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const Register = () => {
    const navigate = useNavigate();
    const [registerUser, { isLoading }] = useRegisterMutation();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterSchemaType>({
        resolver: zodResolver(registerSchema),
    });

    const selectedRole = watch("role");

    const onSubmit = async (data: RegisterSchemaType): Promise<void> => {
        try {
            await registerUser(data).unwrap();
            toast.success("Registration successful 🎉");
            navigate("/");
        } catch (error: any) {
            toast.error(error?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-center text-3xl font-bold text-red-600">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            placeholder="Full Name"
                            {...register("name")}
                            className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.name ? "border-red-500" : "border-gray-200"
                                }`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register("email")}
                            className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.email ? "border-red-500" : "border-gray-200"
                                }`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <input
                            placeholder="Phone"
                            {...register("phone")}
                            className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.phone ? "border-red-500" : "border-gray-200"
                                }`}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                            className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.password ? "border-red-500" : "border-gray-200"
                                }`}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <select
                            {...register("role")}
                            className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.role ? "border-red-500" : "border-gray-200"
                                }`}
                        >
                            <option value="">Select Role</option>
                            <option value="PATIENT">Patient</option>
                            <option value="DONOR">Donor</option>
                            <option value="HOSPITAL">Hospital</option>
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
                        )}
                    </div>

                    {selectedRole === "DONOR" && (
                        <div>
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
                    )}

                    {selectedRole === "HOSPITAL" && (
                        <div className="space-y-4">
                            <input
                                placeholder="Hospital Name"
                                {...register("hospitalName")}
                                className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.hospitalName ? "border-red-500" : "border-gray-200"
                                    }`}
                            />
                            <input
                                placeholder="License Number"
                                {...register("licenseNumber")}
                                className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.licenseNumber ? "border-red-500" : "border-gray-200"
                                    }`}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {isLoading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/" className="font-semibold text-red-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
