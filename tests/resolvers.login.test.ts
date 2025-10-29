import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { bootstrapTestServer } from './utils/testServer.js';

let app: import('express').Express;
let close: () => Promise<void>;

const CREATE_USER = `#graphql
mutation($username: String!, $email: String!, $password: String!, $role: String!) {
  createUser(username: $username, email: $email, password: $password, role: $role) { id role }
}`;

const LOGIN = `#graphql
mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) { token user { id role } }
}`;

describe('Resolver: login', () => {
  beforeAll(async () => {
    const server = await bootstrapTestServer();
    app = server.app;
    close = server.close;
  });

  afterAll(async () => {
    await close();
  });

  it('succeeds with correct credentials', async () => {
    await request(app)
      .post('/graphql')
      .send({ query: CREATE_USER, variables: { username: 'admin', email: 'admin@example.com', password: 'p@ss', role: 'admin' } })
      .expect(200);

    const res = await request(app)
      .post('/graphql')
      .send({ query: LOGIN, variables: { email: 'admin@example.com', password: 'p@ss' } })
      .expect(200);

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.login.token).toBeTruthy();
    expect(res.body.data.login.user.role).toBe('admin');
  });

  it('fails with wrong password', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: LOGIN, variables: { email: 'admin@example.com', password: 'wrong' } })
      .expect(200);

    expect(res.body.errors?.[0]?.message).toMatch(/Invalid credentials/i);
  });

  it('fails with unknown email', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: LOGIN, variables: { email: 'nope@example.com', password: 'p@ss' } })
      .expect(200);

    expect(res.body.errors?.[0]?.message).toMatch(/User not found/i);
  });
});


