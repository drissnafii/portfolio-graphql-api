import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('FATAL ERROR: MONGO_URI is not defined in .env');
    process.exit(1); // Arrête l'application si la variable n'est pas définie
  }

  try {
    // Tente la connexion à la base de données
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    // Affiche l'erreur et arrête l'application en cas d'échec
    console.error('❌ MongoDB Connection Error:', (err as Error).message);
    process.exit(1);
  }
};

export default connectDB;