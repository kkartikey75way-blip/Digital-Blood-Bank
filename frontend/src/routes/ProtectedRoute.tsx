import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import {
    isAuthenticated,
    hasRole,
} from "../utils/auth";
import type { UserRole } from "../types/auth.types";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: UserRole[];
}

const ProtectedRoute = ({
    children,
    allowedRoles,
}: ProtectedRouteProps) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    if (!hasRole(allowedRoles)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
