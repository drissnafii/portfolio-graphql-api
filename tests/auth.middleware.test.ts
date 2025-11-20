import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { bootstrapTestServer } from './utils/testServer.js';
import { UserModel } from '../src/models/User.js';
import { getUserFromToken } from '../src/middlewares/auth.js';

let close: () => Promise<void>;

describe('Auth middleware - getUserFromToken', () => {
  beforeAll(async () => {
    const server = await bootstrapTestServer();
    close = server.close;
  });

  afterAll(async () => {
    await close();
  });

  it('returns null when token is missing', async () => {
    const user = await getUserFromToken(undefined);
    expect(user).toBeNull();
  });

  it('returns null for malformed token', async () => {
    const user = await getUserFromToken('Bearer not-a-valid-token');
    expect(user).toBeNull();
  });

  it('returns user for valid token', async () => {
    const u = await UserModel.create({ username: 'u1', email: 'u1@example.com', password: 'p@ss', role: 'admin' });
    const token = jwt.sign({ id: (u._id as mongoose.Types.ObjectId).toString(), role: 'admin' }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    const user = await getUserFromToken(`Bearer ${token}`);
    expect((user as any)?._id.toString()).toBe((u._id as mongoose.Types.ObjectId).toString());
  });
});


