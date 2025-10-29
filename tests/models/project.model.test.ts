import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose, { Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ProjectModel } from '../../src/models/Project.js';

let mongoServer: MongoMemoryServer;

describe('Project Model', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    await mongoose.connection.collection('projects').deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should set featured to false by default', async () => {
    const project = await ProjectModel.create({
      createdBy_id: new Types.ObjectId(),
      title: 'Test Project',
      description: 'A test project',
      startDate: new Date(),
      status: 'in_progress',
    });

    expect(project.featured).toBe(false);
  });
});


