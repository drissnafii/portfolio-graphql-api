import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { bootstrapTestServer } from '../utils/testServer.js';

let app: import('express').Express;
let close: () => Promise<void>;
let adminToken = '';

const CREATE_USER = `#graphql
mutation($username: String!, $email: String!, $password: String!, $role: String!) {
  createUser(username: $username, email: $email, password: $password, role: $role) { id role }
}`;

const LOGIN = `#graphql
mutation($email: String!, $password: String!) { login(email: $email, password: $password) { token } }`;

const CREATE_PROFILE = `#graphql
mutation($lastName: String!, $firstName: String!, $title: String!, $biography: String!, $email: String!) {
  createProfile(lastName: $lastName, firstName: $firstName, title: $title, biography: $biography, email: $email) { id }
}`;

const CREATE_PROJECT = `#graphql
mutation($title: String!, $description: String!, $startDate: Date!, $status: String!, $featured: Boolean!) {
  createProject(title: $title, description: $description, startDate: $startDate, status: $status, featured: $featured) { id title featured }
}`;

const UPDATE_PROJECT = `#graphql
mutation($id: ID!, $title: String) {
  updateProject(id: $id, title: $title) { id title }
}`;

const DELETE_PROJECT = `#graphql
mutation($id: ID!) { deleteProject(id: $id) { id } }`;

describe('Resolvers: admin CRUD', () => {
  beforeAll(async () => {
    const server = await bootstrapTestServer();
    app = server.app;
    close = server.close;

    await request(app).post('/graphql').send({
      query: CREATE_USER,
      variables: { username: 'admin', email: 'admin@ex.com', password: 'p@ss', role: 'admin' },
    });
    const login = await request(app).post('/graphql').send({ query: LOGIN, variables: { email: 'admin@ex.com', password: 'p@ss' } });
    adminToken = login.body.data.login.token as string;
  });

  afterAll(async () => {
    await close();
  });

  it('creates a profile as admin', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: CREATE_PROFILE, variables: { lastName: 'A', firstName: 'B', title: 'T', biography: 'bio', email: 'x@example.com' } })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.createProfile.id).toBeTruthy();
  });

  it('creates, updates and deletes a project as admin', async () => {
    const createRes = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        query: CREATE_PROJECT,
        variables: { title: 'P', description: 'D', startDate: Date.now(), status: 'in_progress', featured: false },
      })
      .expect(200);
    const projId = createRes.body.data.createProject.id as string;

    const updateRes = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: UPDATE_PROJECT, variables: { id: projId, title: 'P2' } })
      .expect(200);
    expect(updateRes.body.data.updateProject.title).toBe('P2');

    const deleteRes = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: DELETE_PROJECT, variables: { id: projId } })
      .expect(200);
    expect(deleteRes.body.data.deleteProject.id).toBe(projId);
  });
});


