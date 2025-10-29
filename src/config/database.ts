import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    logger.error('FATAL ERROR: MONGO_URI is not defined in .env');
    process.exit(1);
  }

  try {
    // Tente la connexion à la base de données
    await mongoose.connect(mongoUri);
    logger.info('✅ MongoDB Connected...');
  } catch (err) {
    logger.error(`❌ MongoDB Connection Error: ${(err as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;