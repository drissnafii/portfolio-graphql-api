import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import connectDB from '../src/config/database.js';
import { createApolloServer } from '../src/app.js';
import { UserModel } from '../src/models/User.js';

let mongod: MongoMemoryServer;
let app: import('express').Express;

const CREATE_USER = `#graphql
mutation($username: String!, $email: String!, $password: String!, $role: String!) {
  createUser(username: $username, email: $email, password: $password, role: $role) { id role }
}`;

const LOGIN = `#graphql
mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) { token user { id role } }
}`;

const CREATE_PROFILE = `#graphql
mutation($lastName: String!, $firstName: String!, $title: String!, $biography: String!, $email: String!) {
  createProfile(lastName: $lastName, firstName: $firstName, title: $title, biography: $biography, email: $email) { id }
}`;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret_key';
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  await connectDB();
  const serverParts = await createApolloServer();
  app = serverParts.app;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
});

describe('RBAC: createProfile', () => {
  it('denies a visitor (FORBIDDEN)', async () => {
    // Create visitor
    await request(app)
      .post('/graphql')
      .send({ query: CREATE_USER, variables: { username: 'v', email: 'v@example.com', password: 'p@ss', role: 'visitor' } })
      .expect(200);

    // Login visitor
    const loginRes = await request(app)
      .post('/graphql')
      .send({ query: LOGIN, variables: { email: 'v@example.com', password: 'p@ss' } })
      .expect(200);

    const token = loginRes.body.data.login.token as string;

    // Try to create profile
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: CREATE_PROFILE, variables: { lastName: 'V', firstName: 'Vic', title: 'Visitor', biography: 'bio', email: 'pv@example.com' } })
      .expect(200);

    expect(res.body.errors?.[0]?.extensions?.code).toBe('FORBIDDEN');
  });

  it('allows an admin', async () => {
    // Create admin
    await request(app)
      .post('/graphql')
      .send({ query: CREATE_USER, variables: { username: 'a', email: 'a@example.com', password: 'p@ss', role: 'admin' } })
      .expect(200);

    // Login admin
    const loginRes = await request(app)
      .post('/graphql')
      .send({ query: LOGIN, variables: { email: 'a@example.com', password: 'p@ss' } })
      .expect(200);

    const token = loginRes.body.data.login.token as string;

    // Create profile should succeed
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: CREATE_PROFILE, variables: { lastName: 'A', firstName: 'Admin', title: 'Boss', biography: 'bio', email: 'pa@example.com' } })
      .expect(200);

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.createProfile.id).toBeTruthy();
  });
});


