export type LifecycleStatus =
  | 'upcoming'
  | 'registration_open'
  | 'registration_closed'
  | 'submission_open'
  | 'judging'
  | 'completed';

export interface RegistrationEligibility {
  canRegister: boolean;
  reason: string;
  spotsRemaining: number;
  isFull: boolean;
  isDeadlinePassed: boolean;
  isNotStartedYet: boolean;
  secondsUntilRegistrationClose: number;
}

export interface FormattedCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedString: string;
}

export interface Judge {
  name: string;
  role: string;
  designation: string;
  experience: string;
  avatarUrl: string;
  introVideoUrl?: string;
}

export interface PreviousWinner {
  name: string;
  rankTitle: string;
  videoThumbnail: string;
  videoUrl?: string;
}

export interface Reward {
  rank: number;
  title: string;
  amount: number;
  icon?: string;
}

export interface JudgingParameter {
  name: string;
  weightage: number;
  description: string;
}

export interface Competition {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  badge: string;
  prizePool: number;
  entryFee: number;
  currency: string;
  capacity: number;
  participantCount: number;
  registrationStartAt: string;
  registrationEndAt: string;
  submissionStartAt: string;
  submissionEndAt: string;
  resultDate: string;
  judge: Judge;
  previousWinners: PreviousWinner[];
  rewards: Reward[];
  judgingParameters: JudgingParameter[];
  aboutDescription: string;
  rules: string[];
  referralLink: string;
  referralRewardText: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  lifecycleStatus: LifecycleStatus;
  eligibility: RegistrationEligibility;
  countdown: FormattedCountdown;
  isUserRegistered: boolean;
  userRegistration?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: {
    code: string;
    details?: any;
  };
}
