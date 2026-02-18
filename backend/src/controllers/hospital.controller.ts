import { Request, Response } from "express";
import {
    updateBloodStock,
    getBloodStock,
} from "../services/hospital.service";

interface UpdateStockBody {
    bloodGroup: string;
    units: number;
}

export const updateStock = async (
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

        const { bloodGroup, units } =
            req.body as UpdateStockBody;

        const stock = await updateBloodStock(
            req.user.id,
            bloodGroup,
            units
        );

        return res.status(200).json({
            success: true,
            data: stock,
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
            message: "Failed to update stock",
        });
    }
};

export const viewStock = async (
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

        const stock = await getBloodStock(req.user.id);

        return res.status(200).json({
            success: true,
            data: stock,
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
            message: "Failed to fetch stock",
        });
    }
};
