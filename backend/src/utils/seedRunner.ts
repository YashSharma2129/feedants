import { connectDB, disconnectDB } from '../config/db';
import { seedDatabase } from './seedData';

const run = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('Database seeding complete!');
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

run();
