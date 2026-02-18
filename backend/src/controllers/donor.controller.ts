import { Request, Response } from "express";
import { findNearbyDonors } from "../services/donor.service";

export const searchNearbyDonors = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const query = req.query as unknown;

        if (
            typeof query !== "object" ||
            query === null ||
            !("latitude" in query) ||
            !("longitude" in query) ||
            !("radius" in query) ||
            !("bloodGroup" in query)
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required query parameters",
            });
        }

        const { latitude, longitude, radius, bloodGroup } =
            query as {
                latitude: string;
                longitude: string;
                radius: string;
                bloodGroup: string;
            };

        if (
            !latitude ||
            !longitude ||
            !radius ||
            !bloodGroup
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid query parameters",
            });
        }

        const donors = await findNearbyDonors({
            latitude: Number(latitude),
            longitude: Number(longitude),
            radiusInKm: Number(radius),
            bloodGroup,
        });

        return res.status(200).json({
            success: true,
            count: donors.length,
            data: donors,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(400).json({
            success: false,
            message: "Failed to search donors",
        });
    }
};
