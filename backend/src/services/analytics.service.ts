import { BloodRequest, RequestStatus } from "../models/request.model";
import { Donation } from "../models/donation.model";
import { User, UserRole } from "../models/user.model";
import { BloodStock, IBloodStock } from "../models/bloodStock.model";

export const getAdminAnalytics = async () => {
    // 1. Blood Group Distribution (from all active users/donors)
    const bloodGroupStats = await User.aggregate([
        { $match: { role: UserRole.DONOR } },
        { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);

    // 2. Request Trends (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const requestTrends = await BloodRequest.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // 3. Donation Stats (Completed)
    const totalDonations = await Donation.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({ status: RequestStatus.PENDING });
    const approvedRequests = await BloodRequest.countDocuments({ status: RequestStatus.APPROVED });

    return {
        bloodGroupDistribution: bloodGroupStats,
        requestTrends,
        overview: {
            totalDonations,
            pendingRequests,
            approvedRequests
        }
    };
};

export const getHospitalAnalytics = async (hospitalId: string) => {
    const hospital = await User.findById(hospitalId);
    if (!hospital) throw new Error("Hospital not found");

    // Monthly donation stats for this hospital (if we track which hospital fulfilled)
    // For now, let's show stock health
    const stockRecord = await BloodStock.findOne({ hospital: hospitalId });
    const stock = stockRecord ? {
        A_POS: stockRecord.A_POS,
        A_NEG: stockRecord.A_NEG,
        B_POS: stockRecord.B_POS,
        B_NEG: stockRecord.B_NEG,
        O_POS: stockRecord.O_POS,
        O_NEG: stockRecord.O_NEG,
        AB_POS: stockRecord.AB_POS,
        AB_NEG: stockRecord.AB_NEG,
    } : {};

    return {
        stock,
        recentActivity: await BloodRequest.find({ processedBy: hospitalId }).limit(5).sort({ updatedAt: -1 })
    };
};
