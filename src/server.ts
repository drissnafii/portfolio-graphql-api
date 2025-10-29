// src/server.ts
import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
// On importe le middleware SPÉCIFIQUE pour Express
import { expressMiddleware } from '@as-integrations/express5';
import connectDB from './config/database.js'; // N'oublie pas l'extension .js

// Schéma et resolvers de test
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

// Fonction asynchrone pour démarrer le serveur
async function startApolloServer() {
  // 1. Connexion à la base de données
  await connectDB();

  // 2. Création de l'application Express et du serveur HTTP
  const app = express();
  const httpServer = http.createServer(app);

  // 3. Création de l'instance d'Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });
  // Il faut le démarrer AVANT de l'appliquer à Express
  await server.start();

  // 4. Utilisation du middleware Apollo sur le chemin /graphql
  // C'est ici que l'intégration se fait
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server)
  );

  // 5. Démarrage de notre propre serveur HTTP (basé sur Express)
  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

// Lancement du serveur
startApolloServer();
