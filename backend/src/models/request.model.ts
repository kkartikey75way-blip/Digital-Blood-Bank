import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "./user.model";

export enum RequestStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface IRequest extends Document {
    bloodGroup: string;
    patient: mongoose.Types.ObjectId;
    acceptedBy?: mongoose.Types.ObjectId;
    status: RequestStatus;
    urgencyLevel: "LOW" | "MEDIUM" | "HIGH";
    location: {
        type: "Point";
        coordinates: [number, number];
    };
}

const requestSchema = new Schema<IRequest>(
    {
        bloodGroup: {
            type: String,
            required: true,
        },

        patient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        acceptedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        status: {
            type: String,
            enum: Object.values(RequestStatus),
            default: RequestStatus.PENDING,
        },

        urgencyLevel: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            required: true,
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    { timestamps: true }
);

requestSchema.index({ location: "2dsphere" });

export const BloodRequest = mongoose.model<IRequest>(
    "BloodRequest",
    requestSchema
);
