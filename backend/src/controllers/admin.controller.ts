import { Request, Response } from "express";
import {
    getSystemStats,
    getBloodGroupDemand,
    getAllRequests,
} from "../services/admin.service";
import {
    getPendingHospitals,
    approveHospital,
    rejectHospital,
} from "../services/admin.hospital.service";
import { getHospitalsWithLowStock } from "../services/admin.service";

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

export const viewPendingHospitals = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const hospitals = await getPendingHospitals();

        return res.status(200).json({
            success: true,
            count: hospitals.length,
            data: hospitals,
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
            message: "Failed to fetch hospitals",
        });
    }
};

export const approveHospitalController = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { hospitalId } = req.params;

        const hospital = await approveHospital(hospitalId as string);

        return res.status(200).json({
            success: true,
            data: hospital,
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
            message: "Approval failed",
        });
    }
};

export const rejectHospitalController = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { hospitalId } = req.params;

        const result = await rejectHospital(hospitalId as string);

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
            message: "Rejection failed",
        });
    }
};

export const lowStockHospitals = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const hospitals = await getHospitalsWithLowStock();

        return res.status(200).json({
            success: true,
            count: hospitals.length,
            data: hospitals,
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
            message: "Failed to fetch low stock hospitals",
        });
    }
};
