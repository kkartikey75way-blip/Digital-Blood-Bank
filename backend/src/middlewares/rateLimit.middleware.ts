import rateLimit from "express-rate-limit";

export const emergencyRequestLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: "Too many emergency requests. Try again later.",
    },
});
