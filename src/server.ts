import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {
  expressMiddleware,
  type ExpressContextFunctionArgument,
} from '@as-integrations/express5';
import connectDB from './config/database.js';

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'API is up and running with Express!',
  },
};

type GraphQLContext = {
  token?: string;
};

const port = Number(process.env.PORT) || 4000;

async function startApolloServer() {
  await connectDB();

  const app = express();
  const httpServer = createServer(app);

  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({
        req,
      }: ExpressContextFunctionArgument): Promise<GraphQLContext> => ({
        token: req.headers.authorization,
      }),
    }),
  );

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(`✅ Apollo Server v5 ready at http://localhost:${port}/graphql`);
}

startApolloServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
