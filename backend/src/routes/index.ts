import { Router } from 'express';
import competitionRoutes from './competition.routes';
import { ApiResponse } from '../utils/apiResponse';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  return ApiResponse.success(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }, 'Feedants Competition API is up and running');
});

// Competition routes mounted at /api/competitions
router.use('/competitions', competitionRoutes);

export default router;
