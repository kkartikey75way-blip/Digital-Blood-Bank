import { Router } from "express";
import { refreshToken, register, login, getProfile } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { z } from "zod";

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        email: z.string().trim().email().toLowerCase(),
        phone: z.string().min(10),
        password: z.string().min(6),
        role: z.enum(["ADMIN", "DONOR", "PATIENT", "HOSPITAL"]),
        bloodGroup: z.string().optional(),
        hospitalName: z.string().optional(),
        licenseNumber: z.string().optional(),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().trim().email().toLowerCase(),
        password: z.string().min(6),
    }),
});

const refreshSchema = z.object({
    body: z.object({
        refreshToken: z.string(),
    }),
});

const router = Router();

router.post("/refresh", validate(refreshSchema), refreshToken);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, getProfile);

export default router;
