import { Request, Response } from "express";
import { getAdminAnalytics, getHospitalAnalytics } from "../services/analytics.service";
import { sendSuccess, sendError } from "../utils/response.utils";
import { UserRole } from "../models/user.model";

export const fetchAdminAnalytics = async (req: Request, res: Response) => {
    try {
        if (!req.user || req.user.role !== UserRole.ADMIN) {
            return sendError(res, "Unauthorized", 401);
        }
        const analytics = await getAdminAnalytics();
        return sendSuccess(res, analytics, "Admin analytics fetched successfully");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch analytics";
        return sendError(res, message);
    }
};

export const fetchHospitalAnalytics = async (req: Request, res: Response) => {
    try {
        if (!req.user || req.user.role !== UserRole.HOSPITAL) {
            return sendError(res, "Unauthorized", 401);
        }
        const analytics = await getHospitalAnalytics(req.user.id);
        return sendSuccess(res, analytics, "Hospital analytics fetched successfully");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch analytics";
        return sendError(res, message);
    }
};
