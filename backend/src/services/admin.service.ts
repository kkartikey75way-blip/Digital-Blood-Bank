import { User, UserRole } from "../models/user.model";
import { BloodRequest, RequestStatus } from "../models/request.model";
import { BloodStock } from "../models/bloodStock.model";
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

interface PopulatedHospital {
    _id: string;
    hospitalName: string;
    isVerified: boolean;
    role: string;
}

export const getHospitalsWithLowStock = async () => {
    const stockRecords = await BloodStock.find().populate("hospital", "hospitalName isVerified role");

    const result = stockRecords
        .map((record) => {
            const hospital = record.hospital as unknown as PopulatedHospital;
            if (!hospital || hospital.role !== UserRole.HOSPITAL || !hospital.isVerified) return null;

            const stock = {
                A_POS: record.A_POS,
                A_NEG: record.A_NEG,
                B_POS: record.B_POS,
                B_NEG: record.B_NEG,
                O_POS: record.O_POS,
                O_NEG: record.O_NEG,
                AB_POS: record.AB_POS,
                AB_NEG: record.AB_NEG,
            };

            const lowStock = getLowStockGroups(stock);

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

export const getGeoDemandStats = async () => {
    const activeRequests = await BloodRequest.find({
        status: { $in: [RequestStatus.PENDING, RequestStatus.APPROVED] },
    }).select("location bloodGroup urgencyLevel");

    return activeRequests.map((req) => ({
        lat: req.location.coordinates[1],
        lng: req.location.coordinates[0],
        bloodGroup: req.bloodGroup,
        urgency: req.urgencyLevel,
        weight: req.urgencyLevel === "HIGH" ? 1.0 : req.urgencyLevel === "MEDIUM" ? 0.7 : 0.4,
    }));
};