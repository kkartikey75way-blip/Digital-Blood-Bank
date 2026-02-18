import { Router } from "express";
import {
    updateStock,
    viewStock,
} from "../controllers/hospital.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/user.model";

const router = Router();

router.patch(
    "/stock",
    authenticate,
    authorize(UserRole.HOSPITAL),
    updateStock
);

router.get(
    "/stock",
    authenticate,
    authorize(UserRole.HOSPITAL),
    viewStock
);

export default router;
