import mongoose, { Schema, Document } from "mongoose";

export enum ActivityType {
    LOGIN = "LOGIN",
    STOCK_UPDATE = "STOCK_UPDATE",
    REQUEST_CREATED = "REQUEST_CREATED",
    REQUEST_PROCESSED = "REQUEST_PROCESSED",
    USER_REGISTERED = "USER_REGISTERED",
    HOSPITAL_VERIFIED = "HOSPITAL_VERIFIED",
}

export interface IActivityLog extends Document {
    user: mongoose.Types.ObjectId;
    type: ActivityType;
    action: string;
    description: string;
    ipAddress?: string;
    metadata?: Record<string, unknown>;
}

const activityLogSchema = new Schema<IActivityLog>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(ActivityType),
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        ipAddress: String,
        metadata: Schema.Types.Mixed,
    },
    { timestamps: true }
);

// Index for faster queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ type: 1 });

export const ActivityLog = mongoose.model<IActivityLog>(
    "ActivityLog",
    activityLogSchema
);
