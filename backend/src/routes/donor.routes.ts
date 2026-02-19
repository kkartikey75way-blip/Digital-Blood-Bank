import { Router } from "express";
import { searchNearbyDonors, searchAllDonors } from "../controllers/donor.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/search", authenticate, searchNearbyDonors);
router.get("/search-all", authenticate, searchAllDonors);

export default router;
