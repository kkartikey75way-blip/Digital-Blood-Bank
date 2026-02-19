import { ActivityLog, ActivityType } from "../models/activity.model";

export const logActivity = async (
    userId: string,
    type: ActivityType,
    action: string,
    description: string,
    ipAddress?: string,
    metadata?: Record<string, unknown>
) => {
    try {
        await ActivityLog.create({
            user: userId,
            type,
            action,
            description,
            ipAddress,
            metadata,
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

export const getRecentLogs = async (limit: number = 50) => {
    return ActivityLog.find()
        .populate("user", "name role")
        .sort({ createdAt: -1 })
        .limit(limit);
};
