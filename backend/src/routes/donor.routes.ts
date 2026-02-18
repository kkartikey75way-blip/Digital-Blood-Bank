import { Router } from "express";
import { searchNearbyDonors } from "../controllers/donor.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/search", authenticate, searchNearbyDonors);

export default router;
