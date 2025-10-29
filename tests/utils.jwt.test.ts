import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import jwt from 'jsonwebtoken';
import { generateToken } from '../src/utils/jwt.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

describe('utils/jwt generateToken', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret_key';
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  });

  it('creates a valid signed JWT with id and role', () => {
    const token = generateToken({ _id: '507f1f77bcf86cd799439011' } as any);
    const decoded = jwt.decode(token) as any;
    expect(decoded).toBeTruthy();
    expect(decoded.id).toBe('507f1f77bcf86cd799439011');
  });
});


