import { Request, Response } from "express";
import {
    getSystemStats,
    getBloodGroupDemand,
    getAllRequests,
} from "../services/admin.service";

export const systemStats = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const stats = await getSystemStats();

        return res.status(200).json({
            success: true,
            data: stats,
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
            message: "Failed to fetch stats",
        });
    }
};

export const bloodGroupAnalytics = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const data = await getBloodGroupDemand();

        return res.status(200).json({
            success: true,
            data,
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
            message: "Failed to fetch analytics",
        });
    }
};

export const viewAllRequests = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const requests = await getAllRequests();

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
