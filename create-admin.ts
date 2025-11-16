import 'dotenv/config';
import mongoose from 'mongoose';
import { UserModel } from './src/models/User.js';

// Determine the correct MongoDB URI based on environment
// Inside Docker: use the service name 'db'
// Outside Docker: use 'localhost'
let MONGO_URI: string;

if (process.env.DOCKER_ENV === 'true') {
  // Running inside Docker container
  MONGO_URI = process.env.MONGO_URI || 'mongodb://drissnafii:TheDendo2005@db:27017/codefolio?authSource=admin';
} else {
  // Running on host machine
  MONGO_URI = process.env.MONGO_URI?.replace('db:27017', 'localhost:27017').replace('codefolio_db', 'codefolio') 
    || 'mongodb://drissnafii:TheDendo2005@localhost:27017/codefolio?authSource=admin';
}

// Get credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@codefolio.com';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function createAdmin() {
  try {
    // Validate that required environment variables are set
    if (!ADMIN_PASSWORD) {
      console.error('❌ Error: ADMIN_PASSWORD environment variable is required!');
      console.log('💡 Usage: ADMIN_PASSWORD="your_password" npx tsx create-admin.ts');
      process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    console.log(`📍 URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists (by username or email)
    const existingAdmin = await UserModel.findOne({ 
      $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }] 
    }).select('+password');
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Updating password...');
      existingAdmin.password = ADMIN_PASSWORD;
      existingAdmin.email = ADMIN_EMAIL;
      existingAdmin.username = ADMIN_USERNAME;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Admin password updated successfully!');
    } else {
      // Create new admin user
      const admin = new UserModel({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin'
      });

      await admin.save();
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📝 Login credentials:');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Username: ${ADMIN_USERNAME}`);
    console.log('Password: [hidden for security]');
    console.log('\n⚠️  Keep your credentials secure!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
