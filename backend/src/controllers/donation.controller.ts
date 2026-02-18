import { Request, Response } from "express";
import { getDonorHistory } from "../services/donation.service";

export const donorHistory = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const history = await getDonorHistory(req.user.id);

        return res.status(200).json({
            success: true,
            count: history.length,
            data: history,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(400).json({
            success: false,
            message: "Failed to fetch history",
        });
    }
};
