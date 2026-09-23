import { ICompetition } from '../models/competition.model';

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
  formattedString: string; // "01d : 06h : 28m : 32s"
}

export const calculateLifecycleStatus = (
  comp: Pick<
    ICompetition,
    | 'registrationStartAt'
    | 'registrationEndAt'
    | 'submissionStartAt'
    | 'submissionEndAt'
    | 'resultDate'
    | 'capacity'
    | 'participantCount'
    | 'status'
  >,
  targetDate: Date = new Date()
): LifecycleStatus => {
  const now = targetDate.getTime();
  const regStart = new Date(comp.registrationStartAt).getTime();
  const regEnd = new Date(comp.registrationEndAt).getTime();
  const subStart = new Date(comp.submissionStartAt).getTime();
  const subEnd = new Date(comp.submissionEndAt).getTime();
  const resDate = new Date(comp.resultDate).getTime();

  if (now >= resDate || comp.status === 'completed') {
    return 'completed';
  }

  if (now >= subEnd && now < resDate) {
    return 'judging';
  }

  if (now >= regStart && now < regEnd && comp.participantCount < comp.capacity) {
    return 'registration_open';
  }

  if (now >= subStart && now < subEnd) {
    return 'submission_open';
  }

  if (now >= regEnd || comp.participantCount >= comp.capacity) {
    return 'registration_closed';
  }

  return 'upcoming';
};

export const calculateRegistrationEligibility = (
  comp: Pick<ICompetition, 'registrationStartAt' | 'registrationEndAt' | 'capacity' | 'participantCount' | 'status'>,
  isUserAlreadyRegistered: boolean = false,
  targetDate: Date = new Date()
): RegistrationEligibility => {
  const now = targetDate.getTime();
  const regStart = new Date(comp.registrationStartAt).getTime();
  const regEnd = new Date(comp.registrationEndAt).getTime();
  const spotsRemaining = Math.max(0, comp.capacity - comp.participantCount);
  const isFull = comp.participantCount >= comp.capacity;
  const isDeadlinePassed = now >= regEnd;
  const isNotStartedYet = now < regStart;

  const secondsUntilRegistrationClose = Math.max(
    0,
    Math.floor((regEnd - now) / 1000)
  );

  if (comp.status === 'cancelled') {
    return {
      canRegister: false,
      reason: 'This competition has been cancelled.',
      spotsRemaining,
      isFull,
      isDeadlinePassed,
      isNotStartedYet,
      secondsUntilRegistrationClose,
    };
  }

  if (isUserAlreadyRegistered) {
    return {
      canRegister: false,
      reason: 'You are already registered for this competition.',
      spotsRemaining,
      isFull,
      isDeadlinePassed,
      isNotStartedYet,
      secondsUntilRegistrationClose,
    };
  }

  if (isNotStartedYet) {
    return {
      canRegister: false,
      reason: 'Registration has not opened yet.',
      spotsRemaining,
      isFull,
      isDeadlinePassed,
      isNotStartedYet,
      secondsUntilRegistrationClose,
    };
  }

  if (isDeadlinePassed) {
    return {
      canRegister: false,
      reason: 'Registration deadline has passed.',
      spotsRemaining,
      isFull,
      isDeadlinePassed,
      isNotStartedYet,
      secondsUntilRegistrationClose: 0,
    };
  }

  if (isFull) {
    return {
      canRegister: false,
      reason: 'Competition is at full capacity.',
      spotsRemaining: 0,
      isFull: true,
      isDeadlinePassed,
      isNotStartedYet,
      secondsUntilRegistrationClose,
    };
  }

  return {
    canRegister: true,
    reason: 'Registration is open.',
    spotsRemaining,
    isFull: false,
    isDeadlinePassed: false,
    isNotStartedYet: false,
    secondsUntilRegistrationClose,
  };
};

export const formatCountdown = (totalSeconds: number): FormattedCountdown => {
  if (totalSeconds <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formattedString: '00d : 00h : 00m : 00s',
    };
  }

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const formattedString = `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;

  return {
    days,
    hours,
    minutes,
    seconds,
    formattedString,
  };
};
