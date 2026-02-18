import type { UserRole } from "../types/auth.types";

export const getAccessToken = (): string | null =>
    localStorage.getItem("accessToken");

export const getRefreshToken = (): string | null =>
    localStorage.getItem("refreshToken");

export const setTokens = (
    accessToken: string,
    refreshToken: string
): void => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};

export const clearAuthStorage = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
};

export const getUserRole = (): UserRole | null => {
    const role = localStorage.getItem("role");

    const validRoles: UserRole[] = [
        "ADMIN",
        "DONOR",
        "PATIENT",
        "HOSPITAL",
    ];

    if (role && validRoles.includes(role as UserRole)) {
        return role as UserRole;
    }

    return null;
};

export const setUserRole = (role: UserRole): void => {
    localStorage.setItem("role", role);
};

export const isAuthenticated = (): boolean =>
    Boolean(getAccessToken());

export const hasRole = (
    allowedRoles: UserRole[]
): boolean => {
    const role = getUserRole();
    return role !== null && allowedRoles.includes(role);
};
