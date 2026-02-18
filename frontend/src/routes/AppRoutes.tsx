import {
    createBrowserRouter,
    Navigate,
} from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import Loader from "../layouts/Loader";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

const PatientDashboard = lazy(
    () => import("../pages/patient/PatientDashboard")
);
const DonorDashboard = lazy(
    () => import("../pages/donor/DonorDashboard")
);
const AdminDashboard = lazy(
    () => import("../pages/admin/AdminDashboard")
);
const HospitalDashboard = lazy(
    () => import("../pages/hospital/HospitalDashboard")
);
const CreateEmergency = lazy(
    () => import("../pages/patient/CreateEmergency")
);

const withSuspense = (element: ReactNode) => (
    <Suspense fallback={<Loader />}>
        {element}
    </Suspense>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: withSuspense(<Login />),
    },
    {
        path: "/register",
        element: withSuspense(<Register />),
    },

    {
        element: (
            <ProtectedRoute allowedRoles={["PATIENT", "DONOR", "ADMIN", "HOSPITAL"]}>
                {withSuspense(<DashboardLayout />)}
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/patient",
                element: withSuspense(<PatientDashboard />),
            },
            {
                path: "/patient/create",
                element: withSuspense(<CreateEmergency />),
            },
            {
                path: "/donor",
                element: withSuspense(<DonorDashboard />),
            },
            {
                path: "/admin",
                element: withSuspense(<AdminDashboard />),
            },
            {
                path: "/hospital",
                element: withSuspense(<HospitalDashboard />),
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);

export default router;
