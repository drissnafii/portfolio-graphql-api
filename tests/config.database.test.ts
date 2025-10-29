import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import mongoose from 'mongoose';
import * as dbModule from '../src/config/database.js';
import logger from '../src/config/logger.js';

const originalEnv = { ...process.env };

describe('config/database connectDB', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('exits when MONGO_URI is missing', async () => {
    delete process.env.MONGO_URI;
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('process.exit() was called.');
    }) as any);
    const logSpy = vi.spyOn(logger, 'error').mockImplementation(() => logger as any);

    await expect((dbModule as any).default()).rejects.toThrow('process.exit() was called.');
    expect(logSpy).toHaveBeenCalled();
  });

  it('exits on connection error', async () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/fail';
    vi.spyOn(mongoose, 'connect').mockRejectedValueOnce(new Error('boom'));
    const exitSpy = vi.spyOn(process, 'exit').mockImplementationOnce((() => undefined) as any);
    const logSpy = vi.spyOn(logger, 'error').mockImplementation(() => logger as any);
    await (dbModule as any).default();
    expect(exitSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  });
});
