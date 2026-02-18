import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { UserRole } from "../models/user.model";

interface AccessTokenPayload {
    id: string;
    role: UserRole;
    iat: number;
    exp: number;
}
export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            ENV.JWT_ACCESS_SECRET
        ) as AccessTokenPayload;

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
export const authorize = (...allowedRoles: UserRole[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Access denied",
            });
        }

        next();
    };
};
