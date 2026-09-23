import { Router } from 'express';
import { z } from 'zod';
import { CompetitionController } from '../controllers/competition.controller';
import { RegistrationController } from '../controllers/registration.controller';
import { validateRequest } from '../middleware/validate';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    participantId: z.string().min(1, 'Participant ID must not be empty').optional(),
    participantName: z.string().min(2, 'Name must be at least 2 characters').optional(),
    participantEmail: z.string().email('Invalid email address').optional(),
    paymentDetails: z
      .object({
        transactionId: z.string().optional(),
        amount: z.number().optional(),
      })
      .optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Competition ID is required'),
  }),
});

const getCompetitionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Competition ID is required'),
  }),
  query: z.object({
    participantId: z.string().optional(),
  }),
});

const getStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Competition ID is required'),
  }),
  query: z.object({
    participantId: z.string().optional(),
  }),
});

// List all active competitions
router.get('/', CompetitionController.listCompetitions);

// Get competition details (including spots, countdown, lifecycle, and participant registration status)
router.get('/:id', validateRequest(getCompetitionSchema), CompetitionController.getCompetition);

// Register a participant for a competition
router.post('/:id/register', validateRequest(registerSchema), RegistrationController.register);

// Get registration status for a participant
router.get('/:id/registration-status', validateRequest(getStatusSchema), RegistrationController.getStatus);

// Submit video entry for a registered participant
router.post('/:id/submission', RegistrationController.submitEntry);

export default router;
