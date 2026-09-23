import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IRegistration extends Document {
  competitionId: mongoose.Types.ObjectId;
  participantId: string;
  participantName?: string;
  participantEmail?: string;
  status: 'confirmed' | 'cancelled' | 'refunded';
  registeredAt: Date;
  paymentDetails: {
    transactionId: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed';
  };
  submission?: {
    mediaUrl?: string;
    submittedAt?: Date;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    competitionId: {
      type: Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true,
    },
    participantId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    participantName: {
      type: String,
      trim: true,
    },
    participantEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'refunded'],
      default: 'confirmed',
      index: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    paymentDetails: {
      transactionId: { type: String, default: () => `tx_${Date.now()}` },
      amount: { type: Number, required: true },
      currency: { type: String, default: 'INR' },
      status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
    },
    submission: {
      mediaUrl: { type: String },
      submittedAt: { type: Date },
      notes: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL: Unique compound index to guarantee at database level that duplicate registrations cannot be inserted
RegistrationSchema.index({ competitionId: 1, participantId: 1 }, { unique: true });

export const Registration: Model<IRegistration> = mongoose.model<IRegistration>(
  'Registration',
  RegistrationSchema
);
