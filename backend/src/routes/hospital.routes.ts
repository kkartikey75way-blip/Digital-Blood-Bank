import { Router } from "express";
import {
    updateStock,
    viewStock,
} from "../controllers/hospital.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/user.model";
import { validate } from "../middlewares/validate.middleware";
import { updateStockSchema } from "../validators/hospital.validator";

const router = Router();

router.patch(
    "/stock",
    authenticate,
    authorize(UserRole.HOSPITAL),
    validate(updateStockSchema),
    updateStock
);

router.get(
    "/stock",
    authenticate,
    authorize(UserRole.HOSPITAL),
    viewStock
);

export default router;
