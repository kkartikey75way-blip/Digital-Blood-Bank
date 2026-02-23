import type { UserRole } from "./auth.types";

export interface IBloodStock {
    A_POS: number;
    A_NEG: number;
    B_POS: number;
    B_NEG: number;
    O_POS: number;
    O_NEG: number;
    AB_POS: number;
    AB_NEG: number;
}

export interface ILocation {
    type: "Point";
    coordinates: [number, number];
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    isVerified: boolean;
    isBlocked: boolean;
    impactPoints: number;
    rank: string;
    badges: string[];

    // Donor fields
    bloodGroup?: string;
    location?: ILocation;
    isAvailable?: boolean;
    lastDonationDate?: string;

    // Hospital fields
    hospitalName?: string;
    hospitalAddress?: string;
    licenseNumber?: string;
    // bloodStock removed, use dedicated BloodStock API

    createdAt: string;
    updatedAt: string;
}

export interface ILowStockHospital {
    hospitalId: string;
    hospitalName: string;
    lowStockGroups: string[];
}
