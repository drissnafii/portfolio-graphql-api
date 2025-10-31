import { mergeTypeDefs } from '@graphql-tools/merge';
import { authTypeDefs } from './auth.typeDefs.js';
import { baseTypeDefs } from './base.typeDefs.js';
import { experienceTypeDefs } from './experience.typeDefs.js';
import { portfolioTypeDefs } from './portfolio.typeDefs.js';
import { profileTypeDefs } from './profile.typeDefs.js';
import { projectTypeDefs } from './project.typeDefs.js';
import { projectSkillTypeDefs } from './projectSkill.typeDefs.js';
import { skillTypeDefs } from './skill.typeDefs.js';
import { userTypeDefs } from './user.typeDefs.js';

export const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  authTypeDefs,
  userTypeDefs,
  profileTypeDefs,
  experienceTypeDefs,
  projectTypeDefs,
  skillTypeDefs,
  projectSkillTypeDefs,
  portfolioTypeDefs,
]);

