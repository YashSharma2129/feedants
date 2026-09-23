import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<string> => {
  const uri = env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  try {
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`Connecting to MongoDB at: ${maskedUri}`);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    
    console.log('MongoDB connected successfully.');
    return uri;
  } catch (err: any) {
    console.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  } catch (err: any) {
    console.error('Error during MongoDB disconnect:', err.message);
  }
};
