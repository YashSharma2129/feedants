import { Response } from 'express';

export interface ApiResponsePayload<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  meta?: Record<string, any>;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: Record<string, any>
  ) {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Created successfully',
    meta?: Record<string, any>
  ) {
    return this.success(res, data, message, 201, meta);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 400,
    code: string = 'BAD_REQUEST',
    details?: any
  ) {
    const payload: ApiResponsePayload<null> = {
      success: false,
      message,
      error: {
        code,
        details,
      },
    };
    return res.status(statusCode).json(payload);
  }
}
