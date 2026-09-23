import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IJudge {
  name: string;
  role: string;
  designation: string;
  experience: string;
  avatarUrl: string;
  introVideoUrl?: string;
}

export interface IPreviousWinner {
  name: string;
  rankTitle: string;
  videoThumbnail: string;
  videoUrl?: string;
}

export interface IReward {
  rank: number;
  title: string;
  amount: number;
  icon?: string;
}

export interface IJudgingParameter {
  name: string;
  weightage: number;
  description: string;
}

export interface ICompetition extends Document {
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
  registrationStartAt: Date;
  registrationEndAt: Date;
  submissionStartAt: Date;
  submissionEndAt: Date;
  resultDate: Date;
  judge: IJudge;
  previousWinners: IPreviousWinner[];
  rewards: IReward[];
  judgingParameters: IJudgingParameter[];
  aboutDescription: string;
  rules: string[];
  referralLink: string;
  referralRewardText: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const JudgeSchema = new Schema<IJudge>(
  {
    name: { type: String, required: true },
    role: { type: String, default: 'Judge' },
    designation: { type: String, default: 'Professional Kathak Dancer' },
    experience: { type: String, default: '12+ Years of Experience' },
    avatarUrl: { type: String, required: true },
    introVideoUrl: { type: String },
  },
  { _id: false }
);

const PreviousWinnerSchema = new Schema<IPreviousWinner>(
  {
    name: { type: String, required: true },
    rankTitle: { type: String, required: true },
    videoThumbnail: { type: String, required: true },
    videoUrl: { type: String },
  },
  { _id: false }
);

const RewardSchema = new Schema<IReward>(
  {
    rank: { type: Number, required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    icon: { type: String },
  },
  { _id: false }
);

const JudgingParameterSchema = new Schema<IJudgingParameter>(
  {
    name: { type: String, required: true },
    weightage: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const CompetitionSchema = new Schema<ICompetition>(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, default: 'Dance' },
    tags: { type: [String], default: ['Dance', 'Multi-Win'] },
    badge: { type: String, default: 'Winners get certificate' },
    prizePool: { type: Number, required: true, min: 0 },
    entryFee: { type: Number, required: true, min: 0 },
    currency: { type: String, default: '₹' },
    capacity: { type: Number, required: true, min: 1 },
    participantCount: { type: Number, default: 0, min: 0, index: true },
    registrationStartAt: { type: Date, required: true, index: true },
    registrationEndAt: { type: Date, required: true, index: true },
    submissionStartAt: { type: Date, required: true },
    submissionEndAt: { type: Date, required: true },
    resultDate: { type: Date, required: true },
    judge: { type: JudgeSchema, required: true },
    previousWinners: { type: [PreviousWinnerSchema], default: [] },
    rewards: { type: [RewardSchema], default: [] },
    judgingParameters: { type: [JudgingParameterSchema], default: [] },
    aboutDescription: { type: String, required: true },
    rules: { type: [String], default: [] },
    referralLink: { type: String, default: 'https://feedants.com/r/referral123' },
    referralRewardText: { type: String, default: 'You earn ₹10 for every signup' },
    status: {
      type: String,
      enum: ['draft', 'published', 'completed', 'cancelled'],
      default: 'published',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for query efficiency
CompetitionSchema.index({ status: 1, registrationEndAt: 1 });

export const Competition: Model<ICompetition> = mongoose.model<ICompetition>(
  'Competition',
  CompetitionSchema
);
