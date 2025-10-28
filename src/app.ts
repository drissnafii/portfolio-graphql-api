import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';

// 1. import GraphQL partes 
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { createContext, type GraphQLContext } from './graphql/context.js';

// 2. function of setupping the server
export async function createApolloServer() {
  const app = express();
  const httpServer = createServer(app);

  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start(); // Starting the Appolo server

  // 3. use Middlewares
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    // use the function that we exported in the contex file !
    expressMiddleware(server, {
      context: createContext,
    }),
  );

  // 4. return the server BUT is OFF
  return { app, httpServer };
}