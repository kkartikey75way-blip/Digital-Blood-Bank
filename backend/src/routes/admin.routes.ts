import { Router } from "express";
import {
    systemStats,
    bloodGroupAnalytics,
    viewAllRequests,
} from "../controllers/admin.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

router.get(
    "/stats",
    authenticate,
    authorize(UserRole.ADMIN),
    systemStats
);

router.get(
    "/analytics/blood-demand",
    authenticate,
    authorize(UserRole.ADMIN),
    bloodGroupAnalytics
);

router.get(
    "/requests",
    authenticate,
    authorize(UserRole.ADMIN),
    viewAllRequests
);

export default router;
