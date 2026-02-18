import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import donorRoutes from "./routes/donor.routes";
import requestRoutes from "./routes/request.routes";
import hospitalRoutes from "./routes/hospital.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
});

// Middlewares
app.use(limiter);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Health Route
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Blood Bank API Running !!",
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/hospitals", hospitalRoutes);

// Error Middleware
app.use(errorMiddleware);

export default app;
