import { Request, Response } from "express";
import {
    createEmergencyRequest,
    acceptEmergencyRequest,
    findNearbyEmergencyRequests,
    completeEmergencyRequest,
    getUserRequests,
    approveRequest,
    rejectRequest,
    fulfillRequest,
    rejectDonor,
} from "../services/request.service";
import { sendSuccess, sendError } from "../utils/response.utils";

interface CreateRequestBody {
    bloodGroup: string;
    units: number;
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
            return sendError(res, "Unauthorized", 401);
        }

        const { bloodGroup, units, latitude, longitude, urgencyLevel } =
            req.body as CreateRequestBody;

        const request = await createEmergencyRequest(
            req.user.id,
            bloodGroup,
            units,
            latitude,
            longitude,
            urgencyLevel
        );

        return sendSuccess(res, request, "Request created successfully", 201);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to create request";
        return sendError(res, message);
    }
};

export const approveHospitalRequest = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user || req.user.role !== "HOSPITAL") {
            return sendError(res, "Unauthorized", 401);
        }

        const { requestId } = req.params;
        const request = await approveRequest(requestId as string, req.user.id);

        return sendSuccess(res, request, "Request approved and stock updated");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to approve request";
        return sendError(res, message);
    }
};

export const rejectHospitalRequest = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user) {
            return sendError(res, "Unauthorized", 401);
        }

        const { requestId } = req.params;
        const request = await rejectRequest(requestId as string, req.user.id);

        return sendSuccess(res, request, "Request rejected");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to reject request";
        return sendError(res, message);
    }
};

export const acceptRequest = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user) {
            return sendError(res, "Unauthorized", 401);
        }

        const { requestId } = req.params;

        const updatedRequest = await acceptEmergencyRequest(
            requestId as string,
            req.user.id
        );

        return sendSuccess(res, updatedRequest, "Request accepted");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to accept request";
        return sendError(res, message);
    }
};

export const getNearbyRequests = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user) {
            return sendError(res, "Unauthorized", 401);
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
            bloodGroup as string
        );

        return sendSuccess(res, requests, "Nearby requests fetched");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch requests";
        return sendError(res, message);
    }
};

export const rejectDonorController = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user) {
            return sendError(res, "Unauthorized", 401);
        }

        const { requestId } = req.params;

        const result = await rejectDonor(
            requestId as string,
            req.user.id
        );

        return sendSuccess(res, result, "Donor rejected successfully");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to reject donor";
        return sendError(res, message);
    }
};

export const completeRequest = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user) {
            return sendError(res, "Unauthorized", 401);
        }

        const { requestId } = req.params;

        const result = await completeEmergencyRequest(
            requestId as string,
            req.user.id
        );

        return sendSuccess(res, result, "Request completed");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to complete request";
        return sendError(res, message);
    }
};

export const viewMyRequests = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user) {
            return sendError(res, "Unauthorized", 401);
        }

        const requests = await getUserRequests(req.user.id);

        return sendSuccess(res, requests, "Your requests fetched");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch your requests";
        return sendError(res, message);
    }
};

export const fulfillHospitalRequest = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { requestId } = req.params;
        const hospitalId = req.user?.id;

        const request = await fulfillRequest(
            requestId as string,
            hospitalId as string
        );

        return sendSuccess(res, request, "Request marked as fulfilled");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Fulfillment failed";
        return sendError(res, message);
    }
};
