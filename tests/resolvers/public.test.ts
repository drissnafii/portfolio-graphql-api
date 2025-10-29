import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { bootstrapTestServer } from '../utils/testServer.js';

let app: import('express').Express;
let close: () => Promise<void>;

const PUBLIC_QUERIES = `#graphql
query {
  users { id }
  profiles { id }
  experiences { id }
  projects { id }
  skills { id }
}`;

describe('Resolvers: public queries', () => {
  beforeAll(async () => {
    const server = await bootstrapTestServer();
    app = server.app;
    close = server.close;
  });

  afterAll(async () => {
    await close();
  });

  it('returns arrays (possibly empty) without auth', async () => {
    const res = await request(app).post('/graphql').send({ query: PUBLIC_QUERIES }).expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(Array.isArray(res.body.data.users)).toBe(true);
    expect(Array.isArray(res.body.data.profiles)).toBe(true);
    expect(Array.isArray(res.body.data.experiences)).toBe(true);
    expect(Array.isArray(res.body.data.projects)).toBe(true);
    expect(Array.isArray(res.body.data.skills)).toBe(true);
  });
});


