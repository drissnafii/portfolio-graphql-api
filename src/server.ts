import 'dotenv/config';
import connectDB from './config/database.js';
import { createApolloServer } from './app.js'; // Importation de la fonction de configuration

const port = Number(process.env.PORT) || 4000;

// Main function to start the server
async function startServer() {
  try {

    // 1. connect into the DB
    await connectDB();
    console.log('✅ Database connected successfully');

    // 2. create the server (from the app.ts)
    const { httpServer } = await createApolloServer();

    // start the server + listning
    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();