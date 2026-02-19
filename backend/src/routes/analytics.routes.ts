import { Router } from "express";
import { fetchAdminAnalytics, fetchHospitalAnalytics } from "../controllers/analytics.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

router.get("/admin", authenticate, authorize(UserRole.ADMIN), fetchAdminAnalytics);
router.get("/hospital", authenticate, authorize(UserRole.HOSPITAL), fetchHospitalAnalytics);

export default router;
