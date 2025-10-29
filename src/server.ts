import 'dotenv/config';
import connectDB from './config/database.js';
import { createApolloServer } from './app.js';
import logger from './config/logger.js';

async function startApolloServer() {
  try {
    await connectDB();

    const { httpServer } = await createApolloServer();

    const PORT = process.env.PORT || 4000;
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    logger.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  } catch (error) {
    logger.error(`❌ Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
}

startApolloServer();
