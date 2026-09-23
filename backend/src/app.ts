import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';
import { ApiResponse } from './utils/apiResponse';
import { env } from './config/env';

export const createApp = (): Application => {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN === '*' ? true : env.CLIENT_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-participant-id'],
    })
  );

  // Request logging
  if (!env.IS_TEST) {
    app.use(morgan('dev'));
  }

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root welcome route
  app.get('/', (req, res) => {
    return ApiResponse.success(
      res,
      {
        service: 'Feedants Competition API',
        documentation: '/api/competitions',
        health: '/api/health',
      },
      'Welcome to Feedants Competition Service'
    );
  });

  // Mount API router
  app.use('/api', apiRouter);

  // 404 handler for undefined routes
  app.use((req, res) => {
    return ApiResponse.error(
      res,
      `Route ${req.method} ${req.originalUrl} not found`,
      404,
      'ROUTE_NOT_FOUND'
    );
  });

  // Centralized Error handler
  app.use(errorHandler);

  return app;
};
