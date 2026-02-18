import { Router } from "express";
import { refreshToken } from "../controllers/auth.controller";
import { register, login } from "../controllers/auth.controller";

const router = Router();

router.post("/refresh", refreshToken);
router.post("/register", register);
router.post("/login", login);

export default router;
