import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import connectDB from '../../src/config/database.js';
import { createApolloServer } from '../../src/app.js';

export type TestServer = {
  mongod: MongoMemoryServer;
  app: import('express').Express;
  uri: string;
  close: () => Promise<void>;
};

export async function bootstrapTestServer(): Promise<TestServer> {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  await connectDB();
  const { app } = await createApolloServer();

  async function close() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  }

  return { mongod, app, uri, close };
}


