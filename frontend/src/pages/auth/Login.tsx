import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, ArrowRight, Activity } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { setTokens, setUserRole } from "../../utils/auth";
import { useLoginMutation } from "../../services/authApi";
import { loginSchema, type LoginSchemaType } from "../../schemas/auth.schema";
import type { UserRole } from "../../types/auth.types";

const Login = () => {
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchemaType): Promise<void> => {
        try {
            const response = await login(data).unwrap();
            const { accessToken, refreshToken, user } = response.data;

            setTokens(accessToken, refreshToken);
            setUserRole(user.role);

            toast.success("Welcome back! 👋");
            handleRoleNavigation(user.role);
        } catch (error: unknown) {
            const fetchError = error as { data?: { message?: string } };
            toast.error(fetchError?.data?.message || "Invalid email or password");
        }
    };

    const handleRoleNavigation = (role: UserRole): void => {
        const routes: Record<UserRole, string> = {
            ADMIN: "/admin",
            DONOR: "/donor",
            PATIENT: "/patient",
            HOSPITAL: "/hospital",
        };
        navigate(routes[role] || "/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[1100px] grid lg:grid-cols-2 glass-card rounded-[2.5rem] overflow-hidden border-none"
            >
                {/* Left Side: Illustration & Info */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-2 mb-12">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white fill-current" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">BloodBank</span>
                        </Link>

                        <h2 className="text-4xl font-bold leading-tight mb-6">
                            Saving lives is just a <span className="text-red-500">click away.</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-sm">
                            Access your dashboard to manage donations, requests, and emergency alerts.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Live Updates</p>
                                <p className="text-sm text-slate-400">Real-time blood stock monitoring</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Gradient */}
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-600/20 blur-[80px] translate-y-1/2 translate-x-1/2" />
                </div>

                {/* Right Side: Login Form */}
                <div className="p-8 lg:p-16 bg-white">
                    <div className="max-w-md mx-auto">
                        <div className="mb-10 lg:hidden flex justify-center">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                                    <Heart className="w-6 h-6 text-white fill-current" />
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-slate-800">BloodBank</span>
                            </Link>
                        </div>

                        <div className="mb-10 text-center lg:text-left">
                            <h3 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h3>
                            <p className="text-slate-500">Please enter your details to sign in.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        {...register("email")}
                                        className={`input-field pl-11 ${errors.email ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-200"}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs font-medium text-red-500 ml-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-semibold text-slate-700">Password</label>
                                    <a href="#" className="text-xs font-semibold text-red-600 hover:text-red-700">Forgot Password?</a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("password")}
                                        className={`input-field pl-11 ${errors.password ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-200"}`}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs font-medium text-red-500 ml-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group shadow-xl shadow-red-500/20"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-500">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-bold text-red-600 hover:text-red-700 transition-colors"
                                >
                                    Create one now
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
