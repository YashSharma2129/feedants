import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiResponse } from '../utils/apiResponse';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Replace with sanitized/parsed values
      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return ApiResponse.error(
          res,
          'Validation failed',
          400,
          'VALIDATION_ERROR',
          formattedErrors
        );
      }
      return next(error);
    }
  };
};
