import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue } from "ms"
import { ENV } from "../config/env";

export const generateAccessToken = (
    userId: string,
    role: string
): string => {
    const options: SignOptions = {
        expiresIn: ENV.ACCESS_TOKEN_EXPIRES as StringValue,
    };

    return jwt.sign(
        { id: userId, role },
        ENV.JWT_ACCESS_SECRET,
        options
    );
};

export const generateRefreshToken = (userId: string): string => {
    const options: SignOptions = {
        expiresIn: ENV.REFRESH_TOKEN_EXPIRES as StringValue,
    };

    return jwt.sign(
        { id: userId },
        ENV.JWT_REFRESH_SECRET,
        options
    );
};
