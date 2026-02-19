import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, User, Mail, Phone, Lock, ChevronRight, ArrowLeft, Hospital, Droplet } from "lucide-react";
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
            toast.success("Account created successfully! 🎉");
            navigate("/login");
        } catch (error: unknown) {
            const fetchError = error as { data?: { message?: string } };
            toast.error(fetchError?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl bg-white glass-card rounded-[2.5rem] p-8 lg:p-12 shadow-2xl border-none"
            >
                <div className="mb-10 flex flex-col items-center">
                    <Link to="/" className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                            <Heart className="w-6 h-6 text-white fill-current" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-800">BloodBank</span>
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
                    <p className="text-slate-500">Join our life-saving community today.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                </div>
                                <input
                                    placeholder="John Doe"
                                    {...register("name")}
                                    className={`input-field pl-11 ${errors.name ? "border-red-500" : "border-slate-200"}`}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    {...register("email")}
                                    className={`input-field pl-11 ${errors.email ? "border-red-500" : "border-slate-200"}`}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                </div>
                                <input
                                    placeholder="1234567890"
                                    {...register("phone")}
                                    className={`input-field pl-11 ${errors.phone ? "border-red-500" : "border-slate-200"}`}
                                />
                            </div>
                            {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone.message}</p>}
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Your Role</label>
                            <select
                                {...register("role")}
                                className={`input-field appearance-none cursor-pointer ${errors.role ? "border-red-500" : "border-slate-200"}`}
                            >
                                <option value="">Select Role</option>
                                <option value="PATIENT">Patient</option>
                                <option value="DONOR">Donor</option>
                                <option value="HOSPITAL">Hospital</option>
                            </select>
                            {errors.role && <p className="text-xs text-red-500 ml-1">{errors.role.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                className={`input-field pl-11 ${errors.password ? "border-red-500" : "border-slate-200"}`}
                            />
                        </div>
                        {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
                    </div>

                    <AnimatePresence mode="wait">
                        {selectedRole === "DONOR" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <label className="text-sm font-semibold text-slate-700 ml-1">Blood Group</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {BLOOD_GROUPS.map((group) => (
                                        <label
                                            key={group}
                                            className={`
                                                relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                                                ${watch("bloodGroup") === group ? "border-red-600 bg-red-50 text-red-600" : "border-slate-100 hover:border-slate-200 text-slate-600"}
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                {...register("bloodGroup")}
                                                value={group}
                                                className="absolute opacity-0"
                                            />
                                            <span className="font-bold">{group}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.bloodGroup && <p className="text-xs text-red-500 ml-1">{errors.bloodGroup.message}</p>}
                            </motion.div>
                        )}

                        {selectedRole === "HOSPITAL" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid md:grid-cols-2 gap-6 overflow-hidden"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Hospital Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Hospital className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                        </div>
                                        <input
                                            placeholder="City Hospital"
                                            {...register("hospitalName")}
                                            className={`input-field pl-11 ${errors.hospitalName ? "border-red-500" : "border-slate-200"}`}
                                        />
                                    </div>
                                    {errors.hospitalName && <p className="text-xs text-red-500 ml-1 text-xs">{errors.hospitalName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">License Number</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Droplet className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                        </div>
                                        <input
                                            placeholder="LIC-1234567"
                                            {...register("licenseNumber")}
                                            className={`input-field pl-11 ${errors.licenseNumber ? "border-red-500" : "border-slate-200"}`}
                                        />
                                    </div>
                                    {errors.licenseNumber && <p className="text-xs text-red-500 ml-1 text-xs">{errors.licenseNumber.message}</p>}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group shadow-xl shadow-red-500/20 mt-4"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Create Account
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500">
                        Already have an account?{" "}
                        <Link to="/login" className="font-bold text-red-600 hover:text-red-700 transition-colors">
                            Sign In
                        </Link>
                    </p>
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
