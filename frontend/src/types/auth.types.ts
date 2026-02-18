export type UserRole =
    | "ADMIN"
    | "DONOR"
    | "PATIENT"
    | "HOSPITAL";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
        user: {
            role: UserRole;
        };
    };
}

export interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    bloodGroup?: string;
    hospitalName?: string;
    licenseNumber?: string;
}
