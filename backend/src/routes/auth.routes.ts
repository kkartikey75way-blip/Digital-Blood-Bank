import { Router } from "express";
import { refreshToken, register, login, getProfile } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { authLimiter } from "../middlewares/rateLimit.middleware";
import { z } from "zod";

const refreshSchema = z.object({
    body: z.object({
        refreshToken: z.string(),
    }),
});

const router = Router();

router.post("/refresh", validate(refreshSchema), refreshToken);
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.get("/me", authenticate, getProfile);

export default router;
