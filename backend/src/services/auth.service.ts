import bcrypt from "bcrypt";
import { User, IUser } from "../models/user.model";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/jwt";
import jwt from "jsonwebtoken";
import { logActivity } from "./activity.service";
import { ActivityType } from "../models/activity.model";

interface RefreshTokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export const refreshAccessToken = async (token: string) => {
    if (!token) {
        throw new Error("Refresh token required");
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
    ) as RefreshTokenPayload;

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
        throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(
        user._id.toString(),
        user.role
    );

    return { accessToken: newAccessToken };
};


interface RegisterData extends Partial<IUser> {
    latitude?: number;
    longitude?: number;
}

export const registerUser = async (data: RegisterData) => {
    const normalizedEmail = data.email?.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password as string, 10);

    const userData: RegisterData & { location?: { type: string; coordinates: number[] } } = {
        ...data,
        password: hashedPassword,
    };

    if (data.latitude && data.longitude) {
        userData.location = {
            type: "Point",
            coordinates: [data.longitude, data.latitude],
        };
        delete userData.latitude;
        delete userData.longitude;
    }

    const user = await User.create(userData);

    const accessToken = generateAccessToken(
        user._id.toString(),
        user.role
    );

    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken(
        user._id.toString(),
        user.role
    );

    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    await logActivity(
        user._id.toString(),
        ActivityType.LOGIN,
        "Login",
        `User ${user.email} logged in successfully`
    );

    return { user, accessToken, refreshToken };
};
