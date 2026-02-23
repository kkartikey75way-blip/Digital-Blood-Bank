import mongoose, { Schema, Document } from "mongoose";

export interface IBloodStock extends Document {
    hospital: mongoose.Types.ObjectId;
    A_POS: number;
    A_NEG: number;
    B_POS: number;
    B_NEG: number;
    O_POS: number;
    O_NEG: number;
    AB_POS: number;
    AB_NEG: number;
    lastUpdated: Date;
}

const BloodStockSchema: Schema = new Schema(
    {
        hospital: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        A_POS: { type: Number, default: 0, min: 0 },
        A_NEG: { type: Number, default: 0, min: 0 },
        B_POS: { type: Number, default: 0, min: 0 },
        B_NEG: { type: Number, default: 0, min: 0 },
        O_POS: { type: Number, default: 0, min: 0 },
        O_NEG: { type: Number, default: 0, min: 0 },
        AB_POS: { type: Number, default: 0, min: 0 },
        AB_NEG: { type: Number, default: 0, min: 0 },
        lastUpdated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const BloodStock = mongoose.model<IBloodStock>("BloodStock", BloodStockSchema);
