import { Request, Response } from "express";
import {
    createEmergencyRequest,
    acceptEmergencyRequest,
    findNearbyEmergencyRequests,
    completeEmergencyRequest,
} from "../services/request.service";

interface CreateRequestBody {
    bloodGroup: string;
    latitude: number;
    longitude: number;
    urgencyLevel: "LOW" | "MEDIUM" | "HIGH";
}

export const createRequest = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { bloodGroup, latitude, longitude, urgencyLevel } =
            req.body as CreateRequestBody;

        const request = await createEmergencyRequest(
            req.user.id,
            bloodGroup,
            latitude,
            longitude,
            urgencyLevel
        );

        return res.status(201).json({
            success: true,
            data: request,
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
            message: "Failed to create request",
        });
    }
};

export const acceptRequest = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { requestId } = req.params;

        const updatedRequest = await acceptEmergencyRequest(
            requestId as string,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            data: updatedRequest,
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
            message: "Failed to accept request",
        });
    }
};

export const getNearbyRequests = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { latitude, longitude, radius, bloodGroup } =
            req.query as {
                latitude: string;
                longitude: string;
                radius: string;
                bloodGroup: string;
            };

        const requests = await findNearbyEmergencyRequests(
            Number(latitude),
            Number(longitude),
            Number(radius),
            bloodGroup
        );

        return res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
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
            message: "Failed to fetch requests",
        });
    }
};

export const completeRequest = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { requestId } = req.params;

        const result = await completeEmergencyRequest(
            requestId as string,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            data: result,
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
            message: "Failed to complete request",
        });
    }
};
