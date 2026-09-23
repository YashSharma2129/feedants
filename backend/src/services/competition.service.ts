import mongoose from 'mongoose';
import { Competition, ICompetition } from '../models/competition.model';
import { Registration, IRegistration } from '../models/registration.model';
import {
  calculateLifecycleStatus,
  calculateRegistrationEligibility,
  formatCountdown,
  LifecycleStatus,
  RegistrationEligibility,
  FormattedCountdown,
} from '../utils/lifecycle';

export interface EnrichedCompetition extends Record<string, any> {
  lifecycleStatus: LifecycleStatus;
  eligibility: RegistrationEligibility;
  countdown: FormattedCountdown;
  isUserRegistered: boolean;
  userRegistration?: IRegistration | null;
}

export class CompetitionService {
  static async getCompetitionByIdOrSlug(
    idOrSlug: string,
    participantId?: string
  ): Promise<EnrichedCompetition> {
    let competition: ICompetition | null = null;

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      competition = await Competition.findById(idOrSlug);
    }

    if (!competition) {
      competition = await Competition.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!competition) {
      const err: any = new Error(`Competition with identifier '${idOrSlug}' was not found.`);
      err.statusCode = 404;
      err.code = 'COMPETITION_NOT_FOUND';
      throw err;
    }

    // Check registration status if participantId is passed
    let isUserRegistered = false;
    let userRegistration: IRegistration | null = null;

    if (participantId) {
      userRegistration = await Registration.findOne({
        competitionId: competition._id,
        participantId,
        status: { $in: ['confirmed', 'waitlisted'] },
      });
      isUserRegistered = !!userRegistration;
    }

    const lifecycleStatus = calculateLifecycleStatus(competition);
    const eligibility = calculateRegistrationEligibility(competition, isUserRegistered);
    const countdown = formatCountdown(eligibility.secondsUntilRegistrationClose);

    const compObj = competition.toObject();

    return {
      ...compObj,
      lifecycleStatus,
      eligibility,
      countdown,
      isUserRegistered,
      userRegistration,
    };
  }

  static async listCompetitions(): Promise<EnrichedCompetition[]> {
    const competitions = await Competition.find({ status: { $ne: 'draft' } }).sort({
      registrationEndAt: 1,
    });

    return competitions.map((comp) => {
      const lifecycleStatus = calculateLifecycleStatus(comp);
      const eligibility = calculateRegistrationEligibility(comp, false);
      const countdown = formatCountdown(eligibility.secondsUntilRegistrationClose);
      return {
        ...comp.toObject(),
        lifecycleStatus,
        eligibility,
        countdown,
        isUserRegistered: false,
      };
    });
  }
}
