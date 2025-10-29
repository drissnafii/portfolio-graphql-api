import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel, type IUser } from '../../src/models/User.js';

let mongoServer: MongoMemoryServer;

describe('User Model', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    await UserModel.syncIndexes();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should hash the password before saving', async () => {
    const userData: IUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'plainpassword123',
      role: 'visitor',
    } as unknown as IUser;

    const user = new UserModel(userData);
    await user.save();

    expect(user.password).toBeDefined();
    expect(user.password).not.toEqual('plainpassword123');
    expect(user.password).toHaveLength(60);

    const userFromDb = await UserModel.findById(user._id).select('+password').lean();
    expect(userFromDb?.password).toBe(user.password);
  });

  it('should not allow duplicate usernames', async () => {
    await UserModel.create({
      username: 'duplicate_user',
      email: 'unique1@example.com',
      password: 'password123',
    });

    const duplicateUserData = {
      username: 'duplicate_user',
      email: 'unique2@example.com',
      password: 'password123',
    };

    await expect(UserModel.create(duplicateUserData)).rejects.toThrow(/E11000/);
  });
});


