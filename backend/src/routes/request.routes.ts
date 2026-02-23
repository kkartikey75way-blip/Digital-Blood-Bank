import { Router } from "express";
import { createRequest, acceptRequest, getNearbyRequests, completeRequest, viewMyRequests, approveHospitalRequest, rejectHospitalRequest, fulfillHospitalRequest, rejectDonorController } from "../controllers/request.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/user.model";
import { emergencyRequestLimiter } from "../middlewares/rateLimit.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createRequestSchema, nearbyRequestSchema } from "../validators/request.validator";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(UserRole.PATIENT, UserRole.HOSPITAL),
    emergencyRequestLimiter,
    validate(createRequestSchema),
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
    validate(nearbyRequestSchema),
    getNearbyRequests
);

router.patch(
    "/:requestId/complete",
    authenticate,
    authorize(UserRole.DONOR, UserRole.PATIENT, UserRole.ADMIN),
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
