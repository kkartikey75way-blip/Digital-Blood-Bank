import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
// @ts-ignore

import authRoutes from "./routes/auth.routes";
import donorRoutes from "./routes/donor.routes";
import requestRoutes from "./routes/request.routes";
import hospitalRoutes from "./routes/hospital.routes";
import adminRoutes from "./routes/admin.routes";
import donationRoutes from "./routes/donation.routes";
import analyticsRoutes from "./routes/analytics.routes";
import notificationRoutes from "./routes/notification.routes";
import { globalErrorHandler } from "./utils/errorHandler";
import { AppError } from "./utils/response.utils";
import { logger } from "./utils/logger";

const app = express();

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
});

// Middlewares
app.use(helmet()); // Security headers
app.use(cors()); // CORS
app.use(express.json({ limit: '10kb' })); // Body parser, limit data
app.use(hpp()); // Prevent parameter pollution

if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
}

app.use(limiter);

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
app.use("/api/admin", adminRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Middleware
app.use(globalErrorHandler);

export default app;
