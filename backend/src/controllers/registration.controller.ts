import { Request, Response, NextFunction } from 'express';
import { RegistrationService } from '../services/registration.service';
import { ApiResponse } from '../utils/apiResponse';

export class RegistrationController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { participantId, participantName, participantEmail, paymentDetails } = req.body;

      const effectiveParticipantId =
        participantId || (req.headers['x-participant-id'] as string);

      if (!effectiveParticipantId) {
        return ApiResponse.error(
          res,
          'Participant ID is required for registration.',
          400,
          'MISSING_PARTICIPANT_ID'
        );
      }

      const result = await RegistrationService.registerParticipant({
        competitionId: id,
        participantId: effectiveParticipantId,
        participantName,
        participantEmail,
        paymentDetails,
      });

      return ApiResponse.created(
        res,
        result,
        'Successfully registered for the competition!'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const participantId =
        (req.query.participantId as string) ||
        (req.headers['x-participant-id'] as string);

      if (!participantId) {
        return ApiResponse.error(
          res,
          'Participant ID is required to fetch registration status.',
          400,
          'MISSING_PARTICIPANT_ID'
        );
      }

      const status = await RegistrationService.getRegistrationStatus(id, participantId);
      return ApiResponse.success(
        res,
        status,
        'Registration status retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async submitEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { participantId, mediaUrl, notes } = req.body;

      const effectiveParticipantId =
        participantId || (req.headers['x-participant-id'] as string);

      if (!effectiveParticipantId) {
        return ApiResponse.error(
          res,
          'Participant ID is required.',
          400,
          'MISSING_PARTICIPANT_ID'
        );
      }

      if (!mediaUrl) {
        return ApiResponse.error(
          res,
          'Video media URL is required.',
          400,
          'MISSING_MEDIA_URL'
        );
      }

      const registration = await RegistrationService.submitEntry(
        id,
        effectiveParticipantId,
        mediaUrl,
        notes
      );

      return ApiResponse.success(
        res,
        registration,
        'Performance entry submitted successfully!'
      );
    } catch (error) {
      next(error);
    }
  }
}
