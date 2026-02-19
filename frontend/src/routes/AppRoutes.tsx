import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import Loader from "../layouts/Loader";
import ProtectedRoute from "./ProtectedRoute";
const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));

const Landing = lazy(() => import("../pages/Landing"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

const PatientDashboard = lazy(() => import("../pages/patient/PatientDashboard"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminReports = lazy(() => import("../pages/admin/AdminReports"));
const HospitalDashboard = lazy(() => import("../pages/hospital/HospitalDashboard"));
const HospitalRequests = lazy(() => import("../pages/hospital/HospitalRequests"));
const NearbyDonors = lazy(() => import("../pages/hospital/NearbyDonors"));
const DonorDashboard = lazy(() => import("../pages/donor/DonorDashboard"));
const NearbyRequests = lazy(() => import("../pages/donor/NearbyRequests"));
const CreateEmergency = lazy(() => import("../pages/patient/CreateEmergency"));

const withSuspense = (element: ReactNode) => (
    <Suspense fallback={<Loader />}>
        {element}
    </Suspense>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: withSuspense(<Landing />),
    },
    {
        path: "/login",
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
                path: "/admin",
                element: withSuspense(<AdminDashboard />),
            },
            {
                path: "/admin/reports",
                element: withSuspense(<AdminReports />),
            },
            {
                path: "/hospital",
                element: withSuspense(<HospitalDashboard />),
            },
            {
                path: "/hospital/requests",
                element: withSuspense(<HospitalRequests />),
            },
            {
                path: "/hospital/nearby-donors",
                element: withSuspense(<NearbyDonors />),
            },
            {
                path: "/donor",
                element: withSuspense(<DonorDashboard />),
            },
            {
                path: "/donor/nearby",
                element: withSuspense(<NearbyRequests />),
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);

export default router;
