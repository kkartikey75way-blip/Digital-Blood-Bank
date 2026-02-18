import { User, UserRole, IBloodStock } from "../models/user.model";

const bloodGroupMap: { [key: string]: keyof IBloodStock } = {
    "A+": "A_POS",
    "A-": "A_NEG",
    "B+": "B_POS",
    "B-": "B_NEG",
    "O+": "O_POS",
    "O-": "O_NEG",
    "AB+": "AB_POS",
    "AB-": "AB_NEG",
};

/* Update Blood Stock */
export const updateBloodStock = async (
    hospitalId: string,
    bloodGroup: string,
    units: number
) => {
    const hospital = await User.findById(hospitalId);

    if (!hospital || hospital.role !== UserRole.HOSPITAL) {
        throw new Error("Hospital not found");
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

    hospital.bloodStock[stockKey] =
        (hospital.bloodStock[stockKey] || 0) + units;

    // Use markModified if hospital.bloodStock is an object/subdocument
    hospital.markModified("bloodStock");
    await hospital.save();

    return hospital.bloodStock;
};

export const getBloodStock = async (hospitalId: string) => {
    const hospital = await User.findById(hospitalId);

    if (!hospital || hospital.role !== UserRole.HOSPITAL) {
        throw new Error("Hospital not found");
    }

    return hospital.bloodStock;
};
