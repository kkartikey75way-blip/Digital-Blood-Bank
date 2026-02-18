import { User, UserRole, IBloodStock } from "../models/user.model";
import { getLowStockGroups } from "../utils/stock.utils";

const bloodGroupMap: Record<string, keyof IBloodStock> = {
    "A+": "A_POS",
    "A-": "A_NEG",
    "B+": "B_POS",
    "B-": "B_NEG",
    "O+": "O_POS",
    "O-": "O_NEG",
    "AB+": "AB_POS",
    "AB-": "AB_NEG",
};

export const updateBloodStock = async (
    hospitalId: string,
    bloodGroup: string,
    units: number
): Promise<IBloodStock | undefined> => {
    if (!Number.isFinite(units)) {
        throw new Error("Invalid units value");
    }

    const hospital = await User.findById(hospitalId);

    if (!hospital || hospital.role !== UserRole.HOSPITAL) {
        throw new Error("Hospital not found");
    }

    if (!hospital.isVerified) {
        throw new Error("Hospital not verified by admin");
    }

    if (hospital.isBlocked) {
        throw new Error("Hospital account is blocked");
    }

    const stockKey = bloodGroupMap[bloodGroup];

    if (!stockKey) {
        throw new Error("Invalid blood group");
    }

    if (!hospital.bloodStock) {
        hospital.bloodStock = {
            A_POS: 0,
            A_NEG: 0,
            B_POS: 0,
            B_NEG: 0,
            O_POS: 0,
            O_NEG: 0,
            AB_POS: 0,
            AB_NEG: 0,
        };
    }

    const updatedStock =
        (hospital.bloodStock[stockKey] || 0) + units;

    if (updatedStock < 0) {
        throw new Error("Blood stock cannot be negative");
    }

    hospital.bloodStock[stockKey] = updatedStock;

    hospital.markModified("bloodStock");

    await hospital.save();

    return hospital.bloodStock;
};

export const getBloodStock = async (
    hospitalId: string
) => {
    const hospital = await User.findById(hospitalId);

    if (!hospital || hospital.role !== UserRole.HOSPITAL) {
        throw new Error("Hospital not found");
    }

    if (!hospital.isVerified) {
        throw new Error("Hospital not verified by admin");
    }

    const lowStock = getLowStockGroups(hospital.bloodStock);

    return {
        bloodStock: hospital.bloodStock,
        lowStockGroups: lowStock,
    };
};
