import rateLimit from "express-rate-limit";

export const emergencyRequestLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3,
    message: {
        success: false,
        message: "Too many emergency requests. Try again later.",
    },
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: {
        success: false,
        message: "Too many login/registration attempts. Try again later.",
    },
});

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: {
        success: false,
        message: "High request volume detected. Please slow down.",
    },
});
