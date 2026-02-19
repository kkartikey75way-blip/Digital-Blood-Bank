import { Request, Response } from "express";
import { Notification } from "../models/notification.model";
import { sendSuccess, sendError } from "../utils/response.utils";

export const getMyNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await Notification.find({ recipient: req.user?.id })
            .sort({ createdAt: -1 })
            .limit(50);

        return sendSuccess(res, notifications, "Notifications fetched successfully");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch notifications";
        return sendError(res, message);
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Notification.findOneAndUpdate(
            { _id: id, recipient: req.user?.id },
            { isRead: true }
        );
        return sendSuccess(res, null, "Notification marked as read");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to update notification";
        return sendError(res, message);
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        await Notification.updateMany(
            { recipient: req.user?.id, isRead: false },
            { isRead: true }
        );
        return sendSuccess(res, null, "All notifications marked as read");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to update notifications";
        return sendError(res, message);
    }
};
