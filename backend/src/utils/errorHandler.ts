import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';
import { AppError } from './response.utils';

export const globalErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = err;
    if (!(error instanceof AppError)) {
        const message = error instanceof Error ? error.message : "Unknown error";
        error = new AppError(message, 500);
    }

    const appError = error as AppError;
    appError.statusCode = appError.statusCode || 500;
    appError.status = appError.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        logger.error(`Error: ${appError.message}\nStack: ${appError.stack}`);
        res.status(appError.statusCode).json({
            success: false,
            status: appError.status,
            error: appError,
            message: appError.message,
            stack: appError.stack,
        });
    } else {
        // Production
        if (appError.isOperational) {
            res.status(appError.statusCode).json({
                success: false,
                status: appError.status,
                message: appError.message,
            });
        } else {
            logger.error('CRITICAL ERROR 💥', appError);
            res.status(500).json({
                success: false,
                status: 'error',
                message: 'Something went very wrong!',
            });
        }
    }
};
