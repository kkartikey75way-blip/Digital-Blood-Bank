import { User, UserRole, IUser } from "../models/user.model";

interface DonorSearchParams {
    latitude?: number;
    longitude?: number;
    radiusInKm?: number;
    bloodGroup?: string;
    city?: string;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const searchDonors = async ({
    latitude,
    longitude,
    radiusInKm = 10,
    bloodGroup,
    city,
    isAvailable,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
}: DonorSearchParams) => {
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
        role: UserRole.DONOR,
        isVerified: true,
        isBlocked: false,
    };

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (isAvailable !== undefined) query.isAvailable = isAvailable;
    if (city) query.city = { $regex: city, $options: 'i' };

    // Geospatial Query
    if (latitude && longitude) {
        const radiusInMeters = radiusInKm * 1000;
        query.location = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
                $maxDistance: radiusInMeters,
            },
        };
    }

    const donors = await User.find(query)
        .select("-password -refreshToken")
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments(query);

    return {
        donors,
        total,
        page,
        pages: Math.ceil(total / limit),
    };
};

export const findNearbyDonors = async ({
    latitude,
    longitude,
    radiusInKm,
    bloodGroup,
}: {
    latitude: number;
    longitude: number;
    radiusInKm: number;
    bloodGroup: string;
}) => {
    const radiusInMeters = radiusInKm * 1000;

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const donors = await User.find({
        role: UserRole.DONOR,
        bloodGroup,
        isVerified: true,
        isBlocked: false,
        isAvailable: true,
        $or: [
            { lastDonationDate: { $lte: ninetyDaysAgo } },
            { lastDonationDate: null },
        ],
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
                $maxDistance: radiusInMeters,
            },
        },
    }).select("-password -refreshToken");

    return donors;
};
