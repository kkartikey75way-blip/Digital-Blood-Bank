import mongoose, { Schema, Document } from "mongoose";

export enum NotificationType {
    REQUEST_CREATED = "REQUEST_CREATED",
    REQUEST_APPROVED = "REQUEST_APPROVED",
    REQUEST_REJECTED = "REQUEST_REJECTED",
    URGENT_NEARBY = "URGENT_NEARBY",
    DONATION_COOLDOWN_OVER = "DONATION_COOLDOWN_OVER",
}

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    relatedId?: mongoose.Types.ObjectId; // Request ID or Donation ID
}

const notificationSchema = new Schema<INotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        relatedId: {
            type: Schema.Types.ObjectId,
        },
    },
    { timestamps: true }
);

export const Notification = mongoose.model<INotification>(
    "Notification",
    notificationSchema
);
