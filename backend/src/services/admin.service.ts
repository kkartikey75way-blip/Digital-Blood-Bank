import { User, UserRole } from "../models/user.model";
import { BloodRequest, RequestStatus } from "../models/request.model";
import { getLowStockGroups } from "../utils/stock.utils";

export const getSystemStats = async () => {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: UserRole.DONOR });
    const activeDonors = await User.countDocuments({
        role: UserRole.DONOR,
        isAvailable: true,
    });

    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({
        status: RequestStatus.PENDING,
    });
    const completedRequests = await BloodRequest.countDocuments({
        status: RequestStatus.COMPLETED,
    });

    return {
        totalUsers,
        totalDonors,
        activeDonors,
        totalRequests,
        pendingRequests,
        completedRequests,
    };
};

export const getBloodGroupDemand = async () => {
    const demand = await BloodRequest.aggregate([
        {
            $group: {
                _id: "$bloodGroup",
                count: { $sum: 1 },
            },
        },
        {
            $sort: { count: -1 },
        },
    ]);

    return demand;
};

export const getAllRequests = async () => {
    const requests = await BloodRequest.find()
        .populate("patient", "name phone")
        .populate("acceptedBy", "name phone")
        .sort({ createdAt: -1 });

    return requests;
};

export const getHospitalsWithLowStock = async () => {
    const hospitals = await User.find({
        role: UserRole.HOSPITAL,
        isVerified: true,
    }).select("-password -refreshToken");

    const result = hospitals
        .map((hospital) => {
            const lowStock = getLowStockGroups(
                hospital.bloodStock
            );

            if (lowStock.length > 0) {
                return {
                    hospitalId: hospital._id,
                    hospitalName: hospital.hospitalName,
                    lowStockGroups: lowStock,
                };
            }

            return null;
        })
        .filter(Boolean);

    return result;
};