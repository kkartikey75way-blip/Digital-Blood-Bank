import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
    donor: mongoose.Types.ObjectId;
    patient: mongoose.Types.ObjectId;
    request: mongoose.Types.ObjectId;
    donatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
    {
        donor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        patient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        request: {
            type: Schema.Types.ObjectId,
            ref: "BloodRequest",
            required: true,
        },
        donatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const Donation = mongoose.model<IDonation>(
    "Donation",
    donationSchema
);
