import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { bootstrapTestServer } from './utils/testServer.js';

let app: import('express').Express;
let close: () => Promise<void>;

// A simple public query to hit the GraphQL endpoint
const PUBLIC_QUERY = `#graphql
query {
  users { id }
}`;

describe('Rate Limiting', () => {
  const TEST_WINDOW_MS = 1000; // 1 second
  const TEST_MAX_REQUESTS = 3; // Allow 3 requests per second

  // Use fake timers to control time in tests
  beforeAll(async () => {
    vi.useFakeTimers();

    // Set environment variables for the test server
    process.env.RATE_LIMIT_WINDOW_MS = TEST_WINDOW_MS.toString();
    process.env.RATE_LIMIT_MAX = TEST_MAX_REQUESTS.toString();

    const server = await bootstrapTestServer();
    app = server.app;
    close = server.close;
  });

  afterAll(async () => {
    await close();
    vi.useRealTimers(); // Restore real timers after tests
    // Clean up environment variables
    delete process.env.RATE_LIMIT_WINDOW_MS;
    delete process.env.RATE_LIMIT_MAX;
  });

  it('should allow requests up to the limit and then block subsequent requests', async () => {
    // 1. Send requests up to the limit
    for (let i = 0; i < TEST_MAX_REQUESTS; i++) {
      const res = await request(app).post('/graphql').send({ query: PUBLIC_QUERY });
      expect(res.statusCode).toBe(200);
      expect(res.body.errors).toBeUndefined();
    }

    // 2. Send one more request, which should be blocked
    const blockedRes = await request(app).post('/graphql').send({ query: PUBLIC_QUERY });
    expect(blockedRes.statusCode).toBe(429);
    expect(blockedRes.text).toContain('Too many requests from this IP, please try again after 15 minutes.'); // The message remains the default one

    // 3. Advance timers past the windowMs
    vi.advanceTimersByTime(TEST_WINDOW_MS);

    // 4. Send another request, which should now be allowed
    const allowedRes = await request(app).post('/graphql').send({ query: PUBLIC_QUERY });
    expect(allowedRes.statusCode).toBe(200);
    expect(allowedRes.body.errors).toBeUndefined();
  });

  // You can add more tests here, e.g., for different IP addresses if you configure it
  // (though express-rate-limit handles this by default based on req.ip)
});
