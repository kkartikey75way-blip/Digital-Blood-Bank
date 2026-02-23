import { User, UserRole } from "../models/user.model";
import { BloodStock, IBloodStock as IBloodStockModel } from "../models/bloodStock.model";
import { getLowStockGroups } from "../utils/stock.utils";
import { logActivity } from "./activity.service";
import { ActivityType } from "../models/activity.model";

// Simplified interface for internal weight matching
interface IBloodStock {
    A_POS: number;
    A_NEG: number;
    B_POS: number;
    B_NEG: number;
    O_POS: number;
    O_NEG: number;
    AB_POS: number;
    AB_NEG: number;
}

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
): Promise<IBloodStockModel> => {
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

    let stockRecord = await BloodStock.findOne({ hospital: hospitalId });

    if (!stockRecord) {
        stockRecord = new BloodStock({ hospital: hospitalId });
    }

    const updatedStock = (stockRecord.get(stockKey) || 0) + units;

    if (updatedStock < 0) {
        throw new Error("Blood stock cannot be negative");
    }

    stockRecord.set(stockKey, updatedStock);
    stockRecord.lastUpdated = new Date();

    await stockRecord.save();

    await logActivity(
        hospitalId,
        ActivityType.STOCK_UPDATE,
        "Stock Modified",
        `Updated ${bloodGroup} stock by ${units} units`
    );

    return stockRecord;
};

export const getBloodStock = async (
    hospitalId: string
) => {
    const hospital = await User.findById(hospitalId);

    if (!hospital || hospital.role !== UserRole.HOSPITAL) {
        throw new Error("Hospital not found");
    }

    let stockRecord = await BloodStock.findOne({ hospital: hospitalId });

    if (!stockRecord) {
        stockRecord = await BloodStock.create({ hospital: hospitalId });
    }

    const stock: IBloodStock = {
        A_POS: stockRecord.A_POS,
        A_NEG: stockRecord.A_NEG,
        B_POS: stockRecord.B_POS,
        B_NEG: stockRecord.B_NEG,
        O_POS: stockRecord.O_POS,
        O_NEG: stockRecord.O_NEG,
        AB_POS: stockRecord.AB_POS,
        AB_NEG: stockRecord.AB_NEG,
    };

    const lowStock = getLowStockGroups(stock);

    return {
        bloodStock: stock,
        lowStockGroups: lowStock,
        isVerified: hospital.isVerified,
    };
};
