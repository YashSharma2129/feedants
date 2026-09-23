import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, {
    message,
    code,
    statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  return ApiResponse.error(res, message, statusCode, code, err.details);
};
