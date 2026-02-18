import { User, UserRole } from "../models/user.model";

export const getPendingHospitals = async () => {
    const hospitals = await User.find({
        role: UserRole.HOSPITAL,
        isVerified: false,
    }).select("-password -refreshToken");

    return hospitals;
};

export const approveHospital = async (hospitalId: string) => {
    const hospital = await User.findById(hospitalId);

    if (!hospital || hospital.role !== UserRole.HOSPITAL) {
        throw new Error("Hospital not found");
    }

    hospital.isVerified = true;
    await hospital.save();

    return hospital;
};

export const rejectHospital = async (hospitalId: string) => {
    const hospital = await User.findById(hospitalId);

    if (!hospital || hospital.role !== UserRole.HOSPITAL) {
        throw new Error("Hospital not found");
    }

    await hospital.deleteOne();

    return { message: "Hospital rejected and removed" };
};
