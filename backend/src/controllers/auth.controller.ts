import { Request, Response } from "express";
import {
    registerUser,
    loginUser,
    refreshAccessToken,
} from "../services/auth.service";
import { User, IUser } from "../models/user.model";

interface RegisterRequestBody extends Partial<IUser> { }

interface LoginRequestBody {
    email: string;
    password: string;
}

interface RefreshRequestBody {
    refreshToken: string;
}

export const refreshToken = async (
    req: Request<{}, {}, RefreshRequestBody>,
    res: Response
): Promise<Response> => {
    try {
        const { refreshToken } = req.body;

        const result = await refreshAccessToken(refreshToken);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};

export const register = async (
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response
): Promise<Response> => {
    try {
        const result = await registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
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
            message: "Registration failed",
        });
    }
};

export const login = async (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response
): Promise<Response> => {
    try {
        const { email, password } = req.body;

        const result = await loginUser(email, password);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
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
            message: "Login failed",
        });
    }
};
export const getProfile = async (
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

        const user = await User.findById(req.user.id).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch profile";
        return res.status(400).json({
            success: false,
            message,
        });
    }
};
