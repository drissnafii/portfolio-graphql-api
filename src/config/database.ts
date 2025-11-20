import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async (retries = 5, delay = 5000) => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    logger.error('FATAL ERROR: MONGO_URI is not defined in .env');
    process.exit(1);
  }

  for (let i = 0; i < retries; i++) {
    try {
      // Tente la connexion à la base de données
      await mongoose.connect(mongoUri);
      logger.info('✅ MongoDB Connected...');
      return;
    } catch (err) {
      logger.error(`❌ MongoDB Connection Error (attempt ${i + 1}/${retries}): ${(err as Error).message}`);
      if (i < retries - 1) {
        logger.info(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error('❌ Failed to connect to MongoDB after multiple attempts');
        process.exit(1);
      }
    }
  }
};

export default connectDB;