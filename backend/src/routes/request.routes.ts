import { Router } from "express";
import { createRequest, acceptRequest, getNearbyRequests, completeRequest } from "../controllers/request.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/user.model";
import { emergencyRequestLimiter } from "../middlewares/rateLimit.middleware";
import { validate } from "../middlewares/validate.middleware";
import { z } from "zod";

const createEmergencySchema = z.object({
    body: z.object({
        bloodGroup: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
    }),
});

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(UserRole.PATIENT),
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

export default router;
