import { Request, Response } from "express";
import { findNearbyDonors, searchDonors } from "../services/donor.service";
import { sendSuccess, sendError } from "../utils/response.utils";

export const searchAllDonors = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const {
            latitude,
            longitude,
            radius,
            bloodGroup,
            city,
            isAvailable,
            page,
            limit,
            sortBy,
            sortOrder,
        } = req.query;

        const results = await searchDonors({
            latitude: latitude ? Number(latitude) : undefined,
            longitude: longitude ? Number(longitude) : undefined,
            radiusInKm: radius ? Number(radius) : undefined,
            bloodGroup: bloodGroup as string,
            city: city as string,
            isAvailable: isAvailable === 'true' ? true : isAvailable === 'false' ? false : undefined,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
            sortBy: sortBy as string,
            sortOrder: sortOrder as 'asc' | 'desc',
        });

        return sendSuccess(res, results, "Donors fetched successfully");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to search donors";
        return sendError(res, message);
    }
};

export const searchNearbyDonors = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { latitude, longitude, radius, bloodGroup } = req.query;

        if (!latitude || !longitude || !radius || !bloodGroup) {
            return sendError(res, "Missing required geospatial parameters", 400);
        }

        const donors = await findNearbyDonors({
            latitude: Number(latitude),
            longitude: Number(longitude),
            radiusInKm: Number(radius),
            bloodGroup: bloodGroup as string,
        });

        return sendSuccess(res, donors, "Nearby donors fetched successfully");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to search nearby donors";
        return sendError(res, message);
    }
};
