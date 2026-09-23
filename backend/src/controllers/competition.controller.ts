import { Request, Response, NextFunction } from 'express';
import { CompetitionService } from '../services/competition.service';
import { ApiResponse } from '../utils/apiResponse';

export class CompetitionController {
  static async getCompetition(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const participantId = (req.query.participantId as string) || (req.headers['x-participant-id'] as string);

      const competition = await CompetitionService.getCompetitionByIdOrSlug(id, participantId);
      return ApiResponse.success(res, competition, 'Competition details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async listCompetitions(req: Request, res: Response, next: NextFunction) {
    try {
      const competitions = await CompetitionService.listCompetitions();
      return ApiResponse.success(res, competitions, 'Competitions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
