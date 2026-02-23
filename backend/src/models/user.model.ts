import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
    ADMIN = "ADMIN",
    DONOR = "DONOR",
    PATIENT = "PATIENT",
    HOSPITAL = "HOSPITAL",
}

// Blood Stock Type
// Blood Stock Interface (moved to bloodStock.model.ts)
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

export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;

    // Donor fields
    bloodGroup?: string;
    location?: {
        type: "Point";
        coordinates: [number, number];
    };
    isAvailable?: boolean;
    lastDonationDate?: Date;

    // Hospital fields
    hospitalName?: string;
    hospitalAddress?: string;
    licenseNumber?: string;

    // Common fields
    isVerified: boolean;
    isBlocked: boolean;
    impactPoints: number;
    rank: string;
    badges: string[];
    refreshToken?: string;
}



const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
        },

        //Donor Fields

        bloodGroup: {
            type: String,
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
            },
            coordinates: {
                type: [Number],
            },
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        lastDonationDate: {
            type: Date,
        },

        //Hospital Fields

        hospitalName: {
            type: String,
        },

        hospitalAddress: {
            type: String,
        },

        licenseNumber: {
            type: String,
        },



        //Common Fields

        isVerified: {
            type: Boolean,
            default: false,
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },
        impactPoints: {
            type: Number,
            default: 0,
        },
        rank: {
            type: String,
            default: "Novice",
        },
        badges: {
            type: [String],
            default: [],
        },

        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

// Geo Index
userSchema.index({ location: "2dsphere" });

export const User = mongoose.model<IUser>("User", userSchema);
