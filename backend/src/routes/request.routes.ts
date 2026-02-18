import { Router } from "express";
import { createRequest, acceptRequest, getNearbyRequests, completeRequest } from "../controllers/request.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/user.model";
import { emergencyRequestLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(UserRole.PATIENT),
    emergencyRequestLimiter,
    createRequest
);
router.patch(
    "/:requestId/accept",
    authenticate,
    authorize(UserRole.DONOR),
    acceptRequest
);

router.get(
    "/nearby",
    authenticate,
    authorize(UserRole.DONOR),
    getNearbyRequests
);

router.patch(
    "/:requestId/complete",
    authenticate,
    authorize(UserRole.DONOR),
    completeRequest
);


export default router;
