import type { IUser } from "./user.types";

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH";

export interface CreateEmergencyRequest {
    bloodGroup: string;
    units: number;
    latitude: number;
    longitude: number;
    urgencyLevel: UrgencyLevel;
}

export interface IBloodRequest {
    _id: string;
    bloodGroup: string;
    units: number;
    patient: IUser | string;
    processedBy?: IUser | string;
    status: RequestStatus;
    urgencyLevel: UrgencyLevel;
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    createdAt: string;
    updatedAt: string;
}

export interface ISystemStats {
    totalUsers: number;
    totalDonors: number;
    activeDonors: number;
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
}

export interface IBloodDemand {
    _id: string; // Blood group
    count: number;
}
