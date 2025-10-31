import merge from 'lodash.merge';
import { authResolvers } from './auth.resolvers.js';
import { experienceResolvers } from './experience.resolvers.js';
import { portfolioResolvers } from './portfolio.resolvers.js';
import { profileResolvers } from './profile.resolvers.js';
import { projectResolvers } from './project.resolvers.js';
import { projectSkillResolvers } from './projectSkill.resolvers.js';
import { skillResolvers } from './skill.resolvers.js';
import { userResolvers } from './user.resolvers.js';
import { dateScalar } from './scalars.js';

export const resolvers = merge(
  { Date: dateScalar },
  authResolvers,
  userResolvers,
  profileResolvers,
  experienceResolvers,
  projectResolvers,
  skillResolvers,
  portfolioResolvers,
  projectSkillResolvers
);
