import { Router } from "express";
import {
    systemStats,
    bloodGroupAnalytics,
    viewAllRequests,
} from "../controllers/admin.controller";
import {
    viewPendingHospitals,
    approveHospitalController,
    rejectHospitalController,
    lowStockHospitals,
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

router.get(
    "/hospitals/pending",
    authenticate,
    authorize(UserRole.ADMIN),
    viewPendingHospitals
);

router.patch(
    "/hospitals/:hospitalId/approve",
    authenticate,
    authorize(UserRole.ADMIN),
    approveHospitalController
);

router.delete(
    "/hospitals/:hospitalId/reject",
    authenticate,
    authorize(UserRole.ADMIN),
    rejectHospitalController
);

router.get(
    "/hospitals/low-stock",
    authenticate,
    authorize(UserRole.ADMIN),
    lowStockHospitals
);



export default router;
