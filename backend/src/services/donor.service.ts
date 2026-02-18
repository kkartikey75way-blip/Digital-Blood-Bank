import { User, UserRole } from "../models/user.model";

interface GeoSearchParams {
    latitude: number;
    longitude: number;
    radiusInKm: number;
    bloodGroup: string;
}

export const findNearbyDonors = async ({
    latitude,
    longitude,
    radiusInKm,
    bloodGroup,
}: GeoSearchParams) => {
    const radiusInMeters = radiusInKm * 1000;

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const donors = await User.find({
        role: UserRole.DONOR,
        bloodGroup,
        isVerified: true,
        isBlocked: false,
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
