import { ActivityLog, IActivityLog } from "../models/activityLog.model";
import { logger } from "../utils/logger";

export const logActivity = async (
    userId: string,
    action: string,
    category: "STOCK" | "REQUEST" | "USER" | "ADMIN",
    details: string,
    metadata?: Record<string, unknown>
) => {
    try {
        await ActivityLog.create({
            user: userId,
            action,
            category,
            details,
            metadata,
        });
    } catch (error) {
        logger.error("Failed to log activity:", error);
    }
};

export const getActivityLogs = async (filters: Record<string, unknown> = {}, page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;
    const logs = await ActivityLog.find(filters)
        .populate("user", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await ActivityLog.countDocuments(filters);

    return {
        logs,
        total,
        page,
        pages: Math.ceil(total / limit),
    };
};
