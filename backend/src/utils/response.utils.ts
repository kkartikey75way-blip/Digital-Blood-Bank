import { Response } from "express";

export class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const sendError = (res: Response, message: string, statusCode: number = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        status: statusCode,
    });
};

export const sendSuccess = <T>(res: Response, data: T, message: string = "Success", statusCode: number = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
