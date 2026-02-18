import { Router } from "express";
import { donorHistory } from "../controllers/donation.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

router.get(
    "/my-history",
    authenticate,
    authorize(UserRole.DONOR),
    donorHistory
);

export default router;
