import dotenv from "dotenv";

dotenv.config();

if (
    !process.env.JWT_ACCESS_SECRET ||
    !process.env.JWT_REFRESH_SECRET ||
    !process.env.ACCESS_TOKEN_EXPIRES ||
    !process.env.REFRESH_TOKEN_EXPIRES
) {
    throw new Error("Missing required environment variables");
}

export const ENV = {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES,
};
