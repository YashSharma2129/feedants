import mongoose from 'mongoose';
import { Competition } from '../models/competition.model';
import { Registration, IRegistration } from '../models/registration.model';
import {
  calculateLifecycleStatus,
  calculateRegistrationEligibility,
} from '../utils/lifecycle';

export interface RegisterParticipantDTO {
  competitionId: string;
  participantId: string;
  participantName?: string;
  participantEmail?: string;
  paymentDetails?: {
    transactionId?: string;
    amount?: number;
  };
}

export interface RegistrationResult {
  registration: IRegistration;
  competition: {
    id: string;
    title: string;
    participantCount: number;
    capacity: number;
    spotsRemaining: number;
  };
}

export class RegistrationService {
  /**
   * Registers a participant using atomic conditional operations
   * to guarantee zero overbooking under high concurrent load.
   */
  static async registerParticipant(dto: RegisterParticipantDTO): Promise<RegistrationResult> {
    const { competitionId, participantId, participantName, participantEmail } = dto;

    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      const err: any = new Error('Invalid competition ID format.');
      err.statusCode = 400;
      err.code = 'INVALID_COMPETITION_ID';
      throw err;
    }

    // 1. Fetch competition to inspect constraints
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      const err: any = new Error(`Competition with ID '${competitionId}' does not exist.`);
      err.statusCode = 404;
      err.code = 'COMPETITION_NOT_FOUND';
      throw err;
    }

    const now = new Date();

    // 2. Validate lifecycle constraints
    if (competition.status !== 'published') {
      const err: any = new Error(`Competition is not open for registration (status: ${competition.status}).`);
      err.statusCode = 400;
      err.code = 'COMPETITION_NOT_ACTIVE';
      throw err;
    }

    if (now < new Date(competition.registrationStartAt)) {
      const err: any = new Error('Registration has not opened yet.');
      err.statusCode = 400;
      err.code = 'REGISTRATION_NOT_STARTED';
      throw err;
    }

    if (now >= new Date(competition.registrationEndAt)) {
      const err: any = new Error('Registration deadline has passed.');
      err.statusCode = 400;
      err.code = 'REGISTRATION_CLOSED';
      throw err;
    }

    // 3. Early check for duplicate registration
    const existingRegistration = await Registration.findOne({
      competitionId: competition._id,
      participantId,
      status: { $in: ['confirmed', 'waitlisted'] },
    });

    if (existingRegistration) {
      const err: any = new Error('You are already registered for this competition.');
      err.statusCode = 409;
      err.code = 'DUPLICATE_REGISTRATION';
      throw err;
    }

    // 4. ATOMIC CONCURRENCY CONTROL:
    // Atomically increment participantCount ONLY IF participantCount < capacity.
    // MongoDB guarantees atomic update per document, eliminating race conditions.
    const reservedCompetition = await Competition.findOneAndUpdate(
      {
        _id: competition._id,
        participantCount: { $lt: competition.capacity },
        registrationStartAt: { $lte: now },
        registrationEndAt: { $gt: now },
        status: 'published',
      },
      { $inc: { participantCount: 1 } },
      { new: true }
    );

    if (!reservedCompetition) {
      // Re-query to determine exact failure cause
      const latestState = await Competition.findById(competition._id);
      if (latestState && latestState.participantCount >= latestState.capacity) {
        const err: any = new Error('Competition has reached full capacity. No spots remaining.');
        err.statusCode = 409;
        err.code = 'COMPETITION_FULL';
        throw err;
      }
      const err: any = new Error('Registration is no longer available.');
      err.statusCode = 400;
      err.code = 'REGISTRATION_UNAVAILABLE';
      throw err;
    }

    // 5. Create Registration document (protected by database unique compound index)
    try {
      const registration = await Registration.create({
        competitionId: competition._id,
        participantId,
        participantName: participantName || `Participant ${participantId}`,
        participantEmail,
        status: 'confirmed',
        registeredAt: now,
        paymentDetails: {
          transactionId: dto.paymentDetails?.transactionId || `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          amount: competition.entryFee,
          currency: competition.currency || 'INR',
          status: 'paid',
        },
      });

      return {
        registration,
        competition: {
          id: reservedCompetition._id.toString(),
          title: reservedCompetition.title,
          participantCount: reservedCompetition.participantCount,
          capacity: reservedCompetition.capacity,
          spotsRemaining: Math.max(0, reservedCompetition.capacity - reservedCompetition.participantCount),
        },
      };
    } catch (insertError: any) {
      // If insertion fails due to race-condition duplicate key error (code 11000),
      // roll back the atomically reserved spot immediately!
      await Competition.updateOne(
        { _id: competition._id },
        { $inc: { participantCount: -1 } }
      );

      if (insertError.code === 11000) {
        const err: any = new Error('Duplicate registration detected for this participant.');
        err.statusCode = 409;
        err.code = 'DUPLICATE_REGISTRATION';
        throw err;
      }

      throw insertError;
    }
  }

  static async getRegistrationStatus(
    competitionId: string,
    participantId: string
  ) {
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      const err: any = new Error('Invalid competition ID format.');
      err.statusCode = 400;
      err.code = 'INVALID_COMPETITION_ID';
      throw err;
    }

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      const err: any = new Error(`Competition with ID '${competitionId}' not found.`);
      err.statusCode = 404;
      err.code = 'COMPETITION_NOT_FOUND';
      throw err;
    }

    const registration = await Registration.findOne({
      competitionId: competition._id,
      participantId,
    });

    const isRegistered = !!registration && registration.status === 'confirmed';
    const lifecycleStatus = calculateLifecycleStatus(competition);
    const eligibility = calculateRegistrationEligibility(competition, isRegistered);

    return {
      isRegistered,
      registration: registration || null,
      lifecycleStatus,
      eligibility,
      spotsRemaining: Math.max(0, competition.capacity - competition.participantCount),
    };
  }

  static async submitEntry(
    competitionId: string,
    participantId: string,
    mediaUrl: string,
    notes?: string
  ) {
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      const err: any = new Error('Invalid competition ID format.');
      err.statusCode = 400;
      err.code = 'INVALID_COMPETITION_ID';
      throw err;
    }

    const registration = await Registration.findOne({
      competitionId,
      participantId,
      status: 'confirmed',
    });

    if (!registration) {
      const err: any = new Error('You must be registered for this competition to submit an entry.');
      err.statusCode = 403;
      err.code = 'NOT_REGISTERED';
      throw err;
    }

    registration.submission = {
      mediaUrl,
      submittedAt: new Date(),
      notes: notes || '',
    };

    await registration.save();

    return registration;
  }
}
