import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@as-integrations/express5';
import morgan from 'morgan';

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
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ includeCookies: true }),
    ],
    formatError: (formattedError, error) => {
      const anyErr = error as unknown as Record<string, any>;
      const original = anyErr.originalError
        || anyErr.extensions?.originalError
        || anyErr.extensions?.exception
        || anyErr;

      const code = original?.code;
      const keyValue = original?.keyValue ?? original?.errorResponse?.keyValue;

      if (code === 11000 && keyValue && typeof keyValue === 'object') {
        const duplicatedField = Object.keys(keyValue)[0] ?? 'champ';
        return {
          ...formattedError,
          message: `Un utilisateur avec ce/cette ${duplicatedField} existe déjà.`,
          extensions: {
            ...formattedError.extensions,
            code: 'DUPLICATE_KEY',
          },
        };
      }
      return formattedError;
    },
  });

  await server.start(); // Starting the Appolo server

  // 3. use Middlewares
  app.use(
    '/graphql',
    morgan('dev'),
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