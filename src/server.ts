import 'dotenv/config';
import http from 'http';
import connectDB from './config/database.js';
import { createApolloServer } from './app.js';

async function startApolloServer() {
  await connectDB();

  const { app, httpServer } = await createApolloServer();

  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startApolloServer();
