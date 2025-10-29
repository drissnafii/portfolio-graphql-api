import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { bootstrapTestServer } from './utils/testServer.js';

let app: import('express').Express;
let close: () => Promise<void>;

const CREATE_USER = `#graphql
mutation($username: String!, $email: String!, $password: String!, $role: String) {
  createUser(username: $username, email: $email, password: $password, role: $role) { id }
}`;

describe('GraphQL formatError duplicate key mapping', () => {
  beforeAll(async () => {
    const server = await bootstrapTestServer();
    app = server.app;
    close = server.close;
  });

  afterAll(async () => {
    await close();
  });

  it('maps Mongo duplicate key error to friendly message and code', async () => {
    await request(app).post('/graphql').send({
      query: CREATE_USER,
      variables: { username: 'dup', email: 'dup@example.com', password: 'p@ss', role: 'visitor' },
    }).expect(200);

    const res = await request(app).post('/graphql').send({
      query: CREATE_USER,
      variables: { username: 'dup', email: 'other@example.com', password: 'p@ss', role: 'visitor' },
    }).expect(200);

    const msg = res.body.errors?.[0]?.message as string;
    const code = res.body.errors?.[0]?.extensions?.code as string;
    expect(msg).toMatch(/existe déjà/i);
    expect(code).toBe('DUPLICATE_KEY');
  });
});


