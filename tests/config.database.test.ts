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
    // Mock all retry attempts to fail immediately
    vi.spyOn(mongoose, 'connect').mockRejectedValue(new Error('boom'));
    const exitSpy = vi.spyOn(process, 'exit').mockImplementationOnce((() => undefined) as any);
    const logSpy = vi.spyOn(logger, 'error').mockImplementation(() => logger as any);
    
    // Use fake timers to speed up the retry delays
    vi.useFakeTimers();
    const connectPromise = (dbModule as any).default();
    
    // Advance time to skip all retry delays (5 retries * 5000ms)
    await vi.advanceTimersByTimeAsync(25000);
    await connectPromise;
    
    vi.useRealTimers();
    
    expect(exitSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  }, 10000);
});
