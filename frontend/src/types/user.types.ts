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

    // Donor fields
    bloodGroup?: string;
    location?: ILocation;
    isAvailable?: boolean;
    lastDonationDate?: string;

    // Hospital fields
    hospitalName?: string;
    hospitalAddress?: string;
    licenseNumber?: string;
    bloodStock?: IBloodStock;

    createdAt: string;
    updatedAt: string;
}
