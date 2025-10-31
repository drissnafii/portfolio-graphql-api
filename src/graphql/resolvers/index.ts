import { authResolvers } from './auth.resolvers.js';
import { experienceResolvers } from './experience.resolvers.js';
import { portfolioResolvers } from './portfolio.resolvers.js';
import { profileResolvers } from './profile.resolvers.js';
import { projectResolvers } from './project.resolvers.js';
import { projectSkillResolvers } from './projectSkill.resolvers.js';
import { skillResolvers } from './skill.resolvers.js';
import { userResolvers } from './user.resolvers.js';
import { dateScalar } from './scalars.js';

const mergeSections = (...sections: Array<Record<string, unknown> | undefined>) =>
  sections.reduce<Record<string, unknown>>((acc, section) => {
    if (!section) {
      return acc;
    }
    return { ...acc, ...section };
  }, {});

export const resolvers = {
  Date: dateScalar,
  Query: mergeSections(
    userResolvers.Query,
    profileResolvers.Query,
    experienceResolvers.Query,
    projectResolvers.Query,
    skillResolvers.Query,
    portfolioResolvers.Query
  ),
  Mutation: mergeSections(
    authResolvers.Mutation,
    userResolvers.Mutation,
    profileResolvers.Mutation,
    experienceResolvers.Mutation,
    projectResolvers.Mutation,
    skillResolvers.Mutation
  ),
  Profile: profileResolvers.Profile,
  Experience: experienceResolvers.Experience,
  Project: projectResolvers.Project,
  Skill: skillResolvers.Skill,
  PortfolioPayload: portfolioResolvers.PortfolioPayload,
  ProjectSkill: projectSkillResolvers.ProjectSkill,
};

