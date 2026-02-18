import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
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

            toast.success("Login successful 🎉");
            handleRoleNavigation(user.role);
        } catch (error: any) {
            toast.error(error?.data?.message || "Invalid email or password");
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
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-center text-3xl font-bold text-red-600">
                    Blood Bank Login
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register("email")}
                            className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-red-500 ${errors.email ? "border-red-500" : "border-gray-200"
                                }`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
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
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-red-600 hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
