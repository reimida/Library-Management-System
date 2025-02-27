import { Request, Response, NextFunction } from 'express';
import { handleControllerError } from './controllerUtils';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((error) => {
        handleControllerError(error, res);
    });
}; 