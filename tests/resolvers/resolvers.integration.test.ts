import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from '../../src/graphql/schema.js';
import { resolvers } from '../../src/graphql/resolvers.js';
import { ProfileModel } from '../../src/models/Profile.js';
import { ProjectModel } from '../../src/models/Project.js';
import { SkillModel } from '../../src/models/Skill.js';
import { ExperienceModel } from '../../src/models/Experience.js';

vi.mock('../../src/models/Profile.js', () => ({
  ProfileModel: {
    findOne: vi.fn(), // This makes ProfileModel.findOne an actual mock function
  },
}));
// Mock the models that will be called by the getPortfolio resolver
vi.mock('../models/Profile.js');
vi.mock('../models/Project.js');
vi.mock('../models/Skill.js');
vi.mock('../models/Experience.js');
// Explicitly mock the models and their methods that are used in the resolver
vi.mock('../../src/models/Profile.js', () => ({
  ProfileModel: {
    findOne: vi.fn(), // Mock findOne as a Vitest mock function
    // Add other methods if they are used in resolvers and need mocking
  },
}));

vi.mock('../../src/models/Project.js', () => ({
  ProjectModel: {
    find: vi.fn(), // Mock find as a Vitest mock function
    // Add other methods if they are used in resolvers and need mocking
  },
}));

vi.mock('../../src/models/Skill.js', () => ({
  SkillModel: {
    find: vi.fn(), // Mock find as a Vitest mock function
    // Add other methods if they are used in resolvers and need mocking
  },
}));

vi.mock('../../src/models/Experience.js', () => ({
  ExperienceModel: {
    find: vi.fn(), // Mock find as a Vitest mock function
    // Add other methods if they are used in resolvers and need mocking
  },
}));

describe('[Integration] getPortfolio Query', () => {
  let testServer: ApolloServer;

  beforeEach(() => {
    testServer = new ApolloServer({
      typeDefs,
      resolvers,
    });
    // Reset mocks before each test to ensure isolation
    vi.resetAllMocks();
  });

  it('should fetch and return the complete portfolio payload', async () => {
    // 1. ARRANGE: Prepare mock data for each model
    const mockProfile = {
      id: 'profile1',
      firstName: 'John',
      lastName: 'Doe',
      title: 'Full Stack Developer',
    };
    const mockProjects = [{ id: 'proj1', title: 'Portfolio API' }];
    const mockSkills = [{ id: 'skill1', name: 'TypeScript' }];
    const mockExperiences = [{ id: 'exp1', company: 'Tech Corp' }];

    // Mock the chainable Mongoose methods (.find, .findOne, .sort, .lean)
    const lean = vi.fn().mockResolvedValue(mockProjects);
    const sort = vi.fn(() => ({ lean }));
    vi.mocked(ProjectModel.find).mockReturnValue({ sort } as any);
    const projectLeanMock = vi.fn().mockResolvedValue(mockProjects);
    const projectSortMock = vi.fn(() => ({ lean: projectLeanMock }));
    vi.mocked(ProjectModel.find).mockReturnValue({ sort: projectSortMock } as any);

    const leanSkills = vi.fn().mockResolvedValue(mockSkills);
    const sortSkills = vi.fn(() => ({ lean: leanSkills }));
    vi.mocked(SkillModel.find).mockReturnValue({ sort: sortSkills } as any);
    const skillLeanMock = vi.fn().mockResolvedValue(mockSkills);
    const skillSortMock = vi.fn(() => ({ lean: skillLeanMock }));
    vi.mocked(SkillModel.find).mockReturnValue({ sort: skillSortMock } as any);

    const leanExperiences = vi.fn().mockResolvedValue(mockExperiences);
    const sortExperiences = vi.fn(() => ({ lean: leanExperiences }));
    vi.mocked(ExperienceModel.find).mockReturnValue({ sort: sortExperiences } as any);
    const experienceLeanMock = vi.fn().mockResolvedValue(mockExperiences);
    const experienceSortMock = vi.fn(() => ({ lean: experienceLeanMock }));
    vi.mocked(ExperienceModel.find).mockReturnValue({ sort: experienceSortMock } as any);

    const leanProfile = vi.fn().mockResolvedValue(mockProfile);
    vi.mocked(ProfileModel.findOne).mockReturnValue({ lean: leanProfile } as any);
    const profileLeanMock = vi.fn().mockResolvedValue(mockProfile);
    vi.mocked(ProfileModel.findOne).mockReturnValue({ lean: profileLeanMock } as any);

    const GET_PORTFOLIO_QUERY = `#graphql
      query GetPortfolio {
        getPortfolio {
          profile {
            id
            title
          }
          projects {
            id
            title
          }
          skills {
            id
            name
          }
          experiences {
            id
            company
          }
        }
      }
    `;

    // 2. ACT: Execute the GraphQL operation
    const response = await testServer.executeOperation({
      query: GET_PORTFOLIO_QUERY,
    });

    // 3. ASSERT: Verify the response
    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined();
      const portfolioData = response.body.singleResult.data?.getPortfolio as {
        profile: { id: string; title: string };
        projects: Array<{ id: string; title: string }>;
        skills: Array<{ id: string; name: string }>;
        experiences: Array<{ id: string; company: string }>;
      };
      expect(portfolioData.profile.title).toBe('Full Stack Developer');
      expect(portfolioData.projects[0].title).toBe('Portfolio API');
      expect(portfolioData.skills[0].name).toBe('TypeScript');
      expect(portfolioData.experiences[0].company).toBe('Tech Corp');
    }
  });
});
