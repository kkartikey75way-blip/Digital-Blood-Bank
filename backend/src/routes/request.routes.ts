import { Router } from "express";
import { createRequest, acceptRequest, getNearbyRequests, completeRequest, viewMyRequests, approveHospitalRequest, rejectHospitalRequest, fulfillHospitalRequest, rejectDonorController } from "../controllers/request.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/user.model";
import { emergencyRequestLimiter } from "../middlewares/rateLimit.middleware";
import { validate } from "../middlewares/validate.middleware";
import { z } from "zod";

const createEmergencySchema = z.object({
    body: z.object({
        bloodGroup: z.string(),
        units: z.number().min(1),
        latitude: z.number(),
        longitude: z.number(),
        urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
    }),
});

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(UserRole.PATIENT, UserRole.HOSPITAL),
    emergencyRequestLimiter,
    validate(createEmergencySchema),
    createRequest
);
router.patch(
    "/:requestId/accept",
    authenticate,
    authorize(UserRole.DONOR, UserRole.ADMIN),
    acceptRequest
);

router.get(
    "/nearby",
    authenticate,
    authorize(UserRole.DONOR, UserRole.ADMIN),
    getNearbyRequests
);

router.patch(
    "/:requestId/complete",
    authenticate,
    authorize(UserRole.DONOR, UserRole.ADMIN),
    completeRequest
);

router.patch(
    "/:requestId/reject-donor",
    authenticate,
    authorize(UserRole.PATIENT),
    rejectDonorController
);

router.patch(
    "/:requestId/approve",
    authenticate,
    authorize(UserRole.HOSPITAL),
    approveHospitalRequest
);

router.patch(
    "/:requestId/reject",
    authenticate,
    authorize(UserRole.HOSPITAL),
    rejectHospitalRequest
);

router.patch(
    "/:requestId/fulfill",
    authenticate,
    authorize(UserRole.HOSPITAL),
    fulfillHospitalRequest
);

router.get(
    "/my-requests",
    authenticate,
    authorize(UserRole.PATIENT),
    viewMyRequests
);

export default router;
