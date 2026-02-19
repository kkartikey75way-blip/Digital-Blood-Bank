import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
    user: mongoose.Types.ObjectId;
    action: string;
    category: "STOCK" | "REQUEST" | "USER" | "ADMIN";
    details: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    category: {
        type: String,
        enum: ["STOCK", "REQUEST", "USER", "ADMIN"],
        required: true
    },
    details: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const ActivityLog = mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
