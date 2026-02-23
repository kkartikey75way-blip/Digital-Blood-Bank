import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError } from "../utils/response.utils";

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessage = error.issues
                    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                    .join(", ");
                return sendError(res, errorMessage, 400);
            }
            return sendError(res, "Internal Server Error during validation", 500);
        }
    };
};
